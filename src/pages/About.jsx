import { motion } from "framer-motion";
import { Award, BadgeCheck, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";
import { IconBox } from "../components/Icons.jsx";

const CERTIFICATIONS = [
  {
    title: "ISO 27001 Certified",
    desc: "Internationally recognized standard for information security management systems.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
  },
  {
    title: "CCNA",
    desc: "Cisco Certified Network Associate — expertise in networking, routing, and switching.",
    color: "#7dd3fc",
    bg: "rgba(125,211,252,0.1)",
    border: "rgba(125,211,252,0.25)",
  },
  {
    title: "OffSec Certified Professional (OSCP)",
    desc: "Hands-on penetration testing certification from Offensive Security — real-world exploitation skills.",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.25)",
  },
  {
    title: "Security+ Certified",
    desc: "CompTIA Security+ — global benchmark for foundational cybersecurity knowledge and skills.",
    color: "#fde047",
    bg: "rgba(253,224,71,0.1)",
    border: "rgba(253,224,71,0.25)",
  },
];

const VALUE_ICONS = [
  { icon: "scale", color: "blue" },
  { icon: "grad", color: "green" },
  { icon: "wallet", color: "orange" },
  { icon: "spark", color: "purple" },
];

export default function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <>
      <PageHero
        eyebrow={a.eyebrow}
        title={a.title}
        subtitle={a.intro}
      />

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <motion.div
            className="mission-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="mission-box">
              <h3>
                <span className="grad-text">{a.missionTitle}</span>
              </h3>
              <p>{a.mission}</p>
            </div>
            <div className="mission-box">
              <h3>
                <span className="grad-text">{a.visionTitle}</span>
              </h3>
              <p>{a.vision}</p>
            </div>
          </motion.div>

          <motion.div
            className="hq-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="hq-photo">
              <img
                src={`${import.meta.env.BASE_URL}team.png`}
                alt={a.teamTitle || "FIKRADO Security Team"}
              />
              <div className="hq-caption">
                {a.teamTitle || "FIKRADO Security Team"}
                <br />
                <span>{a.teamCaption || ""}</span>
              </div>
            </div>
          </motion.div>

          <div className="section-head" style={{ marginTop: 90 }}>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              FIKRADO
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="grad-text">{a.valuesTitle}</span>
            </motion.h2>
          </div>

          <div className="values-grid">
            {a.values.map((v, i) => {
              const ic = VALUE_ICONS[i] || { icon: "spark", color: "blue" };
              return (
                <motion.div
                  className="value glass-card"
                  key={v.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <IconBox icon={ic.icon} color={ic.color} />
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="section-head" style={{ marginTop: 90 }}>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="grad-text">{a.officesTitle}</span>
            </motion.h2>
          </div>

          <motion.div
            className="hq-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="hq-photo">
              <img
                src={`${import.meta.env.BASE_URL}office.png`}
                alt={a.hqTitle || "FIKRADO Security Headquarters"}
              />
              <div className="hq-caption">
                {a.hqTitle || "FIKRADO Security Headquarters"}
                <br />
                <span>{a.hqCaption || ""}</span>
              </div>
            </div>
          </motion.div>

          <div className="offices-grid">
            {a.offices.map((o, i) => (
              <motion.div
                className="office glass-card"
                key={o.city}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <b>{o.city}</b>
                <span>{o.detail}</span>
              </motion.div>
            ))}
          </div>

          {/* ===================== CERTIFICATIONS ===================== */}
          <div className="section-head" style={{ marginTop: 90 }}>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Award size={14} strokeWidth={2.4} style={{ display: "inline", marginRight: 6 }} />
              Credentials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="grad-text">Certified & Trusted</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: 560, margin: "12px auto 0" }}
            >
              Our team holds industry-leading certifications — ensuring the highest standard of security expertise.
            </motion.p>
          </div>

          <div className="cert-grid">
            {CERTIFICATIONS.map((cert, i) => (
              <motion.div
                className="cert-card glass-card"
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="cert-badge" style={{ color: cert.color, background: cert.bg, borderColor: cert.border }}>
                  <BadgeCheck size={28} strokeWidth={2} />
                </div>
                <h3>{cert.title}</h3>
                <p>{cert.desc}</p>
                <div className="cert-verified" style={{ color: cert.color }}>
                  <ShieldCheck size={14} strokeWidth={2.4} />
                  Verified
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
