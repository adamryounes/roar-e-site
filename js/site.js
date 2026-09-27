/* ROAR-E site behaviour. No dependencies, no cookies, no storage, no network calls.
   1. Injects owner values from site.config.js into [data-site] / [data-site-href] elements.
   2. Scroll reveals (IntersectionObserver) — respects prefers-reduced-motion.
   3. Gameplay video: mute toggle + graceful fallback to key art if the files are missing.
   4. Teaser: click-to-play. */
(function () {
  "use strict";
  var C = window.SITE || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Config injection ---- */
  function get(key) {
    return key.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, C);
  }
  document.querySelectorAll("[data-site]").forEach(function (el) {
    var v = get(el.getAttribute("data-site"));
    if (typeof v === "string" && v.length) { el.textContent = v; }
  });
  /* Fragments that only make sense with a value (e.g. "ABN …") show/hide with the config. */
  document.querySelectorAll("[data-site-block]").forEach(function (el) {
    var v = get(el.getAttribute("data-site-block"));
    el.hidden = !(typeof v === "string" && v.length);
  });
  document.querySelectorAll("[data-site-href]").forEach(function (el) {
    var spec = el.getAttribute("data-site-href"); // e.g. "mailto:CONTACT_EMAIL?subject=Hello" or "HOSTING_PRIVACY_URL"
    var href = spec.replace(/\b[A-Z][A-Z0-9_.]+\b/g, function (k) { var v = get(k); return typeof v === "string" && v.length ? v : k; });
    if (href !== spec) { el.setAttribute("href", href); }
  });
  /* Social links: render only the networks that have a URL. */
  var social = document.querySelector("[data-social]");
  if (social && C.SOCIAL) {
    var labels = { youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok", x: "X", discord: "Discord", bluesky: "Bluesky" };
    Object.keys(C.SOCIAL).forEach(function (k) {
      var url = C.SOCIAL[k];
      if (!url) { return; }
      var li = document.createElement("li"); var a = document.createElement("a");
      a.href = url; a.rel = "me noopener"; a.target = "_blank"; a.textContent = labels[k] || k; li.appendChild(a); social.appendChild(li);
    });
    if (!social.children.length) { var block = social.closest("[data-social-block]"); if (block) { block.hidden = true; } }
  }

  /* ---- 2. Scroll reveals ---- */
  var items = document.querySelectorAll("[data-reveal]");
  if (items.length && !reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- 3. Gameplay video ---- */
  var tv = document.querySelector(".tv");
  var vid = tv && tv.querySelector(".tv__video");
  if (tv && vid) {
    var fallback = function () { tv.classList.add("is-fallback"); };
    var lastSource = vid.querySelector("source:last-of-type");
    if (lastSource) { lastSource.addEventListener("error", fallback); }
    vid.addEventListener("error", fallback);
    /* If neither source can be used within a few seconds, fall back to key art. */
    var check = setTimeout(function () { if (vid.networkState === 3 /* NETWORK_NO_SOURCE */) { fallback(); } }, 4000);
    vid.addEventListener("loadeddata", function () { clearTimeout(check); });
    /* Play only while on screen (saves 2 MB for people who never scroll there); with reduced motion, show the poster + controls instead. */
    var tryPlay = function () { var p = vid.play(); if (p && p.catch) { p.catch(function () { vid.setAttribute("controls", ""); }); } };
    if (reduce) { vid.pause(); vid.setAttribute("controls", ""); }
    else if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { tryPlay(); } else if (!vid.paused) { vid.pause(); } });
      }, { threshold: 0.25 }).observe(vid);
    } else { tryPlay(); }
    var mute = tv.querySelector(".tv__mute");
    if (mute) {
      mute.addEventListener("click", function () {
        vid.muted = !vid.muted;
        mute.setAttribute("aria-pressed", vid.muted ? "true" : "false");
        mute.setAttribute("aria-label", vid.muted ? "Unmute gameplay video" : "Mute gameplay video");
      });
    }
  }

  /* ---- 4. Teaser click-to-play ---- */
  var teaser = document.querySelector(".teaser");
  if (teaser) {
    var tv2 = teaser.querySelector("video"); var btn = teaser.querySelector(".teaser__play");
    if (tv2 && btn) {
      btn.addEventListener("click", function () {
        teaser.classList.add("is-playing"); tv2.setAttribute("controls", ""); tv2.muted = false;
        var p2 = tv2.play(); if (p2 && p2.catch) { p2.catch(function () {}); }
      });
      tv2.addEventListener("ended", function () { teaser.classList.remove("is-playing"); });
    }
  }
})();
