/**
 * Excerpt from Kiln (src/server/importer.ts). Shown for illustration only.
 * The full source code is available at https://store.mikodes.com/p/kiln/
 *
 * The SSRF guard behind "Rebuild from a website URL". It recognises private, loopback, link-local,
 * NAT64 and 6to4 addresses in every IPv4 and IPv6 spelling, so the server can never be tricked into
 * reading an internal network.
 */
import { isIP } from "node:net";

// HttpError: a small Error subclass carrying an HTTP status (defined elsewhere in the project)

function privateV4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number) as [number, number];
  return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19)) || a >= 224;
}

/** The 8 groups of an IPv6 address as numbers (handles :: and a dotted IPv4 tail), or null. */
function v6Groups(ip: string): number[] | null {
  let s = ip.toLowerCase().split("%")[0]!;
  const dotted = /(\d+\.\d+\.\d+\.\d+)$/.exec(s);
  if (dotted) {
    const [a, b, c, d] = dotted[1]!.split(".").map(Number) as [number, number, number, number];
    s = s.slice(0, -dotted[1]!.length) + `${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const [head, tail] = s.split("::") as [string, string | undefined];
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  if (tail === undefined && h.length !== 8) return null;
  const groups = [...h, ...Array(8 - h.length - t.length).fill("0"), ...t].map((g) => parseInt(g || "0", 16));
  return groups.length === 8 && groups.every((g) => Number.isInteger(g) && g >= 0 && g <= 0xffff) ? groups : null;
}

const v4From = (hi: number, lo: number) => `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;

/** True for addresses a server must never be tricked into calling, in every IPv4 and IPv6 spelling. */
export function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 4) return privateV4(ip);
  const g = v6Groups(ip);
  if (!g) return true;
  const zero5 = g.slice(0, 5).every((x) => x === 0);
  if (zero5 && (g[5] === 0xffff || g[5] === 0)) return g[6] === 0 && g[7]! <= 1 ? true : privateV4(v4From(g[6]!, g[7]!)); // ::ffff:a.b.c.d, ::a.b.c.d, ::, ::1
  if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((x) => x === 0)) return privateV4(v4From(g[6]!, g[7]!)); // NAT64
  if (g[0] === 0x2002) return privateV4(v4From(g[1]!, g[2]!)); // 6to4
  return (g[0]! & 0xfe00) === 0xfc00 || (g[0]! & 0xffc0) === 0xfe80 || (g[0]! & 0xff00) === 0xff00 || g[0] === 0x100 && g.slice(1, 4).every((x) => x === 0);
}

export type Resolver = (host: string) => Promise<string[]>;

export async function assertPublic(url: URL, resolve: Resolver): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new HttpError(422, "Only http and https addresses can be imported.");
  if (url.username || url.password) throw new HttpError(422, "Addresses with a user name or password cannot be imported.");
  if (url.port && !["80", "443", "8080"].includes(url.port)) throw new HttpError(422, "Only the standard web ports can be imported.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addrs = isIP(host) ? [host] : await resolve(host).catch(() => []);
  if (!addrs.length) throw new HttpError(422, `The domain ${host} does not resolve.`);
  if (addrs.some(isPrivateAddress)) throw new HttpError(422, "That address is not on the public internet.");
}
