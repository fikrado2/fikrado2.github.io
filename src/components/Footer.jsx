import { Link } from "../compat/react-router-dom.jsx";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Shield, BookOpen, Video, GraduationCap, Home, Info, Award, BadgeCheck, MessageCircle, Newspaper } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import Logo from "./Logo.jsx";

const FOOTER_NAV = [
  { key: "home", to: "/", icon: Home },
  { key: "about", to: "/about", icon: Info },
  { key: "services", to: "/services", icon: Shield },
  { key: "courses", to: "/courses", icon: GraduationCap },
  { key: "books", to: "/books", icon: BookOpen },
  { key: "videos", to: "/videos", icon: Video },
  { key: "news", to: "/news", icon: Newspaper },
  { key: "contact", to: "/contact", icon: Mail },
];

// lucide-react v1 dropped brand marks, so the three social logos are inline
// SVGs (currentColor, so they inherit the hover colour from .footer-social-link).
function GithubMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedinMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function YoutubeMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.09 0 12 0 12s0 3.91.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.91 24 12 24 12s0-3.91-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { Icon: GithubMark, label: "GitHub", href: "https://github.com/fikrado-orgnasation/" },
  { Icon: LinkedinMark, label: "LinkedIn", href: "https://www.linkedin.com/company/fikrado" },
  { Icon: YoutubeMark, label: "YouTube", href: "https://www.youtube.com/@fikrad0" },
];

const CERTS = [
  "ISO 27001 Certified",
  "CCNA",
  "OffSec Certified Professional (OSCP)",
  "Security+ Certified",
];

export default function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  const contactLines =
    lang === "am"
      ? [
          { icon: Mail, text: "fikrado1@gmail.com", href: "mailto:fikrado1@gmail.com" },
          { icon: Phone, text: "+252 63 4048063", href: "tel:+252634048063" },
          { icon: Phone, text: "+251 984858498", href: "tel:+251984858498" },
          { icon: MapPin, text: "Masala, Hargeisa, Somaliland" },
          { icon: MapPin, text: "10th Kabele, Jijiga, Ethiopia" },
        ]
      : lang === "so"
        ? [
            { icon: Mail, text: "fikrado1@gmail.com", href: "mailto:fikrado1@gmail.com" },
            { icon: Phone, text: "+252 63 4048063", href: "tel:+252634048063" },
            { icon: Phone, text: "+251 984858498", href: "tel:+251984858498" },
            { icon: MapPin, text: "Masala, Hargeysa, Somaliland" },
            { icon: MapPin, text: "Kabele 10aad, Jijiga, Itoobiya" },
          ]
        : [
            { icon: Mail, text: "fikrado1@gmail.com", href: "mailto:fikrado1@gmail.com" },
            { icon: Phone, text: "+252 63 4048063", href: "tel:+252634048063" },
            { icon: Phone, text: "+251 984858498", href: "tel:+251984858498" },
            { icon: MapPin, text: "Masala, Hargeisa, Somaliland" },
            { icon: MapPin, text: "10th Kabele, Jijiga, Ethiopia" },
          ];

  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="brand" style={{ marginBottom: 18 }}>
              <Logo size={40} />
              <span className="brand-name">
                <span className="brand-fikrado">FIKRADO</span>
                <span className="brand-security">Security</span>
              </span>
            </div>
            <p className="footer-tagline">{t.footer.tagline}</p>
            <a
              className="footer-whatsapp"
              href={`https://wa.me/252634048063?text=${encodeURIComponent("Hello FIKRADO Security, I'd like to know more about your services.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} strokeWidth={2.2} />
              WhatsApp Support
            </a>

            <div className="footer-social">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  className="footer-social-link"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-nav-col">
            <h4>{t.footer.quickLinks}</h4>
            <ul className="footer-links">
              {FOOTER_NAV.map((l) => {
                const Icon = l.icon;
                return (
                  <li key={l.to}>
                    <Link to={l.to}>
                      <Icon size={14} strokeWidth={2} />
                      {t.nav[l.key]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>{t.footer.contactUs}</h4>
            {contactLines.map((c, i) => {
              const Icon = c.icon;
              const content = c.href ? (
                <a href={c.href}>{c.text}</a>
              ) : (
                <span>{c.text}</span>
              );
              return (
                <p key={i} className="footer-contact-row">
                  <Icon size={14} strokeWidth={2} className="footer-contact-icon" />
                  {content}
                </p>
              );
            })}
          </div>

          <div className="footer-cert-col">
            <h4>
              <Award size={16} strokeWidth={2.4} />
              Certifications
            </h4>
            <ul className="footer-certs">
              {CERTS.map((cert, i) => (
                <motion.li
                  key={cert}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <BadgeCheck size={16} color="#34d399" strokeWidth={2} />
                  {cert}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} FIKRADO Security. {t.footer.rights}</span>
          <div className="footer-powered">
            Powered by
            <Logo size={20} />
            <span className="footer-powered-name">
              <span className="footer-powered-fikrado">FIKRADO</span>
              <span className="footer-powered-security">Security</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
