import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";
import { IconBox } from "../components/Icons.jsx";

const SERVICE_ICONS = [
  { icon: "shield", color: "green" },
  { icon: "bulb", color: "orange" },
  { icon: "network", color: "blue" },
  { icon: "search", color: "red" },
  { icon: "scan", color: "purple" },
  { icon: "package", color: "yellow" },
];

export default function Services() {
  const { t } = useLanguage();
  const s = t.services;

  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        title={s.title}
        subtitle={s.intro}
      />

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="cards">
            {s.services.map((svc, i) => {
              const ic = SERVICE_ICONS[i] || { icon: "shield", color: "blue" };
              return (
                <motion.div
                  className="service-card glass-card"
                  key={svc.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                >
                  <IconBox icon={ic.icon} color={ic.color} />
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <ul>
                    {svc.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="cta-band glass-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <h2>{s.ctaTitle}</h2>
            <p>{s.ctaDesc}</p>
            <Link className="btn btn-primary" to="/contact">
              {s.ctaBtn}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
