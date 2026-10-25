/* ==========================================================================
   ClimateCare template – rendering + behaviour
   All business data comes from config.js (window.SITE_CONFIG).
   Sections are plain functions (Header, HeroSection, ...) that return HTML.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG;
  if (!C) {
    document.body.innerHTML = "<p style='padding:24px;font-family:sans-serif'>config.js failed to load.</p>";
    return;
  }

  /* ------------------------------------------------------------------ helpers */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  };
  var icon = function (name, cls) {
    return '<svg class="ic ' + (cls || "") + '" aria-hidden="true" focusable="false"><use href="#i-' + esc(name) + '"></use></svg>';
  };

  var name = C.company.name;
  var contact = C.contact;
  var lang = C.locale.language;
  var cc = C.locale.countryCode;

  var services = C.services.filter(function (s) { return s.enabled !== false; });
  var projects = C.projects.filter(function (p) { return C.demoMode || !p.demo; });
  var reviews = C.reviews.filter(function (r) { return C.demoMode || !r.demo; });

  /* ---- phone / whatsapp / currency / date formatting -------------------- */
  function digits(s) { return String(s || "").replace(/\D/g, ""); }

  function formatPhone(e164) {
    if (contact.phoneDisplay) return contact.phoneDisplay;
    var d = digits(e164);
    if ((cc === "US" || cc === "CA") && d.length === 11 && d[0] === "1") {
      return "+1 (" + d.slice(1, 4) + ") " + d.slice(4, 7) + "-" + d.slice(7);
    }
    if (cc === "GB" && d.slice(0, 2) === "44" && d.length === 12) {
      return "+44 " + d.slice(2, 6) + " " + d.slice(6);
    }
    if (cc === "AU" && d.slice(0, 2) === "61" && d.length === 11) {
      return d[2] === "4"
        ? "+61 " + d.slice(2, 5) + " " + d.slice(5, 8) + " " + d.slice(8)
        : "+61 " + d[2] + " " + d.slice(3, 7) + " " + d.slice(7);
    }
    if (cc === "NG" && d.slice(0, 3) === "234" && d.length === 13) {
      return "+234 " + d.slice(3, 6) + " " + d.slice(6, 9) + " " + d.slice(9);
    }
    return d ? "+" + d : "";
  }

  function formatCurrency(amount) {
    try {
      return new Intl.NumberFormat(lang, { style: "currency", currency: C.locale.currency }).format(amount);
    } catch (e) {
      return C.locale.currency + " " + amount;
    }
  }

  function todayISO() {
    try {
      var parts = new Intl.DateTimeFormat("en-CA", { timeZone: C.locale.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      return parts; // en-CA gives YYYY-MM-DD
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(new Date(iso + "T12:00:00"));
    } catch (e) {
      return iso;
    }
  }

  var hasPhone = !!digits(contact.phone);
  var phoneText = hasPhone ? formatPhone(contact.phone) : "";
  var telHref = hasPhone ? "tel:+" + digits(contact.phone) : "";
  var hasWhatsApp = !!digits(contact.whatsapp);
  var waHref = hasWhatsApp
    ? "https://wa.me/" + digits(contact.whatsapp) + (contact.whatsappMessage ? "?text=" + encodeURIComponent(contact.whatsappMessage) : "")
    : "";
  var hasEmail = !!contact.email;
  var hasBookingLink = /^https?:\/\//i.test(contact.bookingLink || "");

  /* "Book a Service" -> external booking tool if configured, else the form. */
  var bookAttrs = hasBookingLink
    ? 'href="' + esc(contact.bookingLink) + '" target="_blank" rel="noopener noreferrer"'
    : 'href="#contact"';
  var bookSuffix = hasBookingLink ? '<span class="sr-only"> (opens in a new tab)</span>' : "";

  /* ------------------------------------------------------------- image handling */
  var missingImages = [];

  function media(image, w, h, opts) {
    opts = opts || {};
    var src = image && image.src ? image.src : "";
    var alt = image && image.alt ? image.alt : "";
    return (
      '<div class="media ' + (opts.cls || "") + '" style="aspect-ratio:' + w + " / " + h + '">' +
      '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="' + w + '" height="' + h + '" ' +
      (opts.eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">' +
      "</div>"
    );
  }

  /* error events do not bubble, so listen in the capture phase */
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (!t || t.tagName !== "IMG" || t.dataset.failed) return;
    t.dataset.failed = "1";
    missingImages.push(t.getAttribute("src"));
    if (t.classList.contains("brand-logo")) {
      t.outerHTML = icon("snowflake", "brand-mark");
      return;
    }
    var box = t.parentNode;
    var fb = document.createElement("div");
    fb.className = "img-fallback";
    fb.setAttribute("role", "img");
    fb.setAttribute("aria-label", t.alt);
    fb.innerHTML = icon("snowflake") + "<span>" + esc(t.alt) + "</span>";
    box.appendChild(fb);
    t.remove();
  }, true);

  window.addEventListener("load", function () {
    setTimeout(function () {
      if (missingImages.length && window.console) {
        console.info("[" + name + "] Add these photos to the images folder:\n - " + missingImages.join("\n - "));
      }
    }, 500);
  });

  /* ---------------------------------------------------------------- components */
  function LogoMark() {
    return C.company.logo
      ? '<img class="brand-logo" src="' + esc(C.company.logo) + '" alt="" width="40" height="40">'
      : icon("snowflake", "brand-mark");
  }

  function Brand(light) {
    return (
      '<a class="brand' + (light ? " brand-light" : "") + '" href="#home" aria-label="' + esc(name) + ' – home">' +
      LogoMark() +
      '<span class="brand-text"><strong>' + esc(name) + "</strong>" +
      (C.company.tagline ? "<small>" + esc(C.company.tagline) + "</small>" : "") +
      "</span></a>"
    );
  }

  var navLinks = [
    ["Home", "#home"],
    ["Services", "#services"],
    ["About Us", "#about"],
  ];
  if (projects.length) navLinks.push(["Projects", "#projects"]);
  navLinks.push(["Contact", "#contact"]);

  function Header() {
    var items = navLinks.map(function (l) {
      return '<li><a href="' + l[1] + '" data-nav>' + l[0] + "</a></li>";
    }).join("");
    var mobileItems = navLinks.map(function (l) {
      return '<li><a href="' + l[1] + '">' + l[0] + "</a></li>";
    }).join("");
    return (
      '<div class="container header-inner">' +
      Brand(false) +
      '<nav class="nav-desktop" aria-label="Primary"><ul>' + items + "</ul></nav>" +
      '<div class="header-actions">' +
      (hasPhone ? '<a class="phone-pill" href="' + telHref + '">' + icon("phone") + "<span>" + esc(phoneText) + '</span><span class="sr-only"> – call us</span></a>' : "") +
      (hasWhatsApp ? '<a class="wa-btn" href="' + esc(waHref) + '" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp (opens in a new tab)">' + icon("whatsapp") + "</a>" : "") +
      '<a class="btn btn-primary btn-header" ' + bookAttrs + ">Book a Service" + bookSuffix + "</a>" +
      '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">' + icon("menu", "menu-open") + icon("x", "menu-close") + "</button>" +
      "</div></div>" +
      '<div class="mobile-menu" id="mobile-menu" hidden><div class="container">' +
      '<ul class="mobile-links">' + mobileItems + "</ul>" +
      '<div class="mobile-actions">' +
      '<a class="btn btn-primary btn-block" ' + bookAttrs + ">Book a Service" + bookSuffix + "</a>" +
      (hasPhone ? '<a class="btn btn-outline btn-block" href="' + telHref + '">' + icon("phone") + "Call " + esc(phoneText) + "</a>" : "") +
      (hasWhatsApp ? '<a class="btn btn-wa btn-block" href="' + esc(waHref) + '" target="_blank" rel="noopener noreferrer">' + icon("whatsapp") + 'WhatsApp<span class="sr-only"> (opens in a new tab)</span></a>' : "") +
      "</div></div></div>"
    );
  }

  /* Vapor-type headline: each word condenses out of a soft blur, staggered.
     Pure CSS animation (see .vw in styles.css); disabled for reduced motion. */
  var vaporIndex = 0;
  function vaporWords(text) {
    return String(text).split(/\s+/).filter(Boolean).map(function (w) {
      return '<span class="vw" style="--i:' + vaporIndex++ + '">' + esc(w) + "</span>";
    }).join(" ");
  }

  function HeroSection() {
    var h = C.hero;
    vaporIndex = 0;
    var indicators = h.indicators.map(function (i) {
      return '<li>' + icon(i.icon) + "<span>" + esc(i.label) + "</span></li>";
    }).join("");
    return (
      '<section class="hero" id="home" aria-labelledby="hero-title"><div class="container hero-grid">' +
      '<div class="hero-copy">' +
      '<p class="eyebrow">' + esc(h.eyebrow) + "</p>" +
      '<h1 id="hero-title">' + vaporWords(h.titleLead) + ' <span class="accent">' + vaporWords(h.titleAccent) + "</span></h1>" +
      '<p class="lead">' + esc(h.text) + "</p>" +
      '<div class="btn-row">' +
      '<a class="btn btn-primary btn-lg" ' + bookAttrs + ">Book a Service" + icon("arrow") + bookSuffix + "</a>" +
      (hasPhone ? '<a class="btn btn-outline btn-lg" href="' + telHref + '">' + icon("phone") + "Call Our Team</a>" : "") +
      "</div>" +
      '<ul class="hero-points">' + indicators + "</ul>" +
      "</div>" +
      '<div class="hero-visual">' +
      media(C.images.hero, 640, 560, { cls: "hero-media", eager: true }) +
      '<div class="float-card">' + icon("snowflake", "float-ic") +
      "<div><strong>" + esc(h.card.title) + "</strong><span>" + esc(h.card.text) + "</span></div></div>" +
      "</div></div></section>"
    );
  }

  function TrustBar() {
    var items = C.trust.map(function (t) {
      return '<li><span class="icon-badge">' + icon(t.icon) + "</span><div><strong>" + esc(t.title) + "</strong><span>" + esc(t.text) + "</span></div></li>";
    }).join("");
    return '<section class="trust" aria-label="Why customers choose us"><div class="container"><ul class="trust-list">' + items + "</ul></div></section>";
  }

  function ServicesSection() {
    var cards = services.map(function (s) {
      return (
        '<li class="service-card">' +
        media(s.image, 400, 280, { cls: "service-media" }) +
        '<div class="service-body"><span class="icon-badge icon-badge-float">' + icon(s.icon) + "</span>" +
        "<h3>" + esc(s.title) + "</h3><p>" + esc(s.description) + "</p>" +
        '<a class="link-arrow" href="#contact" data-service="' + esc(s.id) + '">Learn More' +
        '<span class="sr-only"> about ' + esc(s.title) + "</span>" + icon("arrow") + "</a></div></li>"
      );
    }).join("");
    return (
      '<section class="section section-soft" id="services" aria-labelledby="services-title"><div class="container services-layout">' +
      '<div class="section-intro"><p class="eyebrow">OUR SERVICES</p>' +
      '<h2 id="services-title">Complete AC Solutions for Your Comfort</h2>' +
      "<p>From everyday repairs to installation and ongoing maintenance, we help keep homes and businesses cool and comfortable all year round.</p>" +
      '<a class="btn btn-primary" href="#contact">Request a Service</a></div>' +
      '<ul class="service-grid" style="--n:' + services.length + '">' + cards + "</ul>" +
      "</div></section>"
    );
  }

  function AboutSection() {
    var a = C.about;
    var pts = a.points.map(function (p) {
      return '<li><span class="icon-badge icon-badge-soft">' + icon(p.icon) + "</span><div><h3>" + esc(p.title) + "</h3><p>" + esc(p.text) + "</p></div></li>";
    }).join("");
    return (
      '<section class="section" id="about" aria-labelledby="about-title"><div class="container about-grid">' +
      media(C.images.about, 520, 560, { cls: "about-media" }) +
      '<div><p class="eyebrow">' + esc(a.eyebrow) + "</p>" +
      '<h2 id="about-title">' + esc(a.title) + "</h2><p class=\"lead-sm\">" + esc(a.text) + "</p>" +
      '<ul class="about-points">' + pts + "</ul>" +
      '<a class="btn btn-primary" href="' + esc(C.links.about) + '">Learn About Us</a></div>' +
      "</div></section>"
    );
  }

  function ProcessSection() {
    var steps = C.process.map(function (s, i) {
      return (
        '<li class="step"><div class="step-top"><span class="step-num" aria-hidden="true">' + (i + 1) + "</span>" +
        '<span class="step-ic">' + icon(s.icon) + "</span></div>" +
        '<h3><span class="sr-only">Step ' + (i + 1) + ": </span>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></li>"
      );
    }).join("");
    return (
      '<section class="section section-soft" id="process" aria-labelledby="process-title"><div class="container">' +
      '<div class="section-head"><p class="eyebrow">HOW IT WORKS</p><h2 id="process-title">Getting Your AC Fixed Is Easy</h2></div>' +
      '<ol class="steps">' + steps + "</ol></div></section>"
    );
  }

  function ProjectsGallery() {
    if (!projects.length) return "";
    var cards = projects.map(function (p) {
      return (
        '<li class="project-card">' +
        '<div class="project-media">' + media(p.image, 480, 340) +
        (C.demoMode && p.demo ? '<span class="demo-badge">Demo project</span>' : "") + "</div>" +
        "<div class=\"project-body\"><h3>" + esc(p.title) + "</h3><p>" + esc(p.text) + "</p></div></li>"
      );
    }).join("");
    return (
      '<section class="section" id="projects" aria-labelledby="projects-title"><div class="container">' +
      '<div class="section-head"><p class="eyebrow">RECENT PROJECTS</p><h2 id="projects-title">Our Latest Work</h2>' +
      (C.demoMode ? '<p class="demo-note">Illustrative demo projects. Replace with real job photos before launch.</p>' : "") + "</div>" +
      '<ul class="project-grid">' + cards + "</ul></div></section>"
    );
  }

  function stars(n) {
    var out = "";
    for (var i = 1; i <= 5; i++) out += icon("star", i <= n ? "star on" : "star");
    return '<span class="stars" role="img" aria-label="' + n + ' out of 5 stars">' + out + "</span>";
  }

  function TestimonialsSection() {
    if (!reviews.length) return "";
    var cards = reviews.map(function (r) {
      var initial = esc((r.name || "?").trim().charAt(0).toUpperCase());
      return (
        '<li class="review-card"><figure>' +
        (r.rating ? stars(r.rating) : "") +
        "<blockquote><p>" + esc(r.text) + "</p></blockquote>" +
        '<figcaption><span class="avatar" aria-hidden="true">' + initial + "</span>" +
        "<span><strong>" + esc(r.name) + "</strong><small>" + esc(r.role || "") + "</small></span>" +
        (C.demoMode && r.demo ? '<span class="demo-badge demo-badge-inline">Sample</span>' : "") +
        "</figcaption></figure></li>"
      );
    }).join("");
    return (
      '<section class="section section-soft" id="reviews" aria-labelledby="reviews-title"><div class="container">' +
      '<div class="section-head"><p class="eyebrow">CUSTOMER REVIEWS</p><h2 id="reviews-title">What Customers Value About Our Service</h2>' +
      (C.demoMode ? '<p class="demo-note">Placeholder content for demonstration. These are not real customers or ratings.</p>' : "") + "</div>" +
      '<ul class="review-grid">' + cards + "</ul></div></section>"
    );
  }

  function fillTokens(text) {
    return text
      .replace("{areas}", C.serviceAreas.join(", "))
      .replace("{phone}", phoneText)
      .replace("{email}", contact.email || "");
  }

  function FAQSection() {
    var items = C.faqs.map(function (f, i) {
      return (
        '<div class="faq-item">' +
        '<h3><button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-a-' + i + '" id="faq-q-' + i + '">' +
        "<span>" + esc(f.q) + "</span>" + icon("plus", "faq-ic") + "</button></h3>" +
        '<div class="faq-a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '" hidden><p>' + esc(fillTokens(f.a)) + "</p></div></div>"
      );
    }).join("");
    return (
      '<section class="section" id="faq" aria-labelledby="faq-title"><div class="container faq-layout">' +
      '<div class="section-intro"><p class="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h2 id="faq-title">Common Questions</h2>' +
      "<p>Can't find what you're looking for? Get in touch and we'll be glad to help.</p></div>" +
      '<div class="faq-list">' + items + "</div></div></section>"
    );
  }

  function CTASection() {
    return (
      '<section class="cta" aria-labelledby="cta-title"><div class="container cta-inner">' +
      '<div><h2 id="cta-title">Need Help With Your Air Conditioner?</h2>' +
      "<p>Get in touch with our team to discuss your cooling needs and schedule a service.</p></div>" +
      '<div class="btn-row">' +
      '<a class="btn btn-primary btn-lg" ' + bookAttrs + ">Book a Service" + icon("arrow") + bookSuffix + "</a>" +
      (hasPhone ? '<a class="btn btn-ghost-light btn-lg" href="' + telHref + '">' + icon("phone") + "Call Now</a>" : "") +
      "</div></div></section>"
    );
  }

  function hoursList() {
    return '<ul class="hours">' + C.hours.map(function (h) {
      return "<li><span>" + esc(h.days) + "</span><span>" + esc(h.time) + "</span></li>";
    }).join("") + "</ul>";
  }

  function infoRow(ic, label, html) {
    return '<li><span class="icon-badge icon-badge-soft">' + icon(ic) + "</span><div><h3>" + label + "</h3>" + html + "</div></li>";
  }

  function ContactSection() {
    var rows = "";
    if (hasPhone) rows += infoRow("phone", "Phone", '<a href="' + telHref + '">' + esc(phoneText) + "</a>");
    if (hasWhatsApp) rows += infoRow("whatsapp", "WhatsApp", '<a href="' + esc(waHref) + '" target="_blank" rel="noopener noreferrer">Chat with us<span class="sr-only"> (opens in a new tab)</span></a>');
    if (hasEmail) rows += infoRow("mail", "Email", '<a href="mailto:' + esc(contact.email) + '">' + esc(contact.email) + "</a>");
    if (contact.address) {
      rows += infoRow("pin", "Address", contact.mapLink
        ? '<a href="' + esc(contact.mapLink) + '" target="_blank" rel="noopener noreferrer">' + esc(contact.address) + '<span class="sr-only"> (opens in a new tab)</span></a>'
        : "<p>" + esc(contact.address) + "</p>");
    }
    rows += infoRow("clock", "Business Hours", hoursList());
    rows += infoRow("home", "Service Area", "<p>" + esc(C.serviceAreas.join(", ")) + "</p>");
    if (contact.callOutFee != null) rows += infoRow("tag", "Call-out Fee", "<p>" + esc(formatCurrency(contact.callOutFee)) + "</p>");

    var options = '<option value="">Select a service…</option>' +
      services.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc(s.title) + "</option>"; }).join("") +
      '<option value="other">Other / Not sure</option>';

    function field(id, label, control, hint) {
      return (
        '<div class="field"><label for="' + id + '">' + label + "</label>" + control +
        (hint ? '<p class="hint" id="' + id + '-hint">' + hint + "</p>" : "") +
        '<p class="error" id="' + id + '-error" hidden></p></div>'
      );
    }

    return (
      '<section class="section section-soft" id="contact" aria-labelledby="contact-title"><div class="container">' +
      '<div class="section-head"><p class="eyebrow">CONTACT &amp; BOOKING</p><h2 id="contact-title">Book a Service</h2>' +
      "<p>Tell us about your AC and we'll get back to you to arrange an appointment.</p></div>" +
      '<div class="contact-grid">' +
      '<ul class="info-list">' + rows + "</ul>" +
      '<form class="contact-form" id="contact-form" novalidate>' +
      '<div class="form-summary" id="form-summary" role="alert" hidden></div>' +
      '<div class="form-grid">' +
      field("cf-name", 'Full name <span class="req" aria-hidden="true">*</span>', '<input id="cf-name" name="name" type="text" autocomplete="name" required aria-required="true">') +
      field("cf-phone", 'Phone number <span class="req" aria-hidden="true">*</span>', '<input id="cf-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required aria-required="true">') +
      field("cf-email", 'Email address <span class="req" aria-hidden="true">*</span>', '<input id="cf-email" name="email" type="email" autocomplete="email" required aria-required="true">') +
      field("cf-service", 'Service type <span class="req" aria-hidden="true">*</span>', '<select id="cf-service" name="service" required aria-required="true">' + options + "</select>") +
      field("cf-date", "Preferred appointment date", '<input id="cf-date" name="date" type="date" aria-describedby="cf-date-hint cf-date-error">', "Optional. We'll confirm the exact time with you.") +
      "</div>" +
      field("cf-message", "Message", '<textarea id="cf-message" name="message" rows="4" maxlength="1000" aria-describedby="cf-message-error"></textarea>') +
      '<div class="hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
      '<p class="req-note"><span class="req" aria-hidden="true">*</span> Required fields</p>' +
      '<button class="btn btn-primary btn-lg" type="submit" id="cf-submit">Send Request</button>' +
      '<div class="form-status" id="form-status" role="status" aria-live="polite" tabindex="-1" hidden></div>' +
      "</form></div></div></section>"
    );
  }

  function Footer() {
    var quick = navLinks.map(function (l) { return '<li><a href="' + l[1] + '">' + l[0] + "</a></li>"; }).join("");
    var svc = services.map(function (s) {
      return '<li><a href="#contact" data-service="' + esc(s.id) + '">' + esc(s.title) + "</a></li>";
    }).join("");
    var c = "";
    if (hasPhone) c += '<li>' + icon("phone") + '<a href="' + telHref + '">' + esc(phoneText) + "</a></li>";
    if (hasEmail) c += '<li>' + icon("mail") + '<a href="mailto:' + esc(contact.email) + '">' + esc(contact.email) + "</a></li>";
    if (contact.address) c += '<li>' + icon("pin") + "<span>" + esc(contact.address) + "</span></li>";

    var labels = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn", youtube: "YouTube" };
    var social = Object.keys(C.social || {}).filter(function (k) { return /^https?:\/\//i.test(C.social[k] || ""); }).map(function (k) {
      return '<li><a class="social" href="' + esc(C.social[k]) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(name) + " on " + (labels[k] || k) + ' (opens in a new tab)">' + icon(labels[k] ? k : "link") + "</a></li>";
    }).join("");

    return (
      '<div class="container footer-grid">' +
      '<div class="footer-brand">' + Brand(true) + "<p>" + esc(C.company.description) + "</p></div>" +
      '<nav aria-label="Quick links"><h2>Quick Links</h2><ul class="footer-links">' + quick + "</ul></nav>" +
      '<nav aria-label="Services"><h2>Our Services</h2><ul class="footer-links">' + svc + "</ul></nav>" +
      "<div><h2>Contact Us</h2><ul class=\"footer-contact\">" + c + "</ul>" +
      "<h2 class=\"h-sub\">Business Hours</h2>" + hoursList() + "</div>" +
      (social ? '<div><h2>Stay Connected</h2><ul class="social-list">' + social + "</ul></div>" : "") +
      "</div>" +
      '<div class="container footer-bottom"><p>&copy; ' + new Date().getFullYear() + " " + esc(name) + ". All rights reserved.</p>" +
      '<p class="legal-links"><a href="' + esc(C.links.privacy) + '">Privacy Policy</a><span aria-hidden="true">|</span><a href="' + esc(C.links.terms) + '">Terms of Service</a></p></div>'
    );
  }

  /* -------------------------------------------------------------------- mount */
  $("#site-header").innerHTML = Header();
  $("#main").innerHTML = [
    HeroSection(), TrustBar(), ServicesSection(), AboutSection(), ProcessSection(),
    ProjectsGallery(), TestimonialsSection(), FAQSection(), CTASection(), ContactSection(),
  ].join("");
  $("#site-footer").innerHTML = Footer();

  /* Vapor headings: every main heading replays its effect each time it
     scrolls into view (class is removed when it leaves the screen). */
  var vaporHeads = $$("#main h1, #main h2");
  vaporHeads.forEach(function (h) {
    if (!h.querySelector(".vw")) { vaporIndex = 0; h.innerHTML = vaporWords(h.textContent); }
    h.setAttribute("data-vapor", "");
  });
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var vaporIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle("in-view", en.isIntersecting);
      });
    }, { threshold: 0.6 });
    vaporHeads.forEach(function (h) { vaporIO.observe(h); });
  } else {
    vaporHeads.forEach(function (h) { h.classList.add("in-view"); });
  }

  /* ---------------------------------------------------- brand colours + SEO */
  var root = document.documentElement.style;
  if (C.colors.primary) root.setProperty("--blue", C.colors.primary);
  if (C.colors.navy) root.setProperty("--navy", C.colors.navy);
  document.documentElement.lang = lang.split("-")[0];
  document.title = C.seo.title;
  function setMeta(sel, attr, val) { var el = $(sel); if (el) el.setAttribute(attr, val); }
  setMeta('meta[name="description"]', "content", C.seo.description);
  setMeta('meta[property="og:title"]', "content", C.seo.title);
  setMeta('meta[property="og:description"]', "content", C.seo.description);
  setMeta('meta[property="og:site_name"]', "content", name);
  setMeta('meta[name="theme-color"]', "content", C.colors.navy);

  /* Local-business structured data: only when explicitly enabled. */
  if (C.seo.structuredData) {
    var ap = contact.addressParts || {};
    var ld = {
      "@context": "https://schema.org",
      "@type": "HVACBusiness",
      name: name,
      description: C.company.description,
      areaServed: C.serviceAreas,
    };
    if (C.seo.siteUrl) ld.url = C.seo.siteUrl;
    if (hasPhone) ld.telephone = "+" + digits(contact.phone);
    if (hasEmail) ld.email = contact.email;
    if (ap.street) {
      ld.address = { "@type": "PostalAddress", streetAddress: ap.street, addressLocality: ap.city, addressRegion: ap.region, postalCode: ap.postalCode, addressCountry: ap.countryCode };
    }
    var tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(ld);
    document.head.appendChild(tag);
  }

  /* ------------------------------------------------------------- behaviour */
  /* Mobile menu */
  var menuBtn = $(".menu-btn");
  var menu = $("#mobile-menu");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }
  menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });

  /* FAQ accordion (one open at a time) */
  $$(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      $$(".faq-q").forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
        $("#" + b.getAttribute("aria-controls")).hidden = true;
      });
      if (!open) {
        btn.setAttribute("aria-expanded", "true");
        $("#" + btn.getAttribute("aria-controls")).hidden = false;
      }
    });
  });

  /* "Learn More" links pre-select the service in the form */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-service]");
    if (!a) return;
    var sel = $("#cf-service");
    if (sel) sel.value = a.getAttribute("data-service");
  });

  /* Scroll-spy for the desktop nav */
  var navAnchors = $$("[data-nav]");
  if ("IntersectionObserver" in window) {
    var spyIds = navAnchors.map(function (a) { return a.getAttribute("href").slice(1); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAnchors.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + en.target.id;
          a.classList.toggle("active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    spyIds.forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ----------------------------------------------------------- contact form */
  var form = $("#contact-form");
  var minDate = todayISO();
  $("#cf-date").min = minDate;

  var rules = {
    name: function (v) { return v.trim().length < 2 ? "Please enter your full name." : ""; },
    phone: function (v) {
      var d = digits(v);
      return d.length < 7 || d.length > 15 || !/^[+\d\s().-]+$/.test(v.trim()) ? "Please enter a valid phone number (7 to 15 digits)." : "";
    },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com."; },
    service: function (v) { return v ? "" : "Please choose a service type."; },
    date: function (v) { return v && v < minDate ? "Please choose today or a future date." : ""; },
    message: function (v) { return v.length > 1000 ? "Please keep your message under 1,000 characters." : ""; },
  };
  var ids = { name: "cf-name", phone: "cf-phone", email: "cf-email", service: "cf-service", date: "cf-date", message: "cf-message" };

  function showError(key, msg) {
    var input = document.getElementById(ids[key]);
    var err = document.getElementById(ids[key] + "-error");
    var describedBy = (input.getAttribute("aria-describedby") || "").split(" ").filter(function (x) { return x && x !== err.id; });
    if (msg) {
      err.textContent = msg;
      err.hidden = false;
      input.setAttribute("aria-invalid", "true");
      describedBy.push(err.id);
    } else {
      err.hidden = true;
      err.textContent = "";
      input.removeAttribute("aria-invalid");
    }
    if (describedBy.length) input.setAttribute("aria-describedby", describedBy.join(" ")); else input.removeAttribute("aria-describedby");
    return !msg;
  }

  function validateField(key) { return showError(key, rules[key](document.getElementById(ids[key]).value)); }

  Object.keys(ids).forEach(function (key) {
    var el = document.getElementById(ids[key]);
    el.addEventListener("blur", function () { if (el.value || el.getAttribute("aria-invalid")) validateField(key); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid")) validateField(key); });
    el.addEventListener("change", function () { if (el.getAttribute("aria-invalid")) validateField(key); });
  });

  var summary = $("#form-summary");
  var statusBox = $("#form-status");
  var submitBtn = $("#cf-submit");

  function setStatus(kind, html) {
    statusBox.className = "form-status " + kind;
    statusBox.innerHTML = html;
    statusBox.hidden = false;
    statusBox.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusBox.hidden = true;

    var bad = Object.keys(ids).filter(function (k) { return !validateField(k); });
    if (bad.length) {
      summary.innerHTML = "Please fix " + (bad.length === 1 ? "1 field" : bad.length + " fields") + " below and try again.";
      summary.hidden = false;
      document.getElementById(ids[bad[0]]).focus();
      return;
    }
    summary.hidden = true;

    var data = {};
    Object.keys(ids).forEach(function (k) { data[k] = document.getElementById(ids[k]).value.trim(); });
    var svcSel = document.getElementById("cf-service");
    data.serviceLabel = svcSel.options[svcSel.selectedIndex].text;
    var firstName = data.name.split(/\s+/)[0];
    var dateLine = data.date ? " Preferred date: " + esc(formatDate(data.date)) + "." : "";

    /* Honeypot: bots fill the hidden field. Pretend success, send nothing. */
    if (form.elements.website.value) { setStatus("ok", "<strong>Thank you.</strong>"); form.reset(); return; }

    if (!C.form.endpoint) {
      /* No backend connected: be honest about it. */
      setStatus("demo",
        "<strong>Demo mode: nothing was sent.</strong> Thanks, " + esc(firstName) + ". Your details passed validation." + dateLine +
        " No form service is connected yet, so this request was not delivered. See the README to connect one.");
      form.reset();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    fetch(C.form.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      setStatus("ok", "<strong>Thank you, " + esc(firstName) + ".</strong> Your request has been sent." + dateLine + " We'll be in touch to confirm your appointment.");
      form.reset();
    }).catch(function () {
      var alt = [];
      if (hasPhone) alt.push('call <a href="' + telHref + '">' + esc(phoneText) + "</a>");
      if (hasEmail) alt.push('email <a href="mailto:' + esc(contact.email) + '">' + esc(contact.email) + "</a>");
      setStatus("fail", "<strong>Sorry, your request could not be sent.</strong> Please try again" + (alt.length ? " or " + alt.join(" or ") : "") + ".");
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Request";
    });
  });
})();
