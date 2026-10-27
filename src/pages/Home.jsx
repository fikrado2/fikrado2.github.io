import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "../compat/react-router-dom.jsx";
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
  Download,
  Users,
  Award,
  Code2,
  BrainCircuit,
  BadgeCheck,
  CheckCircle2,
  Activity,
  Radio,
  Sparkles,
  Layers,
  Binary,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

/* -------------------------------------------------------------
   1. Interactive Typing Terminal
   ------------------------------------------------------------- */
function TerminalTyping() {
  const lines = [
    { text: "$ initializing fikrado-defense-node --live", color: "#34d399" },
    { text: "> loading threat intelligence core v4.2...", color: "#93a1b5" },
    { text: "> scanning Horn of Africa network perimeters...", color: "#93a1b5" },
    { text: "> AI defense heuristics: ACTIVE (0 latency)", color: "#34d399" },
    { text: "> zero vulnerabilities detected // all ports secure", color: "#7dd3fc" },
    { text: "$ status: ALL ENDPOINTS PROTECTED.", color: "#fde047" },
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
      }, 5000);
      return () => clearTimeout(reset);
    }
    const line = lines[currentLine].text;
    if (currentChar < line.length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), 30);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleLines((prev) => [...prev, lines[currentLine]]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, 380);
    return () => clearTimeout(t);
  }, [currentLine, currentChar, lines]);

  const displayText =
    currentLine < lines.length ? lines[currentLine].text.slice(0, currentChar) : "";

  return (
    <div className="hp-deck-screen hp-terminal-body">
      <div className="hp-term-scanline" />
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
  );
}

/* -------------------------------------------------------------
   2. Interactive 3D Cyber Threat Radar
   ------------------------------------------------------------- */
function ThreatRadar() {
  return (
    <div className="hp-deck-screen hp-radar-screen">
      <div className="hp-radar-grid">
        <div className="hp-radar-circle hp-radar-circle-1" />
        <div className="hp-radar-circle hp-radar-circle-2" />
        <div className="hp-radar-circle hp-radar-circle-3" />
        <div className="hp-radar-crosshair-h" />
        <div className="hp-radar-crosshair-v" />
        <div className="hp-radar-sweep" />

        {/* Dynamic radar blips */}
        <div className="hp-radar-blip hp-blip-1" title="Node 01: Hargeisa Secure" />
        <div className="hp-radar-blip hp-blip-2" title="Node 02: Addis Ababa Secure" />
        <div className="hp-radar-blip hp-blip-3" title="Node 03: Mogadishu Secure" />
        <div className="hp-radar-blip hp-blip-4" title="AI Sentinel: Active" />
      </div>

      <div className="hp-radar-telemetry">
        <div className="hp-telemetry-row">
          <span className="hp-telemetry-label">RADAR SWEEP:</span>
          <span className="hp-telemetry-val" style={{ color: "#34d399" }}>
            360° ACTIVE
          </span>
        </div>
        <div className="hp-telemetry-row">
          <span className="hp-telemetry-label">PERIMETER STATUS:</span>
          <span className="hp-telemetry-val" style={{ color: "#7dd3fc" }}>
            ZERO INTRUSIONS
          </span>
        </div>
        <div className="hp-telemetry-row">
          <span className="hp-telemetry-label">ENCRYPTION PROTOCOL:</span>
          <span className="hp-telemetry-val" style={{ color: "#fde047" }}>
            AES-256-GCM / POST-QUANTUM
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   3. Interactive AI Neural Engine Deck
   ------------------------------------------------------------- */
function NeuralMatrix() {
  return (
    <div className="hp-deck-screen hp-neural-screen">
      <div className="hp-neural-grid">
        <div className="hp-neural-node hp-n-center">
          <BrainCircuit size={28} color="#a78bfa" />
          <span>NEURAL CORE</span>
        </div>
        <div className="hp-neural-node hp-n-top">
          <ShieldCheck size={18} color="#34d399" />
          <span>GUARD</span>
        </div>
        <div className="hp-neural-node hp-n-right">
          <Eye size={18} color="#7dd3fc" />
          <span>VISION</span>
        </div>
        <div className="hp-neural-node hp-n-bottom">
          <Binary size={18} color="#fde047" />
          <span>HEURISTIC</span>
        </div>
        <div className="hp-neural-node hp-n-left">
          <LockKeyhole size={18} color="#f87171" />
          <span>ISOLATION</span>
        </div>
        <svg className="hp-neural-svg" viewBox="0 0 300 200">
          <line
            x1="150"
            y1="100"
            x2="150"
            y2="30"
            stroke="rgba(167,139,250,0.4)"
            strokeDasharray="4 4"
          />
          <line
            x1="150"
            y1="100"
            x2="260"
            y2="100"
            stroke="rgba(125,211,252,0.4)"
            strokeDasharray="4 4"
          />
          <line
            x1="150"
            y1="100"
            x2="150"
            y2="170"
            stroke="rgba(253,224,71,0.4)"
            strokeDasharray="4 4"
          />
          <line
            x1="150"
            y1="100"
            x2="40"
            y2="100"
            stroke="rgba(248,113,113,0.4)"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
      <div className="hp-neural-metrics">
        <div className="hp-metric-chip">
          <small>ANOMALY SCORE</small>
          <strong>0.0001%</strong>
        </div>
        <div className="hp-metric-chip">
          <small>INFERENCE SPEED</small>
          <strong>1.2ms</strong>
        </div>
        <div className="hp-metric-chip">
          <small>DEFENSE MODE</small>
          <strong style={{ color: "#34d399" }}>AUTONOMOUS</strong>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   4. High-Tech 3D Cyber Command Console
   ------------------------------------------------------------- */
function CyberCommandDeck() {
  const [deckTab, setDeckTab] = useState("terminal");

  return (
    <div className="hp-deck-wrapper glass-card">
      <div className="hp-deck-header">
        <div className="hp-deck-traffic">
          <span className="hp-term-dot hp-term-red" />
          <span className="hp-term-dot hp-term-yellow" />
          <span className="hp-term-dot hp-term-green" />
        </div>
        <div className="hp-deck-tabs">
          <button
            type="button"
            className={`hp-deck-tab ${deckTab === "terminal" ? "active" : ""}`}
            onClick={() => setDeckTab("terminal")}
          >
            <Terminal size={13} />
            <span>TERMINAL</span>
          </button>
          <button
            type="button"
            className={`hp-deck-tab ${deckTab === "radar" ? "active" : ""}`}
            onClick={() => setDeckTab("radar")}
          >
            <Radio size={13} />
            <span>RADAR</span>
          </button>
          <button
            type="button"
            className={`hp-deck-tab ${deckTab === "neural" ? "active" : ""}`}
            onClick={() => setDeckTab("neural")}
          >
            <BrainCircuit size={13} />
            <span>AI CORE</span>
          </button>
        </div>
        <div className="hp-deck-live-pill">
          <span className="hp-pulse-dot" />
          <span>LIVE</span>
        </div>
      </div>

      <div className="hp-deck-content">
        {deckTab === "terminal" && <TerminalTyping />}
        {deckTab === "radar" && <ThreatRadar />}
        {deckTab === "neural" && <NeuralMatrix />}
      </div>

      <div className="hp-deck-footer">
        <div className="hp-deck-foot-item">
          <Activity size={12} color="#34d399" />
          <span>SYSTEM // NOMINAL</span>
        </div>
        <div className="hp-deck-foot-item">
          <Globe2 size={12} color="#7dd3fc" />
          <span>NODES // HORN OF AFRICA</span>
        </div>
        <div className="hp-deck-foot-item">
          <ShieldCheck size={12} color="#fde047" />
          <span>GUARD // ZERO-DAY</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   5. Animated Counter
   ------------------------------------------------------------- */
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
      { threshold: 0.4 },
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

/* -------------------------------------------------------------
   DATA CONSTANTS
   ------------------------------------------------------------- */
const STATS = [
  {
    icon: HeartHandshake,
    value: 50,
    suffix: "%",
    label: "Non-Profit Mission",
    desc: "Reinvested directly into youth scholarships and accessible community education.",
    color: "#34d399",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Youth Trained",
    desc: "Graduates equipped with real-world ethical hacking, networking, and AI skills.",
    color: "#7dd3fc",
  },
  {
    icon: Globe2,
    value: 2,
    suffix: "",
    label: "Countries Served",
    desc: "Cross-border impact and security operations across Somaliland and Ethiopia.",
    color: "#fde047",
  },
  {
    icon: Award,
    value: 24,
    suffix: "/7",
    label: "Security Support",
    desc: "Continuous threat monitoring, incident containment, and client advisory.",
    color: "#a78bfa",
  },
];

const WHAT_WE_DO = [
  {
    tag: "01 // DEFENSE",
    icon: ShieldCheck,
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
    title: "Cybersecurity Services",
    desc: "Penetration testing, network defense, and incident response for organizations across the Horn of Africa.",
    points: ["Vulnerability Audits", "Incident Containment", "Architecture Hardening"],
  },
  {
    tag: "02 // NEURAL",
    icon: BrainCircuit,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
    title: "AI Education",
    desc: "Teaching artificial intelligence and machine learning to East African youth — building the next generation of innovators.",
    points: ["Hands-On ML Labs", "Python & Data Science", "Real-World Projects"],
  },
  {
    tag: "03 // ACADEMY",
    icon: GraduationCap,
    color: "#fde047",
    bg: "rgba(253,224,71,0.12)",
    border: "rgba(253,224,71,0.3)",
    title: "Tech Courses",
    desc: "Hands-on courses in Linux, networking, ethical hacking, and coding — designed for real careers, not just certificates.",
    points: ["Practical Career Paths", "Direct Mentorship", "Verified Certifications"],
  },
  {
    tag: "04 // ACCESS",
    icon: BookOpen,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.3)",
    title: "Accessible Learning Resources",
    desc: "Books, videos, and community workshops — affordable for everyone, with 50% of seats free for students who need them most.",
    points: ["Free Open-Access Seats", "Somali & English Books", "Interactive Video Guides"],
  },
];

const AI_FEATURES = [
  {
    icon: Cpu,
    color: "#a78bfa",
    title: "Hands-On AI Labs",
    desc: "Students build and train real models — not just theory.",
    highlight: "PyTorch & Scikit-Learn",
  },
  {
    icon: Code2,
    color: "#7dd3fc",
    title: "Programming Foundations",
    desc: "Python, data science, and ML basics from the ground up.",
    highlight: "Production Code Standards",
  },
  {
    icon: Network,
    color: "#34d399",
    title: "Cyber + AI Integration",
    desc: "How AI is transforming security — and how to use it ethically.",
    highlight: "Autonomous Threat Hunting",
  },
  {
    icon: Rocket,
    color: "#fde047",
    title: "Career Pathways",
    desc: "Connecting graduates with internships and tech opportunities.",
    highlight: "Direct Job Placement",
  },
];

const SECURITY_FEATURES = [
  {
    icon: LockKeyhole,
    color: "#34d399",
    badge: "OFFENSIVE AUDIT",
    title: "Penetration Testing",
    desc: "Find and fix vulnerabilities before attackers do.",
  },
  {
    icon: Eye,
    color: "#7dd3fc",
    badge: "24/7 TELEMETRY",
    title: "Threat Detection",
    desc: "AI-powered monitoring that never sleeps.",
  },
  {
    icon: Search,
    color: "#f87171",
    badge: "RAPID SLA",
    title: "Incident Response",
    desc: "Rapid containment and recovery when it matters most.",
  },
  {
    icon: Network,
    color: "#fb923c",
    badge: "ZERO TRUST",
    title: "Network Defense",
    desc: "Hardening, audits, and resilient architecture.",
  },
];

const CERTIFICATIONS = [
  {
    title: "ISO 27001",
    subtitle: "Certified",
    desc: "Internationally recognized standard for information security management systems.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
  },
  {
    title: "CCNA",
    subtitle: "Cisco Certified",
    desc: "Expertise in networking, routing, and switching from Cisco Systems.",
    color: "#7dd3fc",
    bg: "rgba(125,211,252,0.12)",
    border: "rgba(125,211,252,0.3)",
  },
  {
    title: "OSCP",
    subtitle: "OffSec Certified Professional",
    desc: "Hands-on penetration testing certification from Offensive Security.",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.3)",
  },
  {
    title: "Security+",
    subtitle: "CompTIA Certified",
    desc: "Global benchmark for foundational cybersecurity knowledge and skills.",
    color: "#fde047",
    bg: "rgba(253,224,71,0.12)",
    border: "rgba(253,224,71,0.3)",
  },
];

/* -------------------------------------------------------------
   MAIN COMPONENT
   ------------------------------------------------------------- */
export default function Home() {
  const { t } = useLanguage();
  const h = t.home;
  const heroRef = useRef(null);

  // Smooth IntersectionObserver scroll reveal (runs once per element)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = document.querySelectorAll(".hp-reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hp-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
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
        <motion.div className="container hp-hero-inner" style={{ opacity: heroOpacity, y: heroY }}>
          {/* Left Column: Copy & Actions */}
          <motion.div
            className="hp-hero-copy"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="hp-badge">
              <span className="hp-badge-radar" />
              <span className="hp-badge-dot" />
              <span>50% Non-Profit Cybersecurity &amp; AI Education</span>
            </div>

            <h1 className="hp-hero-title">
              Securing Digital Futures.
              <br />
              <span className="hp-hero-accent">Empowering Youth with AI.</span>
            </h1>

            <p className="hp-hero-sub">{h.subtitle}</p>

            <div className="hp-hero-actions">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.38 }}
              >
                <Link className="hp-btn hp-btn-glowing" to="/softwares#download">
                  <Download size={18} strokeWidth={2.4} />
                  <span>Download Latest Version 2.6.87</span>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.48 }}
              >
                <Link className="hp-btn hp-btn-primary" to="/courses">
                  <GraduationCap size={18} strokeWidth={2.4} />
                  <span>{h.cta2}</span>
                  <ArrowRight size={16} className="hp-btn-arrow" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.58 }}
              >
                <Link className="hp-btn hp-btn-ghost" to="/services">
                  <ShieldCheck size={18} strokeWidth={2.2} />
                  <span>{h.cta1}</span>
                </Link>
              </motion.div>
            </div>

            <div className="hp-hero-meta-bar">
              <div className="hp-hero-meta-item">
                <Terminal size={14} color="#34d399" />
                <span>Trusted across Somaliland &amp; Ethiopia</span>
              </div>
              <div className="hp-hero-meta-divider" />
              <div className="hp-hero-meta-item">
                <Activity size={14} color="#7dd3fc" />
                <span>24/7 Security Operations</span>
              </div>
              <div className="hp-hero-meta-divider" />
              <div className="hp-hero-meta-item">
                <Radio size={14} color="#fde047" />
                <span>Zero-Day Threat Defense</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Holographic Cyber Command Deck */}
          <motion.div
            className="hp-hero-visual"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
          >
            <div className="hp-hero-ambient-glow" />

            {/* Central Interactive Console */}
            <CyberCommandDeck />

            {/* Floating 3D Holographic Badges (staggered depth) */}
            <div className="hp-floating-chip hp-chip-ai glass-card">
              <div
                className="hp-chip-icon"
                style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}
              >
                <BrainCircuit size={20} />
              </div>
              <div className="hp-chip-text">
                <strong>AI Defense Online</strong>
                <span>Threat Isolation Active</span>
              </div>
              <span className="hp-chip-pulse" style={{ background: "#a78bfa" }} />
            </div>

            <div className="hp-floating-chip hp-chip-shield glass-card">
              <div
                className="hp-chip-icon"
                style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}
              >
                <ShieldCheck size={20} />
              </div>
              <div className="hp-chip-text">
                <strong>System Protected</strong>
                <span>All Endpoints Secure</span>
              </div>
              <span className="hp-chip-pulse" style={{ background: "#34d399" }} />
            </div>
          </motion.div>
        </motion.div>

        {/* Cinematic Scroll Indicator */}
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

      {/* Section Divider */}
      <div className="hp-section-divider" aria-hidden="true" />

      {/* ===================== TRUSTED BY PARTNERS ===================== */}
      <section className="hp-trusted-section" aria-labelledby="trusted-by-title">
        <div className="hp-laser-line" />
        <div className="container">
          <motion.div
            className="hp-trusted-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">
              <Sparkles size={13} style={{ display: "inline", marginRight: 6 }} />
              Trusted &amp; Accredited
            </span>
            <h2 id="trusted-by-title">Organizations building a safer digital future</h2>
          </motion.div>
        </div>

        <div className="hp-trusted-marquee" aria-label="Organizations that trust FIKRADO Security">
          <div className="hp-trusted-track">
            {[0, 1, 2].map((set) => (
              <div className="hp-trusted-set" key={set} aria-hidden={set !== 0}>
                <div className="hp-trusted-logo glass-card">
                  <img
                    src={`${import.meta.env.BASE_URL}trusted-by/Ethiopian_Artificial_Intelligence_Institute.png`}
                    alt={set === 0 ? "Ethiopian Artificial Intelligence Institute" : ""}
                  />
                  <span>Ethiopian Artificial Intelligence Institute</span>
                </div>
                <div className="hp-trusted-logo glass-card">
                  <img
                    src={`${import.meta.env.BASE_URL}trusted-by/Stratosphere_Aeronautics.png`}
                    alt={set === 0 ? "Stratosphere Aeronautics" : ""}
                  />
                  <span>Stratosphere Aeronautics</span>
                </div>
                <div className="hp-trusted-logo glass-card">
                  <img
                    src={`${import.meta.env.BASE_URL}trusted-by/GIZ.jpeg`}
                    alt={set === 0 ? "GIZ" : ""}
                  />
                  <span>GIZ</span>
                </div>
                <div className="hp-trusted-logo glass-card">
                  <img
                    src={`${import.meta.env.BASE_URL}trusted-by/Ministry_of_Innovation_and_Technology_(Ethiopia).png`}
                    alt={set === 0 ? "Ethiopian Ministry of Innovation and Technology" : ""}
                  />
                  <span>Ethiopian Ministry of Innovation and Technology</span>
                </div>
                <div className="hp-trusted-logo glass-card">
                  <img
                    src={`${import.meta.env.BASE_URL}trusted-by/somalibookslogo.jpg`}
                    alt={set === 0 ? "Somali Books" : ""}
                  />
                  <span>Somali Books</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CEO FEATURE (FOUNDER DOSSIER) ===================== */}
      <div className="hp-section-divider" aria-hidden="true" />
      <section className="hp-ceo-section">
        <div className="container">
          <motion.div
            className="hp-ceo-card glass-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="hp-ceo-backdrop-bloom" />
            <div className="hp-ceo-cyber-corner hp-corner-tl" />
            <div className="hp-ceo-cyber-corner hp-corner-br" />

            <div className="hp-ceo-portrait-wrap">
              <div className="hp-ceo-orbit hp-ceo-orbit-one" />
              <div className="hp-ceo-orbit hp-ceo-orbit-two" />
              <div className="hp-ceo-orbit hp-ceo-radar-ring" />
              <div className="hp-ceo-portrait-glow" />
              <img
                className="hp-ceo-portrait"
                src={`${import.meta.env.BASE_URL}1763235012853.jpg`}
                alt="Mr Yahye Abdirahman Dahir, CEO of FIKRADO Security"
              />
              <div className="hp-ceo-verified-pill">
                <BadgeCheck size={14} color="#34d399" />
                <span>CHIEF SECURITY ARCHITECT</span>
              </div>
            </div>

            <div className="hp-ceo-copy">
              <span className="eyebrow">
                <ShieldCheck
                  size={14}
                  color="#fde047"
                  style={{ display: "inline", marginRight: 6 }}
                />
                Meet the CEO &amp; Founder
              </span>
              <h2>Mr. Yahye Abdirahman Dahir</h2>
              <p className="hp-ceo-lead">The #1 ethical hacker in East Africa</p>
              <p className="hp-ceo-bio">
                Mr. Yahye is the genius behind FIKRADO Security — a skilled ethical hacker with 15
                years of battle-tested security experience, industry certifications, and an
                unwavering mission to empower the next generation.
              </p>

              {/* Founder Credibility Matrix */}
              <div className="hp-ceo-metrics-grid">
                <div className="hp-ceo-metric-item">
                  <span className="hp-ceo-metric-val">15+</span>
                  <span className="hp-ceo-metric-lbl">Years Field Leadership</span>
                </div>
                <div className="hp-ceo-metric-item">
                  <span className="hp-ceo-metric-val">OSCP • CCNA • ISO</span>
                  <span className="hp-ceo-metric-lbl">Certified Credentials</span>
                </div>
                <div className="hp-ceo-metric-item">
                  <span className="hp-ceo-metric-val">500+</span>
                  <span className="hp-ceo-metric-lbl">Youth Empowered</span>
                </div>
              </div>

              <div className="hp-ceo-quote">
                &ldquo;Securing digital infrastructure isn&apos;t just technology — it&apos;s the
                foundation of freedom and innovation for our region.&rdquo;
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== CERTIFICATIONS (3D CRESTS) ===================== */}
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
              Accredited Credentials
            </span>
            <h2>
              <span className="grad-text">Internationally Certified &amp; Trusted</span>
            </h2>
            <p>
              Our team holds industry-leading certifications — ensuring the highest standard of
              security expertise for every client we serve.
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
              >
                <div
                  className="hp-cert-top-bar"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)`,
                  }}
                />
                <div
                  className="hp-cert-badge"
                  style={{ color: cert.color, background: cert.bg, borderColor: cert.border }}
                >
                  <BadgeCheck size={28} strokeWidth={2} />
                </div>
                <h3>{cert.title}</h3>
                <span className="hp-cert-subtitle" style={{ color: cert.color }}>
                  {cert.subtitle}
                </span>
                <p>{cert.desc}</p>
                <div className="hp-cert-verified" style={{ color: cert.color }}>
                  <ShieldCheck size={14} strokeWidth={2.4} />
                  <span>Officially Accredited</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS (3D METRIC PODS) ===================== */}
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
                <div
                  className="hp-stat-accent-bar"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                  }}
                />
                <div
                  className="hp-stat-icon-wrap"
                  style={{
                    color: s.color,
                    background: `${s.color}15`,
                    borderColor: `${s.color}35`,
                  }}
                >
                  <s.icon size={26} strokeWidth={2} />
                </div>
                <div className="hp-stat-value">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="hp-stat-label">{s.label}</div>
                <p className="hp-stat-desc">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHAT WE DO (3D ARCHITECTURAL GRID) ===================== */}
      <section className="hp-section">
        <div className="container">
          <motion.div
            className="hp-section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">
              <Layers size={13} style={{ display: "inline", marginRight: 6 }} />
              What We Do
            </span>
            <h2>
              <span className="grad-text">Two Missions, One Vision</span>
            </h2>
            <p>
              We protect organizations from digital threats while building a generation of skilled
              technologists through accessible, practical education.
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
                <div className="hp-feature-head">
                  <span
                    className="hp-feature-icon"
                    style={{ color: item.color, background: item.bg, borderColor: item.border }}
                  >
                    <item.icon size={26} strokeWidth={2} />
                  </span>
                  <span className="hp-feature-tag" style={{ color: item.color }}>
                    {item.tag}
                  </span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <div className="hp-feature-points">
                  {item.points.map((pt) => (
                    <div key={pt} className="hp-feature-pt">
                      <CheckCircle2 size={13} color={item.color} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AI EDUCATION (NEURAL SHOWCASE) ===================== */}
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
              <span className="eyebrow">
                <BrainCircuit size={13} style={{ display: "inline", marginRight: 6 }} />
                AI for East Africa
              </span>
              <h2>
                Teaching AI to the
                <br />
                <span className="grad-text">Next Generation</span>
              </h2>
              <p className="hp-ai-desc">
                We believe artificial intelligence shouldn&apos;t be locked behind paywalls or elite
                universities. That&apos;s why we&apos;re bringing hands-on AI education to youth
                across East Africa — completely free for those who need it.
              </p>
              <p className="hp-ai-desc">
                From Python programming to machine learning and AI-powered cybersecurity, our
                students don&apos;t just learn theory — they build real projects that solve real
                problems in their communities.
              </p>

              <div className="hp-ai-perks">
                <div className="hp-ai-perk">
                  <CheckCircle2 size={15} color="#34d399" />
                  <span>50% Free Community Seats</span>
                </div>
                <div className="hp-ai-perk">
                  <CheckCircle2 size={15} color="#7dd3fc" />
                  <span>Real Python &amp; ML Production Labs</span>
                </div>
                <div className="hp-ai-perk">
                  <CheckCircle2 size={15} color="#fde047" />
                  <span>Direct Industry Mentorship</span>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <Link className="hp-btn hp-btn-primary" to="/courses">
                  <span>Start Learning</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
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
                  <span
                    className="hp-ai-feature-icon"
                    style={{
                      color: f.color,
                      background: `${f.color}15`,
                      borderColor: `${f.color}35`,
                    }}
                  >
                    <f.icon size={22} strokeWidth={2} />
                  </span>
                  <div className="hp-ai-feature-body">
                    <div className="hp-ai-feature-top">
                      <strong>{f.title}</strong>
                      <span className="hp-ai-badge" style={{ color: f.color }}>
                        {f.highlight}
                      </span>
                    </div>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CYBERSECURITY PREVIEW (3D DEFENSE MATRIX) ===================== */}
      <section className="hp-section">
        <div className="container">
          <motion.div
            className="hp-section-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">
              <ShieldCheck size={13} style={{ display: "inline", marginRight: 6 }} />
              Cybersecurity Solutions
            </span>
            <h2>
              <span className="grad-text">Professional Security Services</span>
            </h2>
            <p>
              High-quality security solutions for individuals, businesses, and institutions — backed
              by certified experts and AI-powered tools.
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
                <div className="hp-security-head">
                  <span
                    className="hp-security-icon"
                    style={{
                      color: f.color,
                      background: `${f.color}15`,
                      borderColor: `${f.color}35`,
                    }}
                  >
                    <f.icon size={24} strokeWidth={2} />
                  </span>
                  <span
                    className="hp-sec-pill"
                    style={{ color: f.color, borderColor: `${f.color}40` }}
                  >
                    {f.badge}
                  </span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="hp-section-cta">
            <Link className="hp-btn hp-btn-ghost" to="/services">
              <span>View All Services</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CALL TO ACTION (3D COMMAND PORTAL) ===================== */}
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
            <div className="hp-cta-ring-bg" />
            <h2>{h.ctaTitle}</h2>
            <p>{h.ctaDesc}</p>
            <div className="hp-cta-actions">
              <Link className="hp-btn hp-btn-primary" to="/contact">
                <Rocket size={18} strokeWidth={2.4} />
                <span>{h.ctaBtn}</span>
              </Link>
              <Link className="hp-btn hp-btn-ghost" to="/books">
                <BookOpen size={18} strokeWidth={2.2} />
                <span>{h.booksMore}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
