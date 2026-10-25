/* ==========================================================================
   ClimateCare – SITE CONFIGURATION
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit to rebrand the site for a different
   AC business or country. Everything marked  >>> REPLACE <<<  is demo data.

   Quick pitch tricks (no editing needed):
     index.html?market=ng            -> Nigeria  (also us, ca, uk, au)
     index.html?name=Arctic%20Air    -> shows the prospect's company name
     index.html?market=uk&name=Cool%20Co
   ========================================================================== */

window.SITE_CONFIG = {
  /* ---- Demo mode ---------------------------------------------------------
     true  = sample reviews & demo projects are shown and clearly labelled.
     false = ONLY items marked `demo: false` are shown (sections with nothing
             left are hidden). Set to false for a real launch.               */
  demoMode: true,

  /* ---- Company -------------------------------------------------------- */
  company: {
    name: "ClimateCare", // >>> REPLACE <<<
    tagline: "Cooling Solutions", // small line under the logo
    description:
      "ClimateCare provides air conditioning installation, repair and maintenance for homes and businesses, with a focus on clear communication and careful workmanship.", // >>> REPLACE <<<
    logo: "", // e.g. "images/logo.svg". Leave empty to use the built-in snowflake mark.
  },

  /* ---- Brand colours (hex) ------------------------------------------- */
  colors: {
    primary: "#1565f5", // bright blue: buttons, links, accents
    navy: "#0b1f44", // deep navy: headings, CTA band, footer
  },

  /* ---- Market / locale ------------------------------------------------ */
  locale: {
    country: "United States", // >>> REPLACE <<<
    countryCode: "US", // US, CA, GB, AU, NG ... (drives phone formatting)
    language: "en-US", // BCP-47 tag: en-US, en-CA, en-GB, en-AU, en-NG
    currency: "USD", // ISO 4217: USD, CAD, GBP, AUD, NGN
    timeZone: "America/New_York", // IANA time zone (used for "earliest booking date")
  },

  /* ---- Contact details (all fictional in the demo) ------------------- */
  contact: {
    phone: "+15555550123", // >>> REPLACE <<< international format, digits only after "+"
    phoneDisplay: "", // optional: force how the number is shown, e.g. "0800 123 4567"
    whatsapp: "+15555550123", // >>> REPLACE <<< or "" to hide every WhatsApp button
    whatsappMessage: "Hello, I'd like to ask about an AC service.",
    email: "info@climatecare.example", // >>> REPLACE <<<
    address: "123 Example Street, Sample City, ST 00000", // >>> REPLACE <<<
    mapLink: "", // optional Google Maps URL; makes the address a link
    /* Used ONLY for structured data (see below). */
    addressParts: {
      street: "123 Example Street",
      city: "Sample City",
      region: "ST",
      postalCode: "00000",
      countryCode: "US",
    },
    /* Booking: a full URL (Calendly, Jobber, Housecall Pro, Square...) opens in
       a new tab. Leave empty to use the built-in request form on this page. */
    bookingLink: "",
    /* Optional: shows "Call-out fee" in Contact. null = hidden. Formatting uses
       the currency above, e.g. 49.99 -> "$49.99" / "£49.99" / "₦49,990.00". */
    callOutFee: null,
  },

  /* ---- Opening hours (free text so any market works) ----------------- */
  hours: [
    { days: "Mon – Fri", time: "8:00 AM – 6:00 PM" },
    { days: "Sat – Sun", time: "9:00 AM – 4:00 PM" },
  ],

  /* ---- Service areas -------------------------------------------------- */
  serviceAreas: ["Sample City", "Riverside", "Oakwood", "Greater Sample County"], // >>> REPLACE <<<

  /* ---- Form submissions ----------------------------------------------
     The form works on the front end only. To receive real enquiries, create
     a form on Formspree / Web3Forms / Getform / Netlify Forms (or your own
     API) and paste its URL here. Leave empty = demo mode: the form validates
     and shows a clearly labelled "nothing was sent" confirmation.          */
  form: {
    endpoint: "", // e.g. "https://formspree.io/f/xxxxxxx"
  },

  /* ---- Social links: icons only appear when a URL is filled in -------- */
  /* Demo values point at the platform home pages. >>> REPLACE <<< with the
     business' own pages (or "" to hide). Supported keys: facebook,
     instagram, linkedin, youtube.                                          */
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    youtube: "https://www.youtube.com/",
  },

  /* ---- Internal links ------------------------------------------------- */
  links: {
    about: "#process", // "Learn About Us" button. Use "about.html" etc. on a multi-page site.
    privacy: "privacy.html",
    terms: "terms.html",
  },

  /* ---- SEO / structured data ------------------------------------------
     Local-business JSON-LD is emitted ONLY when enabled AND the address and
     phone above are REAL. Keep false for the demo.                          */
  seo: {
    title: "ClimateCare | AC Repair, Installation & Maintenance",
    description:
      "Reliable air conditioning repair, installation and maintenance for homes and businesses. Book a service with the ClimateCare team.",
    structuredData: false,
    siteUrl: "", // e.g. "https://www.example.com" (used in structured data)
  },

  /* ---- Images --------------------------------------------------------
     Put your photos in the /images folder using these names (or change the
     paths). If a file is missing, a tidy placeholder is shown instead.      */
  images: {
    hero: { src: "hero.jpg", alt: "ClimateCare technician inspecting an outdoor air conditioning unit" },
    about: { src: "about.jpg", alt: "Smiling HVAC technician in a navy uniform beside an air conditioning unit" },
  },

  /* ---- Hero copy ------------------------------------------------------ */
  hero: {
    eyebrow: "YOUR LOCAL COOLING EXPERTS",
    titleLead: "Stay Cool. Stay Comfortable.",
    titleAccent: "All Year Round.",
    text: "Reliable air conditioning installation, repair and maintenance for homes and businesses, delivered by a team that keeps things clear and simple.",
    indicators: [
      { icon: "user-check", label: "Experienced Technicians" },
      { icon: "clock", label: "Fast, Reliable Service" },
      { icon: "home", label: "Residential & Commercial" },
    ],
    card: { title: "Reliable AC Solutions", text: "Installation, repair & maintenance" },
  },

  /* ---- Trust bar ------------------------------------------------------ */
  trust: [
    { icon: "user-check", title: "Professional Technicians", text: "A skilled team focused on careful work" },
    { icon: "calendar-check", title: "Reliable Appointments", text: "Clear scheduling with a technician" },
    { icon: "tag", title: "Transparent Pricing", text: "Straightforward talk about costs" },
    { icon: "star", title: "Quality Workmanship", text: "Careful, practical work on every job" },
  ],

  /* ---- Services: set enabled:false to hide a service everywhere ------- */
  services: [
    {
      id: "repair",
      enabled: true,
      icon: "wrench",
      title: "AC Repair",
      description: "Diagnosis and repair of air conditioning problems, including cooling issues and unusual noises.",
      image: { src: "service-repair.jpg", alt: "Technician repairing a wall-mounted air conditioner" },
    },
    {
      id: "installation",
      enabled: true,
      icon: "settings",
      title: "AC Installation",
      description: "Professional installation of suitable air conditioning systems for residential and commercial spaces.",
      image: { src: "service-installation.jpg", alt: "Technician installing an indoor air conditioning unit" },
    },
    {
      id: "maintenance",
      enabled: true,
      icon: "shield-check",
      title: "AC Maintenance",
      description: "Routine servicing, inspection, and cleaning to help keep systems operating efficiently.",
      image: { src: "service-maintenance.jpg", alt: "Technician cleaning and servicing an air conditioner" },
    },
    {
      id: "commercial",
      enabled: true,
      icon: "building",
      title: "Commercial HVAC",
      description: "Air conditioning servicing and maintenance solutions for offices, retail spaces, and other commercial properties.",
      image: { src: "service-commercial.jpg", alt: "Rooftop commercial air conditioning units" },
    },
  ],

  /* ---- About / why choose us ------------------------------------------ */
  about: {
    eyebrow: "WHY CHOOSE US",
    title: "Comfort You Can Count On",
    text: "ClimateCare focuses on reliable service, clear communication, careful workmanship and practical cooling solutions, so you always know what is happening with your system.",
    points: [
      { icon: "user-check", title: "Skilled Service Team", text: "Technicians who take care over every job." },
      { icon: "message", title: "Clear Communication", text: "We explain the problem and the options in plain language." },
      { icon: "sliders", title: "Solutions for Different Needs", text: "Recommendations that fit your space and requirements." },
      { icon: "headset", title: "Customer-Focused Support", text: "Friendly help from first enquiry to finished job." },
    ],
  },

  /* ---- How it works --------------------------------------------------- */
  process: [
    { icon: "message", title: "Book Your Service", text: "Contact the team and describe your AC problem or service needs." },
    { icon: "calendar", title: "Get Expert Assistance", text: "Arrange an appointment with a technician." },
    { icon: "snowflake", title: "Enjoy Your Comfort", text: "Get your system serviced, repaired, or installed according to your needs." },
  ],

  /* ---- Projects. demo:true items are hidden when demoMode is false ----- */
  projects: [
    { demo: true, title: "Residential AC Installation", text: "A new split system installed in a family home.", image: { src: "project-1.jpg", alt: "Technician fitting a split air conditioner in a home" } },
    { demo: true, title: "Air Conditioning Maintenance", text: "Routine inspection and cleaning of an outdoor unit.", image: { src: "project-2.jpg", alt: "Technician servicing an outdoor condenser unit" } },
    { demo: true, title: "Commercial Cooling Service", text: "Servicing of rooftop units for a commercial building.", image: { src: "project-3.jpg", alt: "Rooftop air conditioning units on a commercial building" } },
    { demo: true, title: "AC System Replacement", text: "An older system replaced with a suitable modern unit.", image: { src: "project-4.jpg", alt: "Newly installed wall-mounted air conditioner in a living room" } },
  ],

  /* ---- Reviews --------------------------------------------------------
     The demo text below is PLACEHOLDER content, not real customers.
     Replace with verified reviews and set demo:false.
     rating: 1-5 shows stars, null hides them.                              */
  reviews: [
    { demo: true, name: "Customer Name", role: "Placeholder", rating: null, text: "Sample review: replace this with a real comment from a customer about the technician, the communication or the finished work." },
    { demo: true, name: "Customer Name", role: "Placeholder", rating: null, text: "Sample review: add a verified testimonial here, with the customer's permission, before this site goes live." },
    { demo: true, name: "Customer Name", role: "Placeholder", rating: null, text: "Sample review: ask happy customers for feedback and paste it here. Add a star rating only if they gave one." },
  ],

  /* ---- FAQ ------------------------------------------------------------
     Use {areas}, {phone}, {email} to insert configured values.             */
  faqs: [
    { q: "What AC services do you provide?", a: "We provide air conditioning repair, installation and maintenance for homes and businesses. See the Services section above for details, or contact us to discuss what you need." },
    { q: "How do I schedule an appointment?", a: "Use the booking form on this page, or contact us by phone or email. Tell us about your system and what you need, and the team will arrange a suitable appointment." },
    { q: "Do you service residential and commercial systems?", a: "Yes. We work with residential systems as well as offices, retail spaces and other commercial properties. Contact us with details of your system and we will advise on the best next step." },
    { q: "How often should my AC be maintained?", a: "Many manufacturers and technicians recommend a service at least once a year, ideally before the hottest season. The right interval depends on the system, how often it runs and the environment, so ask us for advice on your setup." },
    { q: "What should I do if my AC stops cooling?", a: "Check that the thermostat is set to cool and the power is on, and that nothing is blocking the indoor or outdoor unit. If a filter is dirty, cleaning or replacing it may help. If it still isn't cooling, switch the system off and contact us. Please don't open the unit yourself." },
    { q: "Which areas do you serve?", a: "We serve: {areas}. If you are not sure whether you are covered, get in touch and we will let you know." },
  ],

  /* ---- Market presets: used by ?market=xx for pitching ---------------- */
  presets: {
    us: {},
    ca: {
      locale: { country: "Canada", countryCode: "CA", language: "en-CA", currency: "CAD", timeZone: "America/Toronto" },
      contact: { address: "123 Example Street, Sample City, ON A1A 1A1", addressParts: { street: "123 Example Street", city: "Sample City", region: "ON", postalCode: "A1A 1A1", countryCode: "CA" } },
      serviceAreas: ["Sample City", "Riverside", "Oakwood", "Greater Sample Region"],
    },
    uk: {
      locale: { country: "United Kingdom", countryCode: "GB", language: "en-GB", currency: "GBP", timeZone: "Europe/London" },
      contact: { phone: "+447700900123", whatsapp: "+447700900123", email: "info@climatecare.example", address: "10 Example Road, Sampleton, EX1 1AB", addressParts: { street: "10 Example Road", city: "Sampleton", region: "", postalCode: "EX1 1AB", countryCode: "GB" } },
      hours: [{ days: "Mon – Fri", time: "8:00 am – 6:00 pm" }, { days: "Sat", time: "9:00 am – 1:00 pm" }, { days: "Sun", time: "Closed" }],
      serviceAreas: ["Sampleton", "Riverside", "Oakwood", "Greater Sampleshire"],
    },
    au: {
      locale: { country: "Australia", countryCode: "AU", language: "en-AU", currency: "AUD", timeZone: "Australia/Sydney" },
      contact: { phone: "+61491570006", whatsapp: "+61491570006", address: "1 Example Street, Sampleville NSW 2000", addressParts: { street: "1 Example Street", city: "Sampleville", region: "NSW", postalCode: "2000", countryCode: "AU" } },
      serviceAreas: ["Sampleville", "Riverside", "Oakwood", "Greater Sample Region"],
    },
    ng: {
      locale: { country: "Nigeria", countryCode: "NG", language: "en-NG", currency: "NGN", timeZone: "Africa/Lagos" },
      contact: { phone: "+2348000000000", whatsapp: "+2348000000000", address: "12 Example Avenue, Sample District, Nigeria", addressParts: { street: "12 Example Avenue", city: "Sample District", region: "", postalCode: "", countryCode: "NG" } },
      hours: [{ days: "Mon – Sat", time: "8:00 AM – 6:00 PM" }, { days: "Sun", time: "Closed" }],
      serviceAreas: ["Sample District", "Riverside", "Oakwood", "Surrounding areas"],
    },
  },
};

/* --------------------------------------------------------------------------
   Preset + personalisation switches (safe to leave as is)
   -------------------------------------------------------------------------- */
(function applyPitchOverrides() {
  var C = window.SITE_CONFIG;
  var params;
  try { params = new URLSearchParams(window.location.search); } catch (e) { return; }

  var market = (params.get("market") || "").toLowerCase();
  var preset = C.presets[market];
  if (preset) {
    ["locale", "contact", "hours", "serviceAreas"].forEach(function (key) {
      if (!preset[key]) return;
      C[key] = Array.isArray(preset[key]) ? preset[key] : Object.assign({}, C[key], preset[key]);
    });
  }

  var name = (params.get("name") || "").trim().slice(0, 40);
  if (name) {
    var old = C.company.name;
    C.company.name = name;
    C.company.description = C.company.description.split(old).join(name);
    C.seo.title = C.seo.title.split(old).join(name);
    C.seo.description = C.seo.description.split(old).join(name);
    C.images.hero.alt = C.images.hero.alt.split(old).join(name);
  }
})();
