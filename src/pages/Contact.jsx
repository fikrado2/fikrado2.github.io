import { motion } from "framer-motion";
import { useEffect } from "react";
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
    window.EhAPI = window.EhAPI || {};
    const createForm = () => {
      if (window.EhForms?.create) {
        window.EhForms.create({ formId, target });
      }
    };
    window.EhAPI.after_load = () => {
      window.EhAPI.set_account?.("18htoi4t7qqr02ff6lpljnoq53", "gmaildd");
      window.EhAPI.execute?.("rules");
      createForm();
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
              <h3>{c.formTitle}</h3>
              <div
                className="engage-hub-form-embed"
                id="eh_form_6207068009398272"
                data-id="6207068009398272"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
