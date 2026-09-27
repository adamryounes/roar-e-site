# ROAR-E — studio & game website

Static site for **ROAR-E** (working subtitle *Peril & Pride*), the hand-painted corridor-3D platformer by ALPHA 444 IP Pty Ltd. Built to be the public, functional company/game site that Apple Developer Program (Organisation) enrolment requires — and to be a real marketing site once the game is announced.

No build step. No frameworks. No cookies, no analytics, no third-party requests (fonts are self-hosted). Open `index.html` or serve the folder.

## Run locally

```
python -m http.server 8090
# then open http://localhost:8090/
```

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home: wordmark hero, story, five worlds, modes + dev window (pre-alpha clip), teaser, cast, **Our promise to players**, studio + contact, footer |
| `support.html` | Contact + FAQ (platforms, release, pricing model, controllers, accessibility, refunds, press) |
| `privacy.html` | Website privacy policy (collects nothing) + **draft** game privacy notice |
| `404.html` | Not-found page (GitHub Pages and Cloudflare Pages pick it up automatically) |
| `robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll` | Crawling / hosting plumbing. `CNAME` = `roare.app` |
| `favicon.svg`, `favicon-32.png`, `icon-192.png`, `apple-touch-icon.png` | Icons (mane starburst + Lilita "R") |
| `media/og.jpg` | 1200×630 social image (regenerate from `scripts/og-source.html`, see below) |

## Owner values — ONE place

Everything owner-specific lives in **`site.config.js`** and is injected into the pages at load by `js/site.js` (`data-site="KEY"` spans, `data-site-href` links, `data-site-block` fragments that hide when a value is empty).

| Key | Current value | Notes |
|---|---|---|
| `COMPANY_LEGAL_NAME` | `ALPHA 444 IP Pty Ltd` | Verbatim ASIC name |
| `ACN` | `686 955 028` | |
| `ABN` | `""` (empty) | **Placeholder — fill in when issued.** While empty, every "ABN …" fragment on the site is hidden. |
| `CONTACT_EMAIL` | `hello@roare.app` | Must exist as a real mailbox before Apple enrolment (see `DEPLOY.md`) |
| `DOMAIN` | `roare.app` | Also in `CNAME`, `sitemap.xml`, `robots.txt` and every canonical/OG URL |
| `LOCATION` | `Australia` | |
| `HOSTING_PROVIDER` / `HOSTING_PRIVACY_URL` | GitHub Pages | Change if you deploy on Cloudflare Pages (the privacy policy names the host) |
| `POLICY_UPDATED` | `27 September 2026` | Bump when you change the policy or support page |
| `SOCIAL.*` | all empty | Fill with full URLs; empty networks are hidden. **Placeholders.** |

### Bake the values into the HTML (recommended before go-live)

The pages also carry the current values as static text, so they read correctly with JavaScript off and in the JSON-LD. After editing `site.config.js`, run:

```
node scripts/bake-config.mjs
```

It rewrites the static text in every page (`ABN`, company name, email, domain) to match the config. Safe to run repeatedly. Requires Node 18+.

## Media

| File(s) | Source |
|---|---|
| `media/gameplay.mp4` / `.webm` / `gameplay-poster.jpg` / `shot-1..3.jpg` | Engine capture of the current pre-alpha build (greybox levels, finished props; Rory's rig not yet animated — the captions say so). Replace in place to update the dev window. |
| `media/teaser.mp4` / `teaser-poster.jpg` | Cinematic teaser, July 2026 (`ROAR-E_Trailer_FINAL_v2.4_scored.mp4`), re-encoded 720p |
| `media/w*-*.avif/.webp`, `mode-*`, `story-*`, `kip-beach` | Stills from the teaser |
| `media/cover.*`, `media/key-art.*` | Key art (`Roar-E Cover Final.png`) and its 16:9 crop |
| `media/*-cut.webp` | Character portraits with backgrounds removed (Rory v3 "Big-Head Maniac", Kip, Nyra, Rook) |
| `media/rory-confused.*` | 404 art, from the Rory expression sheet |
| `media/og.jpg` | Rendered from `scripts/og-source.html` at 1200×630 |

Images are AVIF + WebP (`<picture>`), lazy-loaded below the fold. Page weight excluding video is under 1 MB.

### Regenerate the social image

Serve the folder, then screenshot `scripts/og-source.html` at 1200×630 with any headless browser, e.g. Edge on Windows:

```
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1200,630 --screenshot=og.png http://localhost:8090/scripts/og-source.html
```

then save it as `media/og.jpg`.

## Fonts

Lilita One (display) and Barlow / Barlow Condensed (text, labels), self-hosted as latin-subset WOFF2 under SIL OFL 1.1 — licences in `fonts/`.

## Rules baked into this site

- No cookies, no storage, no trackers, no third-party scripts or fonts — the privacy policy says so, keep it true.
- Marketing tone per the Production Bible: "Saturday-morning cartoon with teeth"; no *family-friendly / adorable / baby / gentle* in copy; Cubs stay a footnote.
- The "Our promise to players" list is the verbatim Vol 2 §1.2 contract. Do not soften it.

## Deploying

See `DEPLOY.md`. Repository is private and GitHub Pages is **not** enabled until the owner decides to go live.
