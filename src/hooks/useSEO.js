import { useEffect } from "react";

const SITE_URL = "https://fikrado2.github.io";
const SITE_NAME = "FIKRADO Security";

const PAGE_META = {
  "/": {
    title: "FIKRADO Security | Cybersecurity Services & Tech Courses in East Africa",
    description:
      "FIKRADO Security offers professional cybersecurity services and technology courses across the Horn of Africa. Penetration testing, network defense, ethical hacking, Linux, and AI education. 50% non-profit.",
    keywords:
      "FIKRADO Security, cybersecurity, cybersecurity Africa, penetration testing, ethical hacking, Linux course, AI education, Hargeisa, Jijiga, Horn of Africa, security services",
  },
  "/about": {
    title: "About FIKRADO Security | Our Mission & Team",
    description:
      "FIKRADO Security is a 50% non-profit cybersecurity company serving the Horn of Africa. Learn about our mission, vision, values, certified team, and offices in Hargeisa and Jijiga.",
    keywords:
      "about FIKRADO Security, cybersecurity company, non-profit security, Hargeisa, Jijiga, Horn of Africa, security mission, certified team, ISO 27001, OSCP, CCNA",
  },
  "/services": {
    title: "Cybersecurity Services | Penetration Testing & Network Defense",
    description:
      "Professional cybersecurity services: penetration testing, security awareness training, network defense, incident response, data protection, and security audits. Serving Somaliland and Ethiopia.",
    keywords:
      "penetration testing, network defense, incident response, security audit, data protection, security awareness, cybersecurity services, Somaliland, Ethiopia",
  },
  "/courses": {
    title: "Technology Courses | Cybersecurity, Linux & AI Education — $18/course",
    description:
      "Hands-on technology courses in cybersecurity, Linux, networking, ethical hacking, and AI. $18 per course. 50% non-profit with scholarships available. Online and in-person across the Horn of Africa.",
    keywords:
      "cybersecurity course, Linux course, ethical hacking course, networking course, AI education, programming course, tech courses Africa, online security course, $18 course",
  },
  "/books": {
    title: "Technology Books | PDF Downloads — $7 per book",
    description:
      "Practical technology books by Yahye Abdirahman covering hacking, Linux, AI, computer skills, and programming. PDF format, $7 per book. Accessible learning for the Horn of Africa.",
    keywords:
      "technology books, cybersecurity book, Linux book, AI book, programming book, PDF book, Yahye Abdirahman, Isbar, affordable books, tech education Africa",
  },
  "/videos": {
    title: "Video Library | Free Cybersecurity & Tech Tutorials",
    description:
      "Free video tutorials on cybersecurity, Linux, ethical hacking, web security, and phishing defense. Watch and learn from FIKRADO Security's YouTube channel.",
    keywords:
      "cybersecurity videos, security tutorials, Linux tutorial, ethical hacking video, web security, phishing defense, free tech videos, FIKRADO YouTube",
  },
  "/contact": {
    title: "Contact FIKRADO Security | Get in Touch",
    description:
      "Contact FIKRADO Security for cybersecurity services, course enrollment, or book orders. Email fikrado1@gmail.com, call +252 63 4048063 or +251 98 4858498. Offices in Hargeisa and Jijiga.",
    keywords:
      "contact FIKRADO Security, cybersecurity contact, security services inquiry, course enrollment, book order, Hargeisa, Jijiga, WhatsApp support",
  },
};

const COURSE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "FIKRADO Security Technology Courses",
  itemListElement: [
    {
      "@type": "Course",
      name: "Cybersecurity Essentials",
      description:
        "A plain-language introduction to threats, defenses, and how the internet stays secure.",
      provider: { "@type": "Organization", name: "FIKRADO Security", sameAs: "https://fikrado2.github.io/" },
      offers: { "@type": "Offer", price: "18", priceCurrency: "USD" },
    },
    {
      "@type": "Course",
      name: "Linux Fundamentals",
      description: "Master the command line, file system, and administration that power modern IT.",
      provider: { "@type": "Organization", name: "FIKRADO Security", sameAs: "https://fikrado2.github.io/" },
      offers: { "@type": "Offer", price: "18", priceCurrency: "USD" },
    },
    {
      "@type": "Course",
      name: "Networking & Infrastructure",
      description: "Understand TCP/IP, routing, and network services behind every connected system.",
      provider: { "@type": "Organization", name: "FIKRADO Security", sameAs: "https://fikrado2.github.io/" },
      offers: { "@type": "Offer", price: "18", priceCurrency: "USD" },
    },
    {
      "@type": "Course",
      name: "Ethical Hacking",
      description: "Learn how attackers think so you can defend better — with legal, responsible techniques.",
      provider: { "@type": "Organization", name: "FIKRADO Security", sameAs: "https://fikrado2.github.io/" },
      offers: { "@type": "Offer", price: "18", priceCurrency: "USD" },
    },
    {
      "@type": "Course",
      name: "Web Application Security",
      description: "Find and fix OWASP top 10 vulnerabilities in real web applications.",
      provider: { "@type": "Organization", name: "FIKRADO Security", sameAs: "https://fikrado2.github.io/" },
      offers: { "@type": "Offer", price: "18", priceCurrency: "USD" },
    },
    {
      "@type": "Course",
      name: "Digital Literacy",
      description: "Accessible technology and online-safety education for students and communities.",
      provider: { "@type": "Organization", name: "FIKRADO Security", sameAs: "https://fikrado2.github.io/" },
      offers: { "@type": "Offer", price: "18", priceCurrency: "USD" },
    },
  ],
};

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Cybersecurity Services",
  provider: {
    "@type": "Organization",
    name: "FIKRADO Security",
    url: "https://fikrado2.github.io/",
  },
  areaServed: ["Somaliland", "Ethiopia", "Horn of Africa"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Security Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Penetration Testing" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Security Awareness Training" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Network Defense" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Incident Response" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Data Protection" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Security Audits" } },
    ],
  },
};

const PAGE_JSONLD = {
  "/courses": COURSE_JSONLD,
  "/services": SERVICE_JSONLD,
};

function setOrCreateMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setOrCreateLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function useSEO(pathname) {
  useEffect(() => {
    const meta = PAGE_META[pathname] || PAGE_META["/"];

    document.title = meta.title;

    setOrCreateMeta("name", "title", meta.title);
    setOrCreateMeta("name", "description", meta.description);
    setOrCreateMeta("name", "keywords", meta.keywords);

    setOrCreateMeta("property", "og:title", meta.title);
    setOrCreateMeta("property", "og:description", meta.description);
    setOrCreateMeta("property", "og:url", `${SITE_URL}/#${pathname}`);

    setOrCreateMeta("name", "twitter:title", meta.title);
    setOrCreateMeta("name", "twitter:description", meta.description);

    setOrCreateLink("canonical", `${SITE_URL}/`);

    let jsonldEl = document.getElementById("page-jsonld");
    if (jsonldEl) jsonldEl.remove();

    const jsonld = PAGE_JSONLD[pathname];
    if (jsonld) {
      jsonldEl = document.createElement("script");
      jsonldEl.type = "application/ld+json";
      jsonldEl.id = "page-jsonld";
      jsonldEl.text = JSON.stringify(jsonld);
      document.head.appendChild(jsonldEl);
    }
  }, [pathname]);
}
