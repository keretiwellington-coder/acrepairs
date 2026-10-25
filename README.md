# ClimateCare – AC repair website template

A fast, responsive, accessible one-page website for AC repair businesses. No build step, no installs: plain HTML, CSS and JavaScript. All business details live in **`config.js`**.

## Run it

- **On your phone or computer:** open `index.html` in a browser. It works straight from the file.
- **On a computer, as a local server:** `python3 -m http.server 8000`, then open http://localhost:8000
- **Put it online (free):** drag the whole folder onto Netlify Drop (app.netlify.com/drop), or upload it to a GitHub repo and enable GitHub Pages, or use Cloudflare Pages / Vercel.

## Add your photos

Put your images in the `images/` folder with these names (JPG, ideally compressed under ~200 KB each). Any missing file shows a neat placeholder instead, so nothing looks broken.

| File | Where it appears | Suggested size |
|---|---|---|
| `hero.jpg` | Hero (technician at an AC unit) | 1280×1120 |
| `about.jpg` | About section (technician/team) | 1040×1120 |
| `service-repair.jpg`, `service-installation.jpg`, `service-maintenance.jpg`, `service-commercial.jpg` | Service cards | 800×560 |
| `project-1.jpg` to `project-4.jpg` | Project gallery | 960×680 |
| `logo.svg` (optional) | Header/footer logo, set `company.logo` | square |

Change names or paths in `config.js` if you prefer. Update the `alt` text to describe each photo.

## Rebrand for a new business

Edit `config.js` only. Search for `>>> REPLACE <<<`:

- Company name, tagline, description, logo, brand colours
- Country, language, currency, time zone (drive phone format, currency format and the earliest bookable date)
- Phone, WhatsApp (empty = every WhatsApp button disappears), email, address, hours, service areas
- Services (`enabled: false` hides one everywhere, including the form and footer)
- Booking link (a Calendly/Jobber/etc. URL; empty = built-in request form)
- Social links (an icon only appears if its URL is filled in)
- Hero/about copy, FAQs, process steps, projects, reviews

Also edit the page title and Open Graph tags near the top of `index.html` (social crawlers don't run JavaScript).

### Pitch shortcuts (no editing)

Share a link that already looks local to the prospect:

- `index.html?market=ng` (also `us`, `ca`, `uk`, `au`): switches phone format, currency, time zone, hours and service areas
- `index.html?name=Arctic%20Air`: shows their company name
- Combine: `index.html?market=uk&name=Arctic%20Air`

## Before a real launch

1. Set `demoMode: false`. Sample reviews and demo projects are then hidden automatically (a section with nothing left disappears). Add real, permitted reviews with `demo: false`.
2. Replace all fictional contact details, and put the business' real social URLs in.
3. **Connect the form (required).** The form currently runs in demo mode and says clearly that nothing was sent. Create a form at Formspree, Web3Forms, Getform or Netlify Forms, and paste its URL into `form.endpoint`. It posts JSON with name, phone, email, service, date and message. Test a submission end to end.
4. Replace `privacy.html` and `terms.html` text with policies reviewed by a qualified professional.
5. Optional: set `seo.structuredData: true` and fill `contact.addressParts` and `seo.siteUrl` with real details to emit local-business structured data. Never enable it with the fictional demo address.

## What was built

Header with hamburger menu on mobile, hero, trust bar, services, about, how it works, projects, reviews, FAQ accordion, CTA band, contact and booking form, footer, plus privacy and terms pages. Semantic HTML, skip link, visible focus states, accessible form errors, reduced-motion support, lazy-loaded images with fixed aspect ratios (no layout shift), and image fallbacks.

## Files

- `config.js`: everything editable
- `index.html`: page shell, SEO tags, icon sprite
- `app.js`: sections (Header, HeroSection, TrustBar, ServicesSection, AboutSection, ProcessSection, ProjectsGallery, TestimonialsSection, FAQSection, CTASection, ContactSection, Footer) and behaviour
- `styles.css`: design tokens and styles
- `privacy.html`, `terms.html`, `legal.js`: placeholder legal pages
