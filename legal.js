/* Renders the placeholder Privacy Policy / Terms pages from config.js.
   These are TEMPLATES: have the final text reviewed by a qualified professional. */
(function () {
  "use strict";
  var C = window.SITE_CONFIG;
  if (!C) return;
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  };
  var type = document.body.getAttribute("data-page"); // "privacy" | "terms"
  var name = esc(C.company.name);
  var email = C.contact.email ? '<a href="mailto:' + esc(C.contact.email) + '">' + esc(C.contact.email) + "</a>" : "us";
  var notice = '<p class="notice"><strong>Template notice:</strong> This is placeholder text for a demonstration website. It is not legal advice. Replace it with a policy reviewed by a qualified professional before launch.</p>';

  var body;
  if (type === "privacy") {
    document.title = "Privacy Policy | " + C.company.name;
    body =
      "<h1>Privacy Policy</h1>" + notice +
      "<p>This page explains, in general terms, how " + name + " handles information you give us through this website.</p>" +
      "<h2>Information we collect</h2><ul><li>Details you submit in the booking or contact form, such as your name, phone number, email address, preferred date and message.</li><li>Basic technical data your browser sends when you visit any website.</li></ul>" +
      "<h2>How we use it</h2><p>We use your details to respond to your enquiry, arrange appointments and provide the service you ask for.</p>" +
      "<h2>Sharing</h2><p>We do not sell your personal information. We may use trusted service providers (for example, a form or scheduling service) to help run our business.</p>" +
      "<h2>Your choices</h2><p>You can ask us to access, correct or delete the information we hold about you by contacting " + email + ".</p>";
  } else {
    document.title = "Terms of Service | " + C.company.name;
    body =
      "<h1>Terms of Service</h1>" + notice +
      "<p>By using this website you agree to these general terms with " + name + ".</p>" +
      "<h2>Website content</h2><p>Information on this website is provided for general guidance. Services, availability and pricing are confirmed directly with our team.</p>" +
      "<h2>Enquiries and bookings</h2><p>Submitting a form is a request, not a confirmed booking. An appointment is confirmed only when our team agrees a time with you.</p>" +
      "<h2>Limitation</h2><p>We aim to keep this website accurate and available but cannot guarantee it will always be error-free or uninterrupted.</p>" +
      "<h2>Contact</h2><p>Questions about these terms? Contact " + email + ".</p>";
  }

  document.getElementById("legal-header").innerHTML =
    '<div class="container header-inner"><a class="brand" href="index.html" aria-label="' + name + ' – back to home">' +
    '<svg class="ic brand-mark" aria-hidden="true" focusable="false"><use href="#i-snowflake"></use></svg>' +
    '<span class="brand-text"><strong>' + name + "</strong></span></a>" +
    '<a class="btn btn-outline" href="index.html">Back to website</a></div>';
  document.getElementById("main").innerHTML = '<section class="legal"><div class="container">' + body + "</div></section>";
  document.getElementById("legal-footer").innerHTML =
    '<div class="container footer-bottom"><p>&copy; ' + new Date().getFullYear() + " " + name + ". All rights reserved.</p>" +
    '<p class="legal-links"><a href="' + esc(C.links.privacy) + '">Privacy Policy</a><span aria-hidden="true">|</span><a href="' + esc(C.links.terms) + '">Terms of Service</a></p></div>';
  if (C.colors.primary) document.documentElement.style.setProperty("--blue", C.colors.primary);
  if (C.colors.navy) document.documentElement.style.setProperty("--navy", C.colors.navy);
})();
