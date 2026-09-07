import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Info, Shield, BookOpen, Video, Mail, GraduationCap, Menu, X, MessageCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import Logo from "./Logo.jsx";

const NAV_ITEMS = [
  { key: "home", to: "/", icon: Home },
  { key: "about", to: "/about", icon: Info },
  { key: "services", to: "/services", icon: Shield },
  { key: "courses", to: "/courses", icon: GraduationCap },
  { key: "books", to: "/books", icon: BookOpen },
  { key: "videos", to: "/videos", icon: Video },
  { key: "contact", to: "/contact", icon: Mail },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, lang, setLang, languages } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, lang]);

  return (
    <motion.header
      className={`nav ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container nav-inner">
        <Link className="brand" to="/">
          <Logo />
          <span className="brand-name">
            <span className="brand-fikrado">FIKRADO</span>
            <span className="brand-security">SECURITY</span>
          </span>
        </Link>

        <nav className="nav-center">
          <ul className={`nav-links ${open ? "open" : ""}`}>
            {NAV_ITEMS.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    end={l.to === "/"}
                  >
                    <Icon size={15} strokeWidth={2} className="nav-icon" />
                    {t.nav[l.key]}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav-right">
          <a
            className="nav-contact nav-whatsapp"
            href="https://wa.me/252634048063?text=Hello%20FIKRADO%20Security%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={15} strokeWidth={2.4} />
            <span>WhatsApp</span>
          </a>
          <button
            className="nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container">
              <ul className="nav-mobile-links">
                {NAV_ITEMS.map((l, i) => {
                  const Icon = l.icon;
                  return (
                    <motion.li
                      key={l.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
                        <Icon size={18} strokeWidth={2} />
                        {t.nav[l.key]}
                      </NavLink>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
