import { createContext, useContext, useEffect, useState } from "react";
import { translations, detectLanguage, detectLanguageByLocation, resolveLang, TRANSLATED_LANGS } from "./translations.js";

const LanguageContext = createContext(null);

const STORAGE_KEY = "fikrado-lang";
const VISITED_KEY = "fikrado-visited";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // `resolveLang` guards against an untranslated language: a browser locale
    // or geo lookup can return e.g. "ar"/"sw", and `translations[lang]` would
    // be undefined, blanking every page including the contact form.
    return resolveLang(saved || detectLanguage());
  });
  const [showLangPrompt, setShowLangPrompt] = useState(false);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang].meta.title;
  }, [lang]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const hasVisited = sessionStorage.getItem(VISITED_KEY);

    if (saved) {
      setLang(resolveLang(saved));
      setDetecting(false);
      if (!hasVisited) {
        setShowLangPrompt(true);
        sessionStorage.setItem(VISITED_KEY, "1");
      }
      return;
    }

    let cancelled = false;

    (async () => {
      const geoLang = await detectLanguageByLocation();
      if (cancelled) return;
      if (geoLang && geoLang !== detectLanguage()) {
        setLang(resolveLang(geoLang));
        localStorage.setItem(STORAGE_KEY, resolveLang(geoLang));
      }
      setDetecting(false);
      if (!hasVisited) {
        setShowLangPrompt(true);
        sessionStorage.setItem(VISITED_KEY, "1");
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const changeLang = (newLang) => {
    const resolved = resolveLang(newLang);
    setLang(resolved);
    localStorage.setItem(STORAGE_KEY, resolved);
    setShowLangPrompt(false);
  };

  const dismissPrompt = () => setShowLangPrompt(false);

  const t = translations[lang];

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang: changeLang,
        t,
        languages: TRANSLATED_LANGS,
        showLangPrompt,
        dismissPrompt,
        detecting,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
