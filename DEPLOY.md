# DEPLOY.md — taking roare.app live

Short and exact. Do these in order. Nothing here is done yet: the repo is private and Pages is off.

## 1. Register the domain

1. Register **roare.app** at a registrar (Cloudflare Registrar, Porkbun or Namecheap are fine; `.app` is ~A$25/yr). Optional defensive extras: `roar-e.game`, `roare.com.au` (needs the ACN/ABN for `.com.au`), `roare.games`.
2. `.app` is an HSTS-preloaded TLD: browsers will only load it over HTTPS. Both hosts below issue certificates automatically; the site simply won't load until the certificate exists (up to an hour after DNS propagates). Don't panic in that hour.
3. Turn on WHOIS privacy and registrar lock.

## 2. Host the site (pick one)

### Option A — GitHub Pages (simplest)

Private repos can only use Pages on GitHub Pro/Team/Enterprise. On a Free plan, make the repo **public** first (Settings → General → Danger Zone → Change visibility). Nothing in the repo is secret; `_review/` and `media/_raw/` are git-ignored.

1. Repo → **Settings → Pages** → *Build and deployment* → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.
2. Same page → *Custom domain*: enter `roare.app` → Save. (The `CNAME` file in the repo already contains `roare.app`; GitHub will keep it in sync.)
3. DNS at the registrar (apex + www):

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA (optional) | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
   | CNAME | `www` | `adamryounes.github.io` |

4. Recommended: verify the domain on your account so nobody can hijack it — GitHub profile → **Settings → Pages → Add a domain** → `roare.app` → add the `TXT` record it shows (`_github-pages-challenge-adamryounes`) → Verify.
5. Back in the repo's Pages settings, wait for the DNS check to pass, then tick **Enforce HTTPS** (it becomes available once the certificate is issued).
6. Check `https://roare.app/`, `https://www.roare.app/` (redirects to apex) and `https://roare.app/nope` (serves `404.html`).

### Option B — Cloudflare Pages (keeps the repo private, free)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → authorise GitHub → select `adamryounes/roar-e-site`.
2. Build settings: Framework preset **None**, Build command **(leave empty)**, Build output directory **/**. Save and Deploy. You get `roar-e-site.pages.dev`.
3. Project → **Custom domains → Set up a custom domain** → `roare.app`, then again for `www.roare.app`.
   - If the domain's DNS is on Cloudflare (move the nameservers there — free, and it makes apex CNAMEs work), the records are created for you.
   - Otherwise add `CNAME roare.app → roar-e-site.pages.dev` (apex CNAME needs a registrar that supports ALIAS/ANAME flattening) and `CNAME www → roar-e-site.pages.dev`.
4. HTTPS is automatic. `404.html` is served for unknown routes automatically. Every push to `main` redeploys.
5. Update `HOSTING_PROVIDER` / `HOSTING_PRIVACY_URL` in `site.config.js` to Cloudflare (privacy policy names the host), run `node scripts/bake-config.mjs`, commit.

## 3. Create the hello@roare.app mailbox

Apple sends enrolment and account emails to the Account Holder's Apple ID email; using an address on the company's own domain is the clean way to associate the site with the organisation.

**Recommended — Google Workspace (Business Starter, ~A$10/user/month):**
1. workspace.google.com → Get started → use `roare.app` → verify ownership via the TXT record Google gives you.
2. Add the MX record it gives you (`smtp.google.com`, priority 1) at the registrar/Cloudflare.
3. Create the user **hello@roare.app**. Add SPF (`v=spf1 include:_spf.google.com ~all`) and DMARC (`_dmarc` TXT: `v=DMARC1; p=none; rua=mailto:hello@roare.app`) records; turn on DKIM in the Workspace admin.

**Cheaper — forwarding only:** Cloudflare Email Routing (free, if DNS is on Cloudflare) or the registrar's forwarding: `hello@roare.app → your existing inbox`. Receiving works immediately; to *send* as hello@ you'd add it in Gmail as a "Send mail as" address via an SMTP relay. Fine for Apple's verification emails; a real mailbox is better for support.

Test: send yourself a mail to hello@roare.app and reply from it.

## 4. What Apple checks (Developer Program, Organisation enrolment)

- **Legal entity**: name exactly as registered with ASIC — `ALPHA 444 IP Pty Ltd`. Apple looks it up via **D-U-N-S**. Get a D-U-N-S number first (free, 5–30 business days): https://developer.apple.com/enroll/duns-lookup/ — the entity name, address and phone you give D&B must match ASIC and what you enter at Apple.
- **Website**: a publicly available, functional site on a domain associated with the organisation. This site qualifies once it is live at `https://roare.app/` with the placeholders filled: real company name and ACN/ABN in the footer and About section, a working contact email on the domain, a privacy page, and content that clearly describes the company and its product. Do not put "under construction" anywhere.
- **Account Holder**: a person with legal authority to bind the company (director), enrolling with an Apple ID whose email is ideally `@roare.app`; two-factor authentication on; a phone number Apple can call (they sometimes do).
- **Payment**: US$99/yr; enrol in the **Small Business Program** afterwards (15% commission under US$1M). Google Play needs a one-off US$25 and, for organisation accounts, also a D-U-N-S number and a developer website + privacy policy URL — this site covers both.
- The **privacy policy URL** you will later enter in App Store Connect / Play Console is `https://roare.app/privacy.html`. Finalise section 10 ("draft") before store submission.

## 5. Fill the placeholders

1. `site.config.js`: `ABN` (when issued) and any `SOCIAL` links. Company name and ACN are already in.
2. `node scripts/bake-config.mjs` → commit → push. The page text, JSON-LD and footer update everywhere.
3. Update `POLICY_UPDATED` when you touch the privacy or support page.

## 6. Go-live checklist

- [ ] Domain registered, DNS records added, certificate issued, HTTPS enforced
- [ ] `https://roare.app/`, `/support.html`, `/privacy.html`, a bad URL (404) all load
- [ ] hello@roare.app receives and sends
- [ ] ABN filled (or fine to leave hidden until issued), social links filled or left empty
- [ ] Share `https://roare.app/` in a Slack/iMessage to confirm the social card (`media/og.jpg`) renders
- [ ] D-U-N-S number received → start Apple enrolment with the Account Holder's @roare.app Apple ID
