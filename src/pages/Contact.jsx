import { motion } from "framer-motion";
import { useEffect } from "react";
import { LockKeyhole, Send } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";
import { IconBox } from "../components/Icons.jsx";

const CONTACT_ICONS = [
  { icon: "mail", color: "orange" },
  { icon: "phone", color: "green" },
  { icon: "phone", color: "blue" },
  { icon: "pin", color: "red" },
  { icon: "pin", color: "purple" },
];

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;

  useEffect(() => {
    const formId = "6207068009398272";
    const target = `#eh_form_${formId}`;
    const iframeId = `eh_form_ifrm_${formId}`;
    const initializationKey = `fikradoForm${formId}`;
    let formCreated = false;

    // Walks the iframe's text nodes and rewrites the vendor footer. The label
    // can arrive split across nodes, so nodes are matched individually and
    // the whole subtree is only rescanned when a match is actually replaced.
    const rebrandVendorFooter = (doc) => {
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node = walker.nextNode();
      while (node) {
        nodes.push(node);
        node = walker.nextNode();
      }

      for (const textNode of nodes) {
        const value = textNode.nodeValue;
        if (!value || !/engagebay/i.test(value)) continue;
        const replaced = value
          .replace(/powered\s*by\s*engagebay/gi, "Fikrado Enterprise Emailing System")
          .replace(/\bengagebay\b/gi, "Fikrado");
        if (replaced !== value) textNode.nodeValue = replaced;
      }
    };

    const themeForm = () => {
      const iframes = document.querySelectorAll(`#${iframeId}`);
      Array.from(iframes).slice(1).forEach((duplicate) => {
        const duplicateForm = duplicate.closest(".engage-hub-script-form");
        if (duplicateForm) duplicateForm.remove();
        else duplicate.remove();
      });
      const iframe = iframes[0];
      const iframeDocument = iframe?.contentDocument;
      if (!iframeDocument?.head) return;

      // Rebrand the vendor footer rendered inside the form iframe. Runs on
      // every tick (idempotent) because EngageBay injects it asynchronously,
      // possibly after the first pass.
      rebrandVendorFooter(iframeDocument);

      const existingTheme = iframeDocument.getElementById("fikrado-form-theme");
      if (existingTheme) {
        iframeDocument.head.appendChild(existingTheme);
        return;
      }

      const style = iframeDocument.createElement("style");
      style.id = "fikrado-form-theme";
      style.textContent = `
        :root { color-scheme: dark; }
        html, body { width: 100% !important; min-width: 0 !important; background: transparent !important; }
        body { margin: 0 !important; color: #e6ecf5 !important; font-family: "Plus Jakarta Sans", system-ui, sans-serif !important; }
        *, *::before, *::after { box-sizing: border-box !important; }
        body > div, #app, form { width: 100% !important; max-width: none !important; }
        body div { max-width: 100% !important; background: transparent !important; color: #e6ecf5 !important; }
        body span { color: inherit !important; }
        body > div, #app, #app > div, form, form > div { background-color: transparent !important; box-shadow: none !important; border-color: transparent !important; }
        form { background: transparent !important; color: #e6ecf5 !important; box-shadow: none !important; border: 0 !important; padding: 0 !important; }
        h1, h2, h3, h4 { color: #e6ecf5 !important; font-family: "Orbitron", "Plus Jakarta Sans", sans-serif !important; letter-spacing: 0 !important; }
        label, .label { color: #93a1b5 !important; font-size: 11px !important; font-weight: 700 !important; letter-spacing: .11em !important; text-transform: uppercase !important; }
        input, textarea, select, .eb-form-input {
          width: 100% !important; min-height: 50px !important; padding: 13px 15px !important;
          border: 1px solid rgba(255,255,255,.1) !important; border-radius: 8px !important;
          background: rgba(255,255,255,.045) !important; color: #e6ecf5 !important;
          font-family: "Plus Jakarta Sans", system-ui, sans-serif !important; font-size: 14px !important;
          outline: none !important; box-shadow: none !important; transition: border-color .2s ease, background .2s ease, box-shadow .2s ease !important;
        }
        input::placeholder, textarea::placeholder { color: #68758a !important; opacity: 1 !important; }
        input:focus, textarea:focus, select:focus, .eb-form-input:focus {
          border-color: rgba(125,211,252,.72) !important; background: rgba(125,211,252,.055) !important;
          box-shadow: 0 0 0 3px rgba(56,189,248,.1), 0 0 20px rgba(56,189,248,.08) !important;
        }
        button, input[type="submit"], .btn {
          width: 100% !important; min-height: 52px !important; margin-top: 8px !important; border: 0 !important;
          border-radius: 8px !important; background: linear-gradient(120deg, #fde047, #facc15 48%, #7dd3fc) !important;
          color: #0b1220 !important; font-family: "Plus Jakarta Sans", system-ui, sans-serif !important;
          font-size: 13px !important; font-weight: 800 !important; letter-spacing: .08em !important;
          text-transform: uppercase !important; cursor: pointer !important; box-shadow: 0 8px 28px rgba(250,204,21,.2) !important;
          transition: transform .2s ease, box-shadow .2s ease, filter .2s ease !important;
        }
        button:hover, input[type="submit"]:hover, .btn:hover { transform: translateY(-2px) !important; filter: brightness(1.05) !important; box-shadow: 0 10px 34px rgba(250,204,21,.3) !important; }
        button:active, input[type="submit"]:active, .btn:active { transform: scale(.985) !important; }
        img { filter: drop-shadow(0 0 12px rgba(250,204,21,.2)); }
        p, small, a { color: #78869a !important; }
      `;
      iframeDocument.head.appendChild(style);
      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.background = "transparent";
    };

    const watchForForm = window.setInterval(themeForm, 250);
    const stopWatching = window.setTimeout(() => window.clearInterval(watchForForm), 15000);
    window.EhAPI = window.EhAPI || {};

    const createForm = () => {
      const host = document.querySelector(target);
      if (window.EhForms?.create && host && !formCreated) {
        formCreated = true;
        window.EhForms.create({ formId, target });
        window.setTimeout(themeForm, 200);
      }
    };

    // Already bootstrapped on an earlier visit: the EngageBay script and
    // window.EhForms are still around, but this mount has a fresh empty host
    // element, so the form must still be created here. Returning early instead
    // left the re-visited Contact page with no form at all.
    if (window[initializationKey]) {
      createForm();
      return () => {
        window.clearInterval(watchForForm);
        window.clearTimeout(stopWatching);
      };
    }

    window[initializationKey] = true;
    window.EhAPI.after_load = () => {
      // Guarded: EhAPI is an empty object until ehform.js loads, so calling
      // into it unguarded throws and unmounts the whole page.
      if (typeof window.EhAPI.set_account === "function") {
        window.EhAPI.set_account("18htoi4t7qqr02ff6lpljnoq53", "gmaildd");
      }
      if (typeof window.EhAPI.execute === "function") {
        window.EhAPI.execute("rules");
      }
    };

    window.EhDynamicRef = window.EhDynamicRef || [];
    window.EhDynamicRef.push(createForm);

    if (!document.querySelector("script[data-engagebay-form]") && !window.EhForms) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.dataset.engagebayForm = "true";
      script.src = `https://d2p078bqz5urf7.cloudfront.net/jsapi/ehform.js?v${new Date().getHours()}`;
      script.onload = createForm;
      document.body.appendChild(script);
    } else {
      createForm();
    }

    return () => {
      window.clearInterval(watchForForm);
      window.clearTimeout(stopWatching);
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle=""
      />

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="contact-grid">
            <motion.div
              className="contact-info glass-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              {c.info.map((r, i) => {
                const ic = CONTACT_ICONS[i] || { icon: "mail", color: "blue" };
                return (
                  <motion.div
                    className="contact-row"
                    key={r.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <IconBox icon={ic.icon} color={ic.color} />
                    <div>
                      <div className="label">{r.label}</div>
                      {r.href ? <a href={r.href}>{r.value}</a> : <span>{r.value}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              className="contact-form glass-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="contact-form-header">
                <span className="contact-form-mark" aria-hidden="true"><Send size={20} /></span>
                <div>
                  <h3>{c.formTitle}</h3>
                  <p>{c.formIntro || "Our security team is ready to help with your request."}</p>
                </div>
              </div>
              <div className="contact-form-frame">
                <div
                  className="engage-hub-form-embed"
                  id="eh_form_6207068009398272"
                  data-id="6207068009398272"
                />
              </div>
              <div className="contact-form-trust">
                <LockKeyhole size={13} aria-hidden="true" />
                <span>System infrastructure and security provided by Fikrado Security</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
