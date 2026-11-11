/* i18n-core.js — pure logic, no DOM. Testable in node, used by i18n.js in the browser. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.HSi18n = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var LANGS = ["en", "es", "pt", "de", "fr", "ar"];
  var RTL = ["ar"];

  /* country -> language. Only markets where we actually sell. */
  var COUNTRY_LANG = {
    ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", UY: "es", EC: "es", GT: "es", CR: "es", PA: "es", DO: "es",
    BR: "pt", PT: "pt", AO: "pt", MZ: "pt",
    DE: "de", AT: "de", CH: "de",
    FR: "fr", BE: "fr", CA: "fr", LU: "fr",
    AE: "ar", SA: "ar", QA: "ar", KW: "ar", BH: "ar", OM: "ar", EG: "ar", JO: "ar"
  };

  var DICT = {
    es: {
      "h1": "Creatividad que <span class=\"accent\">se gana el feed.</span>",
      "h2.pricing": "Primero la prueba, luego la escala.",
      "h2.craft": "Del marco vacío al anuncio que detiene el scroll.",
      "h2.work": "Anuncios hechos para vivir en el feed.",
      "h2.faq": "Respuestas claras, sin letra pequeña.",
      "h2.contact": "Tu próxima campaña empieza con un correo.",
      "k.trial": "PRUEBA DE PAGO", "k.monthly": "PAQUETE MENSUAL", "k.custom": "A MEDIDA",
      "tag.hero": "ESTUDIO CREATIVO UGC CON IA, INDIA", "tag.craft": "EL OFICIO", "tag.work": "EL TRABAJO",
      "tag.onair": "EN EL AIRE", "tag.pricing": "PRECIOS", "tag.faq": "PREGUNTAS", "tag.ready": "CUANDO QUIERAS",
      "cta.work": "VER EL TRABAJO", "cta.trial": "RESERVAR LA PRUEBA", "cta.slot": "RESERVAR UN TURNO",
      "cta.quote": "PEDIR COTIZACIÓN", "cta.start": "EMPEZAR UN PROYECTO",
      "stat.sla": "DÍAS A LA PRIMERA VERSIÓN", "stat.videos": "VÍDEOS AL MES", "stat.qa": "CONTROL HUMANO",
      "price.onetime": "una vez", "price.permonth": "/ mes", "price.custom": "A medida por pieza"
    },
    pt: {
      "h1": "Criativo que <span class=\"accent\">conquista o feed.</span>",
      "h2.pricing": "Primeiro a prova, depois a escala.",
      "h2.craft": "Do quadro vazio ao anúncio que para o scroll.",
      "h2.work": "Anúncios feitos para viver no feed.",
      "h2.faq": "Respostas diretas, sem letras miúdas.",
      "h2.contact": "Sua próxima campanha começa com um e-mail.",
      "k.trial": "TESTE PAGO", "k.monthly": "PACOTE MENSAL", "k.custom": "SOB MEDIDA",
      "tag.hero": "ESTÚDIO CRIATIVO DE UGC COM IA, ÍNDIA", "tag.craft": "O OFÍCIO", "tag.work": "O TRABALHO",
      "tag.onair": "NO AR", "tag.pricing": "PREÇOS", "tag.faq": "PERGUNTAS", "tag.ready": "QUANDO QUISER",
      "cta.work": "VER O TRABALHO", "cta.trial": "RESERVAR O TESTE", "cta.slot": "RESERVAR UMA VAGA",
      "cta.quote": "PEDIR ORÇAMENTO", "cta.start": "COMEÇAR UM PROJETO",
      "stat.sla": "DIAS ATÉ A PRIMEIRA VERSÃO", "stat.videos": "VÍDEOS POR MÊS", "stat.qa": "REVISÃO HUMANA",
      "price.onetime": "uma vez", "price.permonth": "/ mês", "price.custom": "Sob medida por peça"
    },
    de: {
      "h1": "Kreatives, das sich <span class=\"accent\">den Feed verdient.</span>",
      "h2.pricing": "Erst der Beweis, dann die Skalierung.",
      "h2.craft": "Vom leeren Bild zum Ad, das den Scroll stoppt.",
      "h2.work": "Ads, gebaut für den Feed.",
      "h2.faq": "Klare Antworten, kein Kleingedrucktes.",
      "h2.contact": "Deine nächste Kampagne beginnt mit einer E-Mail.",
      "k.trial": "BEZAHLTER TEST", "k.monthly": "MONATSPAKET", "k.custom": "INDIVIDUELL",
      "tag.hero": "KI-UGC-KREATIVSTUDIO, INDIEN", "tag.craft": "DAS HANDWERK", "tag.work": "DIE ARBEIT",
      "tag.onair": "ON AIR", "tag.pricing": "PREISE", "tag.faq": "FRAGEN", "tag.ready": "WENN DU BEREIT BIST",
      "cta.work": "ARBEIT ANSEHEN", "cta.trial": "TEST BUCHEN", "cta.slot": "PLATZ SICHERN",
      "cta.quote": "ANGEBOT ANFORDERN", "cta.start": "PROJEKT STARTEN",
      "stat.sla": "TAGE BIS ZUR ERSTEN VERSION", "stat.videos": "VIDEOS PRO MONAT", "stat.qa": "MENSCHLICHE PRÜFUNG",
      "price.onetime": "einmalig", "price.permonth": "/ Monat", "price.custom": "Individuell pro Stück"
    },
    fr: {
      "h1": "Une création qui <span class=\"accent\">mérite le feed.</span>",
      "h2.pricing": "La preuve d'abord, ensuite l'échelle.",
      "h2.craft": "Du cadre vide à la pub qui arrête le scroll.",
      "h2.work": "Des pubs faites pour vivre dans le feed.",
      "h2.faq": "Des réponses claires, sans petites lignes.",
      "h2.contact": "Votre prochaine campagne commence par un email.",
      "k.trial": "ESSAI PAYANT", "k.monthly": "FORFAIT MENSUEL", "k.custom": "SUR MESURE",
      "tag.hero": "STUDIO CRÉATIF UGC IA, INDE", "tag.craft": "LE MÉTIER", "tag.work": "LE TRAVAIL",
      "tag.onair": "EN LIGNE", "tag.pricing": "TARIFS", "tag.faq": "QUESTIONS", "tag.ready": "QUAND VOUS VOULEZ",
      "cta.work": "VOIR LE TRAVAIL", "cta.trial": "RÉSERVER L'ESSAI", "cta.slot": "RÉSERVER UN CRÉNEAU",
      "cta.quote": "DEMANDER UN DEVIS", "cta.start": "DÉMARRER UN PROJET",
      "stat.sla": "JOURS AVANT LA PREMIÈRE VERSION", "stat.videos": "VIDÉOS PAR MOIS", "stat.qa": "CONTRÔLE HUMAIN",
      "price.onetime": "une fois", "price.permonth": "/ mois", "price.custom": "Sur mesure par pièce"
    },
    ar: {
      "h1": "إبداع <span class=\"accent\">يستحق الظهور في التغذية.</span>",
      "h2.pricing": "الدليل أولاً، ثم التوسع.",
      "h2.craft": "من إطار فارغ إلى إعلان يوقف التمرير.",
      "h2.work": "إعلانات مصممة لتعيش في التغذية.",
      "h2.faq": "أجوبة واضحة، بدون شروط خفية.",
      "h2.contact": "حملتك القادمة تبدأ برسالة واحدة.",
      "k.trial": "تجربة مدفوعة", "k.monthly": "باقة شهرية", "k.custom": "مخصص",
      "tag.hero": "استوديو إبداعي للفيديو بالذكاء الاصطناعي، الهند", "tag.craft": "الحرفة", "tag.work": "العمل",
      "tag.onair": "على الهواء", "tag.pricing": "الأسعار", "tag.faq": "الأسئلة", "tag.ready": "عندما تكون جاهزاً",
      "cta.work": "شاهد العمل", "cta.trial": "احجز التجربة", "cta.slot": "احجز موعداً",
      "cta.quote": "اطلب عرض سعر", "cta.start": "ابدأ مشروعاً",
      "stat.sla": "أيام حتى أول نسخة", "stat.videos": "فيديو شهرياً", "stat.qa": "مراجعة بشرية",
      "price.onetime": "مرة واحدة", "price.permonth": "/ شهر", "price.custom": "حسب القطعة"
    }
  };

  /* one place that knows money. Amounts are the real card, never derived at runtime. */
  var PRICES = {
    INR_DISABLED: { trial: 450, monthly: 1800, locale: "en-US" },
    USD: { trial: 450, monthly: 1800, locale: "en-US" }
  };

  function isLang(code) { return LANGS.indexOf(String(code || "").toLowerCase()) !== -1; }

  /* Resolution order is deliberate: explicit choice beats guesswork. */
  function resolveLang(input) {
    input = input || {};
    var param = String(input.param || "").toLowerCase();
    if (isLang(param)) return param;
    var saved = String(input.saved || "").toLowerCase();
    if (isLang(saved)) return saved;
    var nav = String(input.navigatorLang || "").toLowerCase();
    var first = nav.split(",")[0].split("-")[0];
    if (isLang(first)) return first;
    var country = String(input.country || "").toUpperCase();
    return COUNTRY_LANG[country] || "en";
  }

  function resolveMarket(input) {
    input = input || {};
    var forced = String(input.param || "").toUpperCase();
    if (forced === "USD") return forced;
    var country = String(input.country || "").toUpperCase();
    return "USD";
  }

  function formatPrice(kind, market) {
    var table = PRICES[market] || PRICES.USD;
    if (!table[kind]) return "";
    try {
      return new Intl.NumberFormat(table.locale, {
        style: "currency", currency: market, maximumFractionDigits: 0
      }).format(table[kind]);
    } catch (e) {
      return "$" + table[kind];
    }
  }

  function dict(lang) { return DICT[lang] || {}; }

  function t(lang, key, fallback) {
    var map = dict(lang);
    return map[key] !== undefined ? map[key] : fallback;
  }

  function dir(lang) { return RTL.indexOf(lang) !== -1 ? "rtl" : "ltr"; }

  return {
    LANGS: LANGS, DICT: DICT, PRICES: PRICES,
    resolveLang: resolveLang, resolveMarket: resolveMarket,
    formatPrice: formatPrice, t: t, dir: dir, isLang: isLang
  };
});
