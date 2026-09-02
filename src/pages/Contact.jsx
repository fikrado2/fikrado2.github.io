import { motion } from "framer-motion";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nMessage: ${data.get("message")}`;
    window.location.href = `mailto:fikrado1@gmail.com?subject=Website%20Inquiry&body=${encodeURIComponent(body)}`;
  };

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

            <motion.form
              className="contact-form glass-card"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3>{c.formTitle}</h3>
              <input name="name" placeholder={c.name} required />
              <input name="email" type="email" placeholder={c.email} required />
              <textarea name="message" placeholder={c.message} required />
              <button className="btn btn-primary" type="submit">
                {c.submit}
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
}
