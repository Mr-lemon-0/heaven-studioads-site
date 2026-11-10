/* i18n.js — DOM glue over i18n-core. Applies language, direction, prices and the switcher.
   Rules: no string guessing, no regex over page text. Only declared hooks: [data-i18n] and [data-price]. */
(function () {
  "use strict";
  var core = window.HSi18n;
  if (!core) return;

  var STORE_KEY = "hs_lang";
  var NAMES = { en: "EN", es: "ES", pt: "PT", de: "DE", fr: "FR", ar: "AR" };

  function param(name) {
    try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; }
  }
  function saved() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function remember(lang) {
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  function renderText(lang) {
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-i18n");
      var fallback = el.getAttribute("data-i18n-fallback") || el.textContent;
      var value = core.t(lang, key, fallback);
      if (key === "h1") el.innerHTML = value; else el.textContent = value;
    }
  }

  function renderPrices(market) {
    var nodes = document.querySelectorAll("[data-price]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var kind = el.getAttribute("data-price");
      var text = core.formatPrice(kind, market);
      if (text) el.textContent = text;
    }
    var pkgEls = document.querySelectorAll("[data-pkg]");
    for (var k = 0; k < pkgEls.length; k++) {
      var pkg = pkgEls[k].getAttribute("data-pkg");
      if (pkg && /trial/i.test(pkg)) pkgEls[k].setAttribute("data-pkg", "Paid Trial, " + core.formatPrice("trial", market));
      else if (pkg && /monthly|month/i.test(pkg)) pkgEls[k].setAttribute("data-pkg", "Monthly, " + core.formatPrice("monthly", market));
    }
    document.documentElement.setAttribute("data-market", market.toLowerCase());
  }

  function renderLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = core.dir(lang);
    renderText(lang);
    if (lang !== "en") {
      var h1 = document.getElementById("hero-h");
      if (h1) h1.removeAttribute("data-split");
    }
    buildSwitcher(lang);
  }

  function buildSwitcher(current) {
    var old = document.getElementById("langSwitch");
    if (old) old.parentNode.removeChild(old);
    var box = document.createElement("div");
    box.id = "langSwitch";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Language");
    box.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:9999;display:flex;gap:4px;padding:6px;background:rgba(10,10,12,.85);border:1px solid rgba(255,255,255,.18);border-radius:999px;backdrop-filter:blur(8px)";
    core.LANGS.forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = NAMES[code];
      b.setAttribute("aria-pressed", String(code === current));
      b.style.cssText = "font:600 11px/1 system-ui,sans-serif;letter-spacing:.06em;padding:7px 9px;border-radius:999px;border:0;cursor:pointer;color:" +
        (code === current ? "#0b0b0d" : "#e8e8ea") + ";background:" + (code === current ? "#d8b678" : "transparent");
      b.addEventListener("click", function () {
        remember(code);
        var u = new URL(location.href);
        u.searchParams.set("lang", code);
        location.href = u.toString();
      });
      box.appendChild(b);
    });
    document.body.appendChild(box);
  }

  function paint(country) {
    var lang = core.resolveLang({
      param: param("lang"),
      saved: saved(),
      navigatorLang: navigator.languages ? navigator.languages.join(",") : navigator.language,
      country: country
    });
    renderLang(lang);
    renderPrices(core.resolveMarket({ param: param("market"), country: country }));
  }

  function boot() {
    var explicit = param("lang") || saved();
    if (explicit) { paint(param("country")); return; }
    fetch("https://ipwho.is/", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) { paint(d && d.country_code); })
      .catch(function () { paint(param("country")); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
