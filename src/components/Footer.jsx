import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Shield, BookOpen, Video, GraduationCap, Home, Info, Award, BadgeCheck, MessageCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import Logo from "./Logo.jsx";

const FOOTER_NAV = [
  { key: "home", to: "/", icon: Home },
  { key: "about", to: "/about", icon: Info },
  { key: "services", to: "/services", icon: Shield },
  { key: "courses", to: "/courses", icon: GraduationCap },
  { key: "books", to: "/books", icon: BookOpen },
  { key: "videos", to: "/videos", icon: Video },
  { key: "contact", to: "/contact", icon: Mail },
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
