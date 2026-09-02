import { motion, AnimatePresence } from "framer-motion";
import { Globe, X, Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { LANG_NAMES } from "../i18n/translations.js";

export default function LanguagePrompt() {
  const { lang, setLang, languages, showLangPrompt, dismissPrompt, detecting } = useLanguage();

  return (
    <AnimatePresence>
      {showLangPrompt && !detecting && (
        <>
          <motion.div
            className="lang-blur-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="lang-prompt"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <button className="lang-prompt-close" onClick={dismissPrompt} aria-label="Dismiss">
              <X size={18} />
            </button>
            <div className="lang-prompt-icon">
              <Globe size={32} strokeWidth={2} />
            </div>
            <h3>Choose Your Language</h3>
            <p>We detected your location. Select your preferred language to continue.</p>
            <div className="lang-prompt-options">
              {languages.map((code) => (
                <button
                  key={code}
                  className={`lang-prompt-btn ${lang === code ? "active" : ""}`}
                  onClick={() => setLang(code)}
                >
                  <span>{LANG_NAMES[code] || code.toUpperCase()}</span>
                  {lang === code && <Check size={16} />}
                </button>
              ))}
            </div>
            <button className="lang-prompt-confirm" onClick={dismissPrompt}>
              Continue in {LANG_NAMES[lang] || "English"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
