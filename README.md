# MOHAMMED · Dental

A bilingual (Arabic RTL / English LTR) website template for dental clinics. Static HTML, CSS and vanilla JS, no build step.

- Calm hero with a single real-time 3D tooth (built procedurally as an inflated shape, no model files). The WebGL scene is created when the hero is near the viewport and fully disposed when it scrolls away; an SVG fallback is used when WebGL is unavailable or data saver is on.
- Eight services, a four-step visit flow, doctor cards with drawn avatars, an FAQ and a booking form that opens WhatsApp with a ready message in the current language.
- Language switch (saved locally and in `?lang=`), logical CSS properties so the layout mirrors automatically, mobile bottom bar, reduced-motion support, content that stays visible if JavaScript fails.
- All text and settings live in `js/content.js` (brand, WhatsApp number, phone, translations); the accent colour is `--teal` in `css/style.css`.

Names, address and hours are sample content to be replaced per clinic. The booking form sends nothing to a server: it only builds a WhatsApp link.

Designed and developed by Muhammed Elhuseyin.
