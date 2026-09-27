/* =====================================================================
   ROAR-E site configuration — THE ONE PLACE for owner-specific values.
   Edit these, save, done. Every page reads them at load (js/site.js).
   Values in [SQUARE BRACKETS] are placeholders that must be filled in
   before the site goes live (see README.md → "Placeholders to fill").
   ===================================================================== */
window.SITE = {
  // Legal entity that publishes the site and the game (verbatim, as registered with ASIC).
  COMPANY_LEGAL_NAME: "ALPHA 444 IP Pty Ltd",

  // Australian Company Number.
  ACN: "686 955 028",

  // Australian Business Number, formatted "12 345 678 901".
  // Leave "" until it is issued: every "ABN …" fragment on the site stays hidden while this is empty.
  ABN: "",

  // Public contact address on the site's own domain (Apple checks this).
  CONTACT_EMAIL: "hello@roare.app",

  // Canonical domain, no protocol, no trailing slash.
  DOMAIN: "roare.app",

  // Where the studio is based (used in the About section and the privacy policy).
  LOCATION: "Australia",

  // Hosting provider named in the privacy policy (server logs disclosure).
  // Change to "Cloudflare Pages (Cloudflare, Inc.)" and the Cloudflare privacy
  // URL if you deploy via Cloudflare instead of GitHub Pages.
  HOSTING_PROVIDER: "GitHub Pages (GitHub, Inc.)",
  HOSTING_PRIVACY_URL: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",

  // Date shown on the privacy policy and support page ("last updated").
  POLICY_UPDATED: "27 September 2026",

  // Social links. Leave empty ("") to hide a network. Full URLs.
  SOCIAL: {
    youtube: "",
    instagram: "",
    tiktok: "",
    x: "",
    discord: "",
    bluesky: ""
  }
};
