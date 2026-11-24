/**
 * Excerpt from Kiln (src/shared/quality.ts).
 * Shown for illustration only. The full source code is available at https://store.mikodes.com/p/kiln/
 *
 * The checklist shown in the editor and before publishing. Every check is something the site owner can fix, and the score
 * is just the share of checks that pass. The AI is told to write a bracketed placeholder instead of inventing a fact, and
 * one check reports any leftover "[Client name]"-style placeholder as an error, so nothing invented slips through unnoticed.
 */

export interface Check {
  id: string;
  ok: boolean;
  severity: "error" | "warning";
  message: string;
  pageId?: string;
  blockId?: string;
}

// …

export function checkSite(site: Site): Check[] {
  const checks: Check[] = [];
  const add = (c: Check) => checks.push(c);
  const titles = new Map<string, string>();
  for (const page of site.pages) {
    const name = page.title || "(untitled)";
    const title = pageTitle(site, page, site.defaultLocale);
    const desc = pageDescription(site, page, site.defaultLocale);
    add({ id: `title-${page.id}`, pageId: page.id, severity: "warning", ok: title.length >= 10 && title.length <= 65,
      message: `${name}: page title is ${title.length} characters (aim for 10–65).` });
    add({ id: `desc-${page.id}`, pageId: page.id, severity: "warning", ok: desc.length >= 50 && desc.length <= 160,
      message: `${name}: description is ${desc.length} characters (aim for 50–160).` });
    if (titles.has(title)) add({ id: `dup-${page.id}`, pageId: page.id, severity: "warning", ok: false, message: `${name}: same title as ${titles.get(title)}.` });
    titles.set(title, name);
    const hasH1 = page.blocks.some((b) => b.type === "hero" && String(b.props.title ?? "").trim());
    add({ id: `h1-${page.id}`, pageId: page.id, severity: "warning", ok: hasH1, message: `${name}: has a hero headline (the page's H1).` });
    for (const { blockId, img } of images(page)) {
      if (!img.alt.trim()) add({ id: `alt-${blockId}-${img.src.slice(-24)}`, pageId: page.id, blockId, severity: "warning", ok: false, message: `${name}: an image has no alt text.` });
    }
    for (const b of page.blocks) {
      const ph = findPlaceholders(b);
      if (ph.length) {
        add({ id: `ph-${b.id}`, pageId: page.id, blockId: b.id, severity: "error", ok: false,
          message: `${name}: ${BLOCK_MAP[b.type]?.label ?? b.type} still has ${ph.length} placeholder${ph.length > 1 ? "s" : ""} like "[Client name]".` });
      }
    }
    for (const locale of site.locales.filter((l) => l !== site.defaultLocale)) {
      const map = site.i18n[locale] ?? {};
      const missing = page.blocks.filter((b) => localizeBlock(b, map) === b && stripTags(JSON.stringify(b.props)).length > 40).length;
      if (missing) add({ id: `tr-${page.id}-${locale}`, pageId: page.id, severity: "warning", ok: false, message: `${name}: ${missing} section(s) not translated to ${locale.toUpperCase()}.` });
    }
  }
  for (const w of themeWarnings(site.theme)) add({ id: `contrast-${checks.length}`, severity: "warning", ok: false, message: `Theme: ${w}` });
  const hasForm = site.pages.some((p) => p.blocks.some((b) => b.type === "contact"));
  add({ id: "contact", severity: "warning", ok: hasForm, message: "The site has a contact form." });
  return checks;
}

export function score(checks: Check[]): number {
  if (!checks.length) return 100;
  return Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
}
