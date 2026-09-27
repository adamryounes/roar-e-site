#!/usr/bin/env node
/* Optional helper: bake the values from site.config.js into the HTML files so
   they are correct even with JavaScript disabled (and for crawlers reading the
   JSON-LD). Safe to run repeatedly. Usage, from the site root:
       node scripts/bake-config.mjs
   It replaces the placeholder strings "[COMPANY LEGAL NAME PTY LTD]" and "[ABN]",
   and — if you changed them in site.config.js — the contact email and domain. */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, "site.config.js"), "utf8"), sandbox);
const C = sandbox.window.SITE;
if (!C) { console.error("site.config.js did not define window.SITE"); process.exit(1); }

/* The values the HTML was shipped with. If you change a value in site.config.js,
   the static text is swapped from these to the new value. */
const shipped = { COMPANY_LEGAL_NAME: "ALPHA 444 IP Pty Ltd", ACN: "686 955 028", DOMAIN: "roare.app", CONTACT_EMAIL: "hello@roare.app" };
const swaps = [
  [shipped.COMPANY_LEGAL_NAME, C.COMPANY_LEGAL_NAME],
  [shipped.CONTACT_EMAIL, C.CONTACT_EMAIL],
  [shipped.DOMAIN, C.DOMAIN],
  ['<span data-site="ACN">' + shipped.ACN + '</span>', '<span data-site="ACN">' + (C.ACN || "") + '</span>'],
  ['<strong data-site="ACN">' + shipped.ACN + '</strong>', '<strong data-site="ACN">' + (C.ACN || "") + '</strong>']
];

const files = readdirSync(root).filter((f) => f.endsWith(".html")).concat(["sitemap.xml", "robots.txt", "CNAME"]);
for (const f of files) {
  const p = join(root, f);
  let s = readFileSync(p, "utf8"); const before = s;
  for (const [from, to] of swaps) {
    if (!to || to === from) continue;
    s = s.split(from).join(to);
  }
  /* ABN: fill the span and un-hide its fragment when a value exists; otherwise keep it hidden and empty. */
  s = s.replace(/<span data-site="ABN">[^<]*<\/span>/g, '<span data-site="ABN">' + (C.ABN || "") + "</span>");
  s = s.replace(/<strong data-site="ABN">[^<]*<\/strong>/g, '<strong data-site="ABN">' + (C.ABN || "") + "</strong>");
  s = C.ABN
    ? s.replace(/(<(?:span|li) data-site-block="ABN") hidden>/g, "$1>")
    : s.replace(/(<(?:span|li) data-site-block="ABN")>/g, "$1 hidden>");
  if (s !== before) { writeFileSync(p, s); console.log("updated", f); }
}
console.log("done");
