import { motion } from "framer-motion";
import {
  Terminal,
  Monitor,
  ShieldAlert,
  SearchCheck,
  BrainCircuit,
  Download,
  ArrowRight,
  Check,
  PlusCircle,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Link } from "../compat/react-router-dom.jsx";
import PageHero from "../components/PageHero.jsx";

// Platform SVG Icons
function WindowsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.951-1.801" />
    </svg>
  );
}

function AppleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.67 1.38-.56.65-1.06 1.7-0.93 2.74 1.04.08 2.06-.52 2.68-1.25" />
    </svg>
  );
}

function LinuxIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {/* body (egg) */}
      <ellipse cx="12" cy="13.5" rx="8" ry="6.8" />
      {/* head */}
      <ellipse cx="12" cy="6.6" rx="4.6" ry="4.2" />
      {/* crest (tuft on top of head) */}
      <path d="M10.3 2.7 L13.5 2.7 L12 0.9 Z" />
      {/* beak */}
      <path d="M11.1 8.9 L13.8 10.5 L10.2 10.5 Z" />
      {/* eyes */}
      <circle cx="10.9" cy="6.3" r="0.42" />
      <circle cx="13.2" cy="6.3" r="0.42" />
      {/* feet */}
      <ellipse cx="7.6" cy="19.4" rx="2.1" ry="1.2" />
      <ellipse cx="16.4" cy="19.4" rx="2.1" ry="1.2" />
    </svg>
  );
}

export default function Softwares() {
  return (
    <>
      {/* ===================== HERO SECTION ===================== */}
      <section className="page-hero" id="softwares-hero">
        <div className="container">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={13} style={{ display: "inline", marginRight: 6 }} />
            Enterprise Defense Software
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="grad-text">Fikrado Security Enterprise</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ maxWidth: 720, margin: "0 auto 32px" }}
          >
            AI-powered security software that detects malware and checks systems for
            vulnerabilities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {/* Same glowing download button matching home page */}
            <a href="#download" className="hp-btn hp-btn-glowing">
              <Download size={18} strokeWidth={2.4} />
              <span>Download Latest Version 2.6.87</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===================== PRODUCT CARDS (CLI & DESKTOP) ===================== */}
      <section className="section" id="download" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Available Editions</span>
            <h2>
              <span className="grad-text">Built for Terminal and Desktop</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 640, margin: "12px auto 0" }}>
              Choose the version that fits your workflow. Both editions include our unified
              AI-driven malware detection and vulnerability scanning engine.
            </p>
          </div>

          <div className="software-products-grid" id="download-cards">
            {/* 1. CLI Edition */}
            <motion.div
              className="software-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="software-card-badge">CLI EDITION</div>
              <div
                className="software-icon-wrap"
                style={{ color: "#34d399", background: "rgba(52, 211, 153, 0.12)" }}
              >
                <Terminal size={32} strokeWidth={2} />
              </div>
              <h3>CLI Version</h3>
              <p className="software-desc">
                High-performance command-line security tool built with Node.js. Ideal for
                developers, sysadmins, and automated CI/CD security pipelines.
              </p>

              <div className="software-meta-group">
                <div className="software-meta-row">
                  <span className="meta-label">Runtime:</span>
                  <span className="meta-value">Built with Node.js</span>
                </div>
                <div className="software-meta-row">
                  <span className="meta-label">Supported Platforms:</span>
                  <div className="software-platforms-icons">
                    <span className="platform-tag" title="Windows">
                      <WindowsIcon size={15} /> Windows
                    </span>
                    <span className="platform-tag" title="Linux">
                      <LinuxIcon size={15} /> Linux
                    </span>
                    <span className="platform-tag" title="macOS">
                      <AppleIcon size={15} /> macOS
                    </span>
                  </div>
                </div>
              </div>

              {/* TODO: Connect direct binary download URL when release v2.6.87 is published on GitHub Releases */}
              <a
                href="#pricing"
                className="hp-btn hp-btn-primary software-download-btn"
                id="download-cli"
              >
                <Download size={18} strokeWidth={2.4} />
                <span>Download CLI (v2.6.87)</span>
              </a>
              <small className="software-install-hint">Requires Node.js runtime environment</small>
            </motion.div>

            {/* 2. Desktop App Edition */}
            <motion.div
              className="software-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div
                className="software-card-badge"
                style={{ borderColor: "rgba(125, 211, 252, 0.3)", color: "#7dd3fc" }}
              >
                DESKTOP APP
              </div>
              <div
                className="software-icon-wrap"
                style={{ color: "#7dd3fc", background: "rgba(125, 211, 252, 0.12)" }}
              >
                <Monitor size={32} strokeWidth={2} />
              </div>
              <h3>Desktop App</h3>
              <p className="software-desc">
                              Comprehensive graphical application with an interactive dashboard, live system
                              vulnerability scans, and real-time malware alerts.
                            </p>

                            <div className="software-screenshot">
                              <img src="/screenshot-desktop-app.png" alt="Fikrado Security Enterprise desktop app" />
                            </div>

                            <div className="software-meta-group">
                <div className="software-meta-row">
                  <span className="meta-label">Architecture:</span>
                  <span className="meta-value">Native Desktop GUI</span>
                </div>
                <div className="software-meta-row">
                  <span className="meta-label">Supported Platforms:</span>
                  <div className="software-platforms-icons">
                    <span className="platform-tag" title="Windows">
                      <WindowsIcon size={15} /> Windows
                    </span>
                    <span className="platform-tag" title="Linux">
                      <LinuxIcon size={15} /> Linux
                    </span>
                    <span className="platform-tag" title="macOS">
                      <AppleIcon size={15} /> macOS
                    </span>
                  </div>
                </div>
              </div>

              {/* TODO: Connect direct binary download URL when release v2.6.87 is published on GitHub Releases */}
              <a
                href="#pricing"
                className="hp-btn hp-btn-primary software-download-btn"
                id="download-desktop"
              >
                <Download size={18} strokeWidth={2.4} />
                <span>Download Desktop App (v2.6.87)</span>
              </a>
              <small className="software-install-hint">
                Compatible with Windows, Linux and macOS
              </small>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== WHAT IT DOES ===================== */}
      <section className="section" id="capabilities" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Core Capabilities</span>
            <h2>
              <span className="grad-text">What It Does</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 600, margin: "12px auto 0" }}>
              Engineered to safeguard modern infrastructure with automated intelligence.
            </p>
          </div>

          <div className="software-features-grid">
            {/* 1. Malware Detection */}
            <motion.div
              className="software-feature-card glass-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="feature-icon-box"
                style={{ color: "#f87171", background: "rgba(248, 113, 113, 0.12)" }}
              >
                <ShieldAlert size={28} strokeWidth={2.2} />
              </div>
              <h3>Malware Detection</h3>
              <p>
                Continuously monitors files and processes to detect and isolate malicious software,
                trojans, ransomware, and unauthorized intrusions across endpoints.
              </p>
            </motion.div>

            {/* 2. System Vulnerability Scanning */}
            <motion.div
              className="software-feature-card glass-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="feature-icon-box"
                style={{ color: "#fde047", background: "rgba(253, 224, 71, 0.12)" }}
              >
                <SearchCheck size={28} strokeWidth={2.2} />
              </div>
              <h3>System Vulnerability Scanning</h3>
              <p>
                Performs deep, rigorous scans of your operating systems, open network services, and
                misconfigurations to identify weak points before attackers exploit them.
              </p>
            </motion.div>

            {/* 3. AI-Driven Analysis */}
            <motion.div
              className="software-feature-card glass-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div
                className="feature-icon-box"
                style={{ color: "#a78bfa", background: "rgba(167, 139, 250, 0.12)" }}
              >
                <BrainCircuit size={28} strokeWidth={2.2} />
              </div>
              <h3>AI-Driven Analysis</h3>
              <p>
                Leverages machine intelligence to evaluate behavioral telemetry in real time,
                detecting anomalous patterns and zero-day threat vectors with high accuracy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING SECTION ===================== */}
      <section className="section" id="pricing" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Transparent Pricing</span>
            <h2>
              <span className="grad-text">License Plans</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 600, margin: "12px auto 0" }}>
              Predictable pricing for individuals, security teams, and full enterprises.
            </p>
          </div>

          <div className="software-pricing-grid">
            {/* Single License */}
            <motion.div
              className="pricing-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="pricing-header">
                <h3>Single</h3>
                <p className="pricing-tagline">
                  For individual security professionals and single systems
                </p>
              </div>
              <div className="pricing-price-wrap">
                <span className="pricing-currency">$</span>
                <span className="pricing-amount">20</span>
                <span className="pricing-period">/ month</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={16} color="#34d399" />
                  <span>Full access to CLI &amp; Desktop App</span>
                </li>
                <li>
                  <Check size={16} color="#34d399" />
                  <span>Real-time malware detection</span>
                </li>
                <li>
                  <Check size={16} color="#34d399" />
                  <span>System vulnerability scanning</span>
                </li>
                <li>
                  <Check size={16} color="#34d399" />
                  <span>AI-driven analysis updates</span>
                </li>
              </ul>
              <Link to="/contact" className="hp-btn hp-btn-ghost pricing-btn">
                <span>Get Single License</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Enterprise License */}
            <motion.div
              className="pricing-card glass-card pricing-featured"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="pricing-popular-pill">RECOMMENDED FOR TEAMS</div>
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <p className="pricing-tagline">
                  Complete organizational coverage &amp; dedicated support
                </p>
              </div>
              <div className="pricing-price-wrap">
                <span className="pricing-currency">$</span>
                <span className="pricing-amount">4,000</span>
                <span className="pricing-period">/ year</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={16} color="#34d399" />
                  <span>Complete organization-wide deployment</span>
                </li>
                <li>
                  <Check size={16} color="#34d399" />
                  <span>CLI &amp; Desktop App editions</span>
                </li>
                <li>
                  <Check size={16} color="#34d399" />
                  <strong>24/7 dedicated support included</strong>
                </li>
                <li>
                  <Check size={16} color="#34d399" />
                  <strong>Quarterly system maintenance included</strong>
                </li>
                <li>
                  <Check size={16} color="#34d399" />
                  <span>Continuous malware &amp; vulnerability updates</span>
                </li>
              </ul>
              <Link to="/contact" className="hp-btn hp-btn-primary pricing-btn">
                <span>Deploy Enterprise</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Extra Support Add-on */}
            <motion.div
              className="pricing-card glass-card pricing-addon"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="pricing-header">
                <div className="addon-badge">
                  <PlusCircle size={14} color="#7dd3fc" />
                  <span>ADD-ON OPTION</span>
                </div>
                <h3>Extra Support</h3>
                <p className="pricing-tagline">
                  On-demand expert security advisory &amp; incident sessions
                </p>
              </div>
              <div className="pricing-price-wrap">
                <span className="pricing-currency">$</span>
                <span className="pricing-amount">90</span>
                <span className="pricing-period">/ session</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={16} color="#7dd3fc" />
                  <span>One-time support session</span>
                </li>
                <li>
                  <Check size={16} color="#7dd3fc" />
                  <span>Direct consultation with security engineers</span>
                </li>
                <li>
                  <Check size={16} color="#7dd3fc" />
                  <span>Configuration review &amp; troubleshooting</span>
                </li>
                <li>
                  <Check size={16} color="#7dd3fc" />
                  <span>Available for Single license holders</span>
                </li>
              </ul>
              <Link to="/contact" className="hp-btn hp-btn-ghost pricing-btn">
                <span>Request Support Session</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== CONTACT / BUY CALL TO ACTION ===================== */}
      <section className="section" id="contact-cta" style={{ paddingTop: 20, paddingBottom: 80 }}>
        <div className="container">
          <motion.div
            className="cta-band glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="eyebrow">Get Started Today</span>
            <h2>
              Ready to secure your systems with{" "}
              <span className="grad-text">Fikrado Security Enterprise</span>?
            </h2>
            <p style={{ maxWidth: 640, margin: "16px auto 28px" }}>
              Contact our sales and technical support teams directly to purchase licenses, request
              enterprise onboarding, or schedule a custom walkthrough.
            </p>

            <div className="software-contact-channels">
              <a className="software-contact-chip" href="mailto:fikrado1@gmail.com">
                <Mail size={16} color="#fb923c" />
                <span>fikrado1@gmail.com</span>
              </a>
              <a className="software-contact-chip" href="tel:+252634048063">
                <Phone size={16} color="#34d399" />
                <span>+252 63 4048063 (SO)</span>
              </a>
              <a className="software-contact-chip" href="tel:+251984858498">
                <Phone size={16} color="#7dd3fc" />
                <span>+251 984858498 (ET)</span>
              </a>
              <a
                className="software-contact-chip"
                href="https://wa.me/252634048063?text=Hello%20FIKRADO%20Security%2C%20I%27d%20like%20to%20purchase%20Fikrado%20Security%20Enterprise."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} color="#34d399" />
                <span>WhatsApp Instant Inquiry</span>
              </a>
            </div>

            <div
              style={{
                marginTop: 28,
                display: "flex",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <Link className="hp-btn hp-btn-primary" to="/contact">
                <span>Contact Us to Order</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
