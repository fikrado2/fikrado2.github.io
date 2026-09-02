import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check, X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { LANG_NAMES, LANG_FLAGS } from "../i18n/translations.js";

export default function LanguageSwitcher() {
  const { lang, setLang, languages, showLangPrompt, dismissPrompt, detecting } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isFirstVisit = showLangPrompt && !detecting;

  useEffect(() => {
    if (isFirstVisit) setOpen(true);
  }, [isFirstVisit]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (isFirstVisit) return;
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open, isFirstVisit]);

  const handleSelect = (code) => {
    setLang(code);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (isFirstVisit) dismissPrompt();
  };

  return (
    <>
      <AnimatePresence>
        {isFirstVisit && open && (
          <motion.div
            className="lang-fab-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <div className={`lang-switcher-fab ${isFirstVisit && open ? "glowing" : ""}`} ref={ref}>
        {isFirstVisit && open && (
          <button className="lang-fab-skip" onClick={handleClose} aria-label="Close">
            <X size={16} />
          </button>
        )}

        <motion.button
          className="lang-fab-btn"
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Change language"
        >
          <Globe size={20} strokeWidth={2.2} />
          <span className="lang-fab-code">{LANG_FLAGS[lang] || lang.toUpperCase()}</span>
          <ChevronDown size={14} className={`lang-fab-chevron ${open ? "open" : ""}`} />
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              className="lang-fab-menu"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="lang-fab-menu-title">Choose Language</div>
              {languages.map((code) => (
                <button
                  key={code}
                  className={`lang-fab-option ${lang === code ? "active" : ""}`}
                  onClick={() => handleSelect(code)}
                >
                  <span className="lang-fab-flag">{LANG_FLAGS[code] || code.toUpperCase()}</span>
                  <span className="lang-fab-name">{LANG_NAMES[code] || code}</span>
                  {lang === code && <Check size={15} className="lang-fab-check" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
