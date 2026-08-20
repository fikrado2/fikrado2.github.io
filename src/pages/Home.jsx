import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  Cpu,
  GraduationCap,
  Network,
  Search,
  BookOpen,
  Rocket,
  HeartHandshake,
  Terminal,
  Globe2,
  ArrowRight,
  Users,
  Award,
  Code2,
  BrainCircuit,
  BadgeCheck,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

/* Typing terminal effect */
function TerminalTyping() {
  const lines = [
    { text: "$ initializing fikrado-security.sh", color: "#34d399" },
    { text: "> loading threat intelligence modules...", color: "#93a1b5" },
    { text: "> scanning network topology...", color: "#93a1b5" },
    { text: "> AI defense systems: ACTIVE", color: "#34d399" },
    { text: "> 0 vulnerabilities detected", color: "#34d399" },
    { text: "$ ready to protect.", color: "#fde047" },
  ];
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) {
      const reset = setTimeout(() => {
        setVisibleLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
      }, 4000);
      return () => clearTimeout(reset);
    }
    const line = lines[currentLine].text;
    if (currentChar < line.length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), 35);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleLines((prev) => [...prev, lines[currentLine]]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, 400);
    return () => clearTimeout(t);
  }, [currentLine, currentChar]);

  const displayText =
    currentLine < lines.length
      ? lines[currentLine].text.slice(0, currentChar)
      : "";

  return (
    <div className="hp-terminal">
      <div className="hp-terminal-bar">
        <span className="hp-term-dot hp-term-red" />
        <span className="hp-term-dot hp-term-yellow" />
        <span className="hp-term-dot hp-term-green" />
        <span className="hp-term-title">fikrado@security:~</span>
      </div>
      <div className="hp-terminal-body">
        {visibleLines.map((l, i) => (
          <div key={i} className="hp-term-line" style={{ color: l.color }}>
            {l.text}
          </div>
        ))}
        {currentLine < lines.length && (
          <div className="hp-term-line" style={{ color: lines[currentLine].color }}>
            {displayText}
            <span className="hp-term-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

/* Animated counter */
function Counter({ value, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const STATS = [
  { icon: HeartHandshake, value: 50, suffix: "%", label: "Non-Profit", color: "#34d399" },
  { icon: Users, value: 500, suffix: "+", label: "Youth Trained", color: "#7dd3fc" },
  { icon: Globe2, value: 2, suffix: "", label: "Countries Served", color: "#fde047" },
  { icon: Award, value: 24, suffix: "/7", label: "Security Support", color: "#a78bfa" },
];

const WHAT_WE_DO = [
  {
    icon: ShieldCheck,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
    title: "Cybersecurity Services",
    desc: "Penetration testing, network defense, and incident response for organizations across the Horn of Africa.",
  },
  {
    icon: BrainCircuit,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.25)",
    title: "AI Education",
    desc: "Teaching artificial intelligence and machine learning to East African youth — building the next generation of innovators.",
  },
  {
    icon: GraduationCap,
    color: "#fde047",
    bg: "rgba(253,224,71,0.1)",
    border: "rgba(253,224,71,0.25)",
    title: "Tech Courses",
    desc: "Hands-on courses in Linux, networking, ethical hacking, and coding — designed for real careers, not just certificates.",
  },
  {
    icon: BookOpen,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.1)",
    border: "rgba(251,146,60,0.25)",
    title: "Accessible Learning Resources",
    desc: "Books, videos, and community workshops — affordable for everyone, with 50% of seats free for students who need them most.",
  },
];

const AI_FEATURES = [
  { icon: Cpu, color: "#a78bfa", title: "Hands-On AI Labs", desc: "Students build and train real models — not just theory." },
  { icon: Code2, color: "#7dd3fc", title: "Programming Foundations", desc: "Python, data science, and ML basics from the ground up." },
  { icon: Network, color: "#34d399", title: "Cyber + AI Integration", desc: "How AI is transforming security — and how to use it ethically." },
  { icon: Rocket, color: "#fde047", title: "Career Pathways", desc: "Connecting graduates with internships and tech opportunities." },
];

const SECURITY_FEATURES = [
  { icon: LockKeyhole, color: "#34d399", title: "Penetration Testing", desc: "Find and fix vulnerabilities before attackers do." },
  { icon: Eye, color: "#7dd3fc", title: "Threat Detection", desc: "AI-powered monitoring that never sleeps." },
  { icon: Search, color: "#f87171", title: "Incident Response", desc: "Rapid containment and recovery when it matters most." },
  { icon: Network, color: "#fb923c", title: "Network Defense", desc: "Hardening, audits, and resilient architecture." },
];

const CERTIFICATIONS = [
  {
    title: "ISO 27001",
    subtitle: "Certified",
    desc: "Internationally recognized standard for information security management systems.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
  },
  {
    title: "CCNA",
    subtitle: "Cisco Certified",
    desc: "Expertise in networking, routing, and switching from Cisco Systems.",
    color: "#7dd3fc",
    bg: "rgba(125,211,252,0.1)",
    border: "rgba(125,211,252,0.25)",
  },
  {
    title: "OSCP",
    subtitle: "OffSec Certified Professional",
    desc: "Hands-on penetration testing certification from Offensive Security.",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.25)",
  },
  {
    title: "Security+",
    subtitle: "CompTIA Certified",
    desc: "Global benchmark for foundational cybersecurity knowledge and skills.",
    color: "#fde047",
    bg: "rgba(253,224,71,0.1)",
    border: "rgba(253,224,71,0.25)",
  },
];

export default function Home() {
  const { t } = useLanguage();
  const h = t.home;
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 80]);

  return (
    <div className="hp">
      {/* ===================== HERO ===================== */}
      <section className="hp-hero" ref={heroRef}>
        <motion.div
          className="container hp-hero-inner"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div
            className="hp-hero-copy"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="hp-badge">
              <span className="hp-badge-dot" />
              50% Non-Profit Cybersecurity & AI Education
            </div>
            <h1 className="hp-hero-title">
              Securing Digital Futures.
              <br />
              <span className="hp-hero-accent">Empowering Youth with AI.</span>
            </h1>
            <p className="hp-hero-sub">{h.subtitle}</p>
            <div className="hp-hero-actions">
              <Link className="hp-btn hp-btn-primary" to="/courses">
                <GraduationCap size={18} strokeWidth={2.4} />
                {h.cta2}
              </Link>
              <Link className="hp-btn hp-btn-ghost" to="/services">
                <ShieldCheck size={18} strokeWidth={2.2} />
                {h.cta1}
              </Link>
            </div>
            <div className="hp-hero-meta">
              <Terminal size={14} />
              <span>Trusted across Somaliland & Ethiopia</span>
            </div>
          </motion.div>

          <motion.div
            className="hp-hero-visual"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
          >
            <div className="hp-hero-glow" />
            <TerminalTyping />
            <div className="hp-shield-stack">
              <div className="hp-shield-card hp-shield-1">
                <ShieldCheck size={28} color="#34d399" />
                <div>
                  <strong>System Protected</strong>
                  <span>All endpoints secure</span>
                </div>
              </div>
              <div className="hp-shield-card hp-shield-2">
                <BrainCircuit size={28} color="#a78bfa" />
                <div>
                  <strong>AI Active</strong>
                  <span>Threat detection online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hp-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span>Scroll to explore</span>
          <div className="hp-scroll-line" />
        </motion.div>
      </section>

      {/* ===================== CERTIFICATIONS ===================== */}
      <section className="hp-section hp-certs-section">
        <div className="container">
          <motion.div
            className="hp-section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">
              <Award size={14} strokeWidth={2.4} style={{ display: "inline", marginRight: 6 }} />
              Certifications
            </span>
            <h2>
              <span className="grad-text">Certified & Trusted</span>
            </h2>
            <p>
              Our team holds industry-leading certifications — ensuring the highest standard
              of security expertise for every client we serve.
            </p>
          </motion.div>

          <div className="hp-certs-grid">
            {CERTIFICATIONS.map((cert, i) => (
              <motion.div
                className="hp-cert-card glass-card"
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="hp-cert-badge" style={{ color: cert.color, background: cert.bg, borderColor: cert.border }}>
                  <BadgeCheck size={28} strokeWidth={2} />
                </div>
                <h3>{cert.title}</h3>
                <span className="hp-cert-subtitle" style={{ color: cert.color }}>{cert.subtitle}</span>
                <p>{cert.desc}</p>
                <div className="hp-cert-verified" style={{ color: cert.color }}>
                  <ShieldCheck size={14} strokeWidth={2.4} />
                  Verified
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="hp-stats-section">
        <div className="container">
          <div className="hp-stats-grid">
            {STATS.map((s, i) => (
              <motion.div
                className="hp-stat-card glass-card"
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <s.icon size={28} color={s.color} strokeWidth={2} />
                <div className="hp-stat-value">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="hp-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHAT WE DO ===================== */}
      <section className="hp-section">
        <div className="container">
          <motion.div
            className="hp-section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">What We Do</span>
            <h2>
              <span className="grad-text">Two Missions, One Vision</span>
            </h2>
            <p>
              We protect organizations from digital threats while building a generation of
              skilled technologists through accessible, practical education.
            </p>
          </motion.div>

          <div className="hp-cards-grid">
            {WHAT_WE_DO.map((item, i) => (
              <motion.div
                className="hp-feature-card glass-card"
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span
                  className="hp-feature-icon"
                  style={{ color: item.color, background: item.bg, borderColor: item.border }}
                >
                  <item.icon size={26} strokeWidth={2} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AI EDUCATION ===================== */}
      <section className="hp-section hp-ai-section">
        <div className="container">
          <div className="hp-ai-grid">
            <motion.div
              className="hp-ai-copy"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <span className="eyebrow">AI for East Africa</span>
              <h2>
                Teaching AI to the
                <br />
                <span className="grad-text">Next Generation</span>
              </h2>
              <p className="hp-ai-desc">
                We believe artificial intelligence shouldn't be locked behind paywalls or
                elite universities. That's why we're bringing hands-on AI education to youth
                across East Africa — completely free for those who need it.
              </p>
              <p className="hp-ai-desc">
                From Python programming to machine learning and AI-powered cybersecurity,
                our students don't just learn theory — they build real projects that solve
                real problems in their communities.
              </p>
              <Link className="hp-btn hp-btn-primary" to="/courses">
                Start Learning <ArrowRight size={16} />
              </Link>
            </motion.div>

            <div className="hp-ai-features">
              {AI_FEATURES.map((f, i) => (
                <motion.div
                  className="hp-ai-feature glass-card"
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <span className="hp-ai-feature-icon" style={{ color: f.color }}>
                    <f.icon size={22} strokeWidth={2} />
                  </span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECURITY PREVIEW ===================== */}
      <section className="hp-section">
        <div className="container">
          <motion.div
            className="hp-section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Cybersecurity</span>
            <h2>
              <span className="grad-text">Professional Security Services</span>
            </h2>
            <p>
              High-quality security solutions for individuals, businesses, and institutions —
              backed by certified experts and AI-powered tools.
            </p>
          </motion.div>

          <div className="hp-security-grid">
            {SECURITY_FEATURES.map((f, i) => (
              <motion.div
                className="hp-security-card glass-card"
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span
                  className="hp-security-icon"
                  style={{ color: f.color, background: `${f.color}1a`, borderColor: `${f.color}40` }}
                >
                  <f.icon size={24} strokeWidth={2} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="hp-section-cta">
            <Link className="hp-btn hp-btn-ghost" to="/services">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="hp-section">
        <div className="container">
          <motion.div
            className="hp-cta glass-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="hp-cta-glow" />
            <h2>{h.ctaTitle}</h2>
            <p>{h.ctaDesc}</p>
            <div className="hp-cta-actions">
              <Link className="hp-btn hp-btn-primary" to="/contact">
                <Rocket size={18} strokeWidth={2.4} />
                {h.ctaBtn}
              </Link>
              <Link className="hp-btn hp-btn-ghost" to="/books">
                <BookOpen size={18} strokeWidth={2.2} />
                {h.booksMore}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
