/**
 * Excerpt from Kiln (src/server/preview-policy.ts).
 * Shown for illustration only. The full source code is available at https://store.mikodes.com/p/kiln/
 *
 * A generated site is shown inside the builder on the builder's own address, so it is served in a sandbox with a strict
 * Content-Security-Policy. The page becomes an opaque origin: even if a script got in, it could not read the builder's
 * cookies or call its API. Only the builder's own site script runs, pinned by its SHA-256 hash.
 */

import { createHash } from "node:crypto";

// …

/** CSP hash of the inline site script exactly as renderPage writes it with inlineAssets. */
export const SITE_JS_HASH = `'sha256-${createHash("sha256").update(SITE_JS).digest("base64")}'`;

// …

/**
 * Headers for a site page shown on the builder origin. `origin` is the builder's own origin (forms post there,
 * media load from there); `scripts` are the CSP hashes of the inline scripts the page may run.
 */
export function previewHeaders(origin: string, demoMode: boolean, scripts: string[] = [SITE_JS_HASH]): Record<string, string> {
  const self = origin ? `'self' ${origin}` : "'self'";
  const csp = [
    // allow-same-origin is deliberately missing: the page runs as an opaque origin.
    "sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox",
    "default-src 'none'",
    `script-src ${scripts.length ? scripts.join(" ") : "'none'"}`,
    `style-src 'unsafe-inline' ${self} https://fonts.bunny.net`,
    `font-src ${self} https://fonts.bunny.net data:`,
    `img-src ${self} https: data:`,
    `media-src ${self} https:`,
    `connect-src ${self}`,
    `form-action ${self}`,
    // Click-to-load embeds (maps, videos, booking) are always third-party https frames.
    "frame-src https:",
    "base-uri 'none'",
    "object-src 'none'",
    `frame-ancestors ${self}${demoMode ? ` ${PREVIEW_ORIGIN}` : ""}`,
  ].join("; ");
  return { "content-security-policy": csp, "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "permissions-policy": "camera=(), microphone=(), geolocation=()" };
}
