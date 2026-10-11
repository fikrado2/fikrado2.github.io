import { createContext, useContext, useEffect, useState } from "react";
import {
  translations,
  detectLanguage,
  detectLanguageByLocation,
  resolveLang,
  SUPPORTED_LANGS,
} from "./translations.js";
import { readBrowserStorage, writeBrowserStorage } from "../lib/browser-storage.js";

const LanguageContext = createContext(null);

const STORAGE_KEY = "fikrado-lang";
const VISITED_KEY = "fikrado-visited";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    const saved = readBrowserStorage("localStorage", STORAGE_KEY);
    return resolveLang(SUPPORTED_LANGS.includes(saved) ? saved : detectLanguage());
  });
  const [showLangPrompt, setShowLangPrompt] = useState(false);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang]?.meta?.title ?? translations.en.meta.title;
  }, [lang]);

  useEffect(() => {
    const saved = readBrowserStorage("localStorage", STORAGE_KEY);
    const hasVisited = readBrowserStorage("sessionStorage", VISITED_KEY);

    if (SUPPORTED_LANGS.includes(saved)) {
      setLang(resolveLang(saved));
      setDetecting(false);
      if (!hasVisited) {
        setShowLangPrompt(true);
        writeBrowserStorage("sessionStorage", VISITED_KEY, "1");
      }
      return;
    }

    let cancelled = false;

    (async () => {
      const geoLang = await detectLanguageByLocation();
      if (cancelled) return;
      if (geoLang && geoLang !== detectLanguage()) {
        const resolved = resolveLang(geoLang);
        setLang(resolved);
        writeBrowserStorage("localStorage", STORAGE_KEY, resolved);
      }
      setDetecting(false);
      if (!hasVisited) {
        setShowLangPrompt(true);
        writeBrowserStorage("sessionStorage", VISITED_KEY, "1");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const changeLang = (newLang) => {
    // The switcher lists every SUPPORTED_LANG, but only some have a translated
    // copy. Selecting an untranslated one must fall back to English rather than
    // leaving `lang` pointing at a missing translations entry.
    const resolved = resolveLang(newLang);
    setLang(resolved);
    writeBrowserStorage("localStorage", STORAGE_KEY, resolved);
    setShowLangPrompt(false);
  };

  const dismissPrompt = () => setShowLangPrompt(false);

  const t = translations[lang] ?? translations.en;

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang: changeLang,
        t,
        languages: SUPPORTED_LANGS,
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
