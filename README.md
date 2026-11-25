<p align="center">
  <img src="assets/logo.png" width="72" alt="Kiln logo">
</p>

<h1 align="center">Kiln</h1>

<p align="center">
  <b>White-label AI website builder for agencies (Node.js).</b>
</p>

<p align="center"><sub>AI website builder source code · white-label SaaS for agencies · brief to website · self-hosted</sub></p>

<p align="center">
  <a href="https://kiln-demo.mikodes.com/"><b>▶ Live demo</b></a> ·
  <a href="https://store.mikodes.com/p/kiln/"><b>Get the full source code</b></a>
</p>

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white">
  <img alt="Version" src="https://img.shields.io/badge/version-1.1.1-111">
</p>

<p align="center">
  <img src="assets/hero.gif" width="100%" alt="Kiln">
</p>

> **This repository is a showcase.** It holds screenshots, documentation pointers and a real excerpt
> from the code. The full application is sold as source code at
> **[store.mikodes.com/p/kiln](https://store.mikodes.com/p/kiln/)**: one payment, instant ZIP download, free setup help.

---

## What it is

A client brief becomes a multi-page website: an editable page plan, then each page written with live progress, a visual canvas editor, client review and one-click publishing.

## Screens

<p align="center"><img src="assets/canvas.png" width="49%" alt="Canvas"> <img src="assets/publish.png" width="49%" alt="Publish"></p>
<p align="center"><img src="assets/review.png" width="49%" alt="Review"> <img src="assets/phones.png" width="49%" alt="Phones"></p>

## Features

- **Brief to multi-page site with AI, in stages**: Brief, editable page plan, then each page written separately with live progress.
- **Draft engine without AI**: Structured draft from the brief, free.
- **Rebuild from an existing website URL**: Reads the client's current public page into the brief.
- **Visual block editor**: Live canvas at real device width, text editing on the canvas, drag sections, floating toolbar, undo/redo, autosave, versions, ⌘K palette.
- **AI section rewrite, AI page chat, AI translation, AI blog drafts**: Every AI change is validated against the section shape and undoable.
- **Bring your own AI key: Claude, OpenAI, OpenRouter, any OpenAI-compatible endpoint**: Default claude-opus-5-5.
- **16 style presets, 16 templates, agency templates**: Agencies save any site as a template for every workspace.
- **Built-in hosting with sites domain and verified custom domains**: Sites live at <site>.<your domain>.
- **Publish to the agency's own Cloudflare account**: Workers static assets via the direct-upload API, workers.dev URL, custom domains in the account's zones. Tested against a mocked API only.
- **Clean code export: static HTML and Astro project**: ZIP with media, sitemap, robots and a working form.
- **Client review links**: Client approves or requests changes without an account.
- **Workspaces with owner, editor, client and viewer roles**: Client role edits texts and images only.

## How it works

A technical case study of the architecture, one end-to-end flow, the key engineering decisions and how you would build something like this: **[docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md)**.

## A look at the code

Real excerpts from the source, shown for illustration:

- **SSRF guard for "Rebuild from a website URL"** ([`snippets/ssrf-guard.ts`](snippets/ssrf-guard.ts)): Recognises private, loopback, link-local, NAT64 and 6to4 addresses in every IPv4 and IPv6 spelling, so the server can never be tricked into reading an internal network.
- **Sandboxed preview of generated sites** ([`snippets/sandboxed-preview-csp.ts`](snippets/sandboxed-preview-csp.ts)): A generated site is served on the builder's own address inside a sandbox with a strict Content-Security-Policy, so the page is an opaque origin that cannot read the builder's cookies or call its API; only the builder's own script runs, pinned by hash.
- **SEO and quality checklist** ([`snippets/site-quality-checks.ts`](snippets/site-quality-checks.ts)): Every check is something the site owner can fix, from title and description length to missing alt text, untranslated sections and leftover "[Client name]" placeholders. The score is simply the share of checks that pass.

## Requirements (full version)

- Node.js 22.12 or newer and npm
- A Linux server or VPS
- Build tools for better-sqlite3 when no prebuilt binary exists
- Own AI provider account and key
- Optional: own Stripe, Cloudflare, Resend and Pexels accounts

Not included: Hosting, server, domain and TLS certificates; AI provider usage; Stripe fees; Cloudflare plan limits above the free tier; Resend plan.

## FAQ

**Is this the full source code?**  
No. This repository is a showcase with screenshots, a technical case study and real code excerpts. The complete Kiln source code is sold at [store.mikodes.com/p/kiln](https://store.mikodes.com/p/kiln/).

**What is Kiln built with?**  
Vite.

**Can I try it before buying?**  
Yes, open the [live demo](https://kiln-demo.mikodes.com/).

**Do I get help with the installation?**  
Free setup help is included with the store purchase; questions go to [mikodes.com/support](https://mikodes.com/support).

## Get the full source code

<p align="center">
  <a href="https://store.mikodes.com/p/kiln/"><img src="https://img.shields.io/badge/Get%20the%20full%20source%20code-store.mikodes.com-4F2BFF?style=for-the-badge" alt="Get the full source code"></a>
</p>

One payment, full licence, instant ZIP download and free setup help.
Questions: [mikodes.com/support](https://mikodes.com/support).

---

<p align="center">
  Made by <a href="https://mikodes.com"><b>MIKODES</b></a> · <a href="https://github.com/Mikodesteam">more projects</a>
</p>
