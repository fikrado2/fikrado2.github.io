import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Rocket, ArrowRight } from "lucide-react";

const STORAGE_KEY = "fikrado-welcome-seen";

export default function WelcomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem(STORAGE_KEY, "1");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="welcome-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={close}
          />
          <motion.div
            className="welcome-modal"
            initial={{ opacity: 0, scale: 0.88, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -16 }}
            transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
          >
            <div className="welcome-grid-bg" />
            <div className="welcome-glow-top" />

            <button className="welcome-close" onClick={close} aria-label="Close">
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="welcome-badge">
              <Rocket size={13} strokeWidth={2.4} />
              <span>FIKRADO Security</span>
            </div>

            <div className="welcome-icon-wrap">
              <div className="welcome-icon-ring" />
              <div className="welcome-icon-glow" />
              <Rocket size={32} className="welcome-icon" strokeWidth={1.8} />
            </div>

            <h2 className="welcome-title">
              Build Your Website with
              <br />
              <span className="grad-text">Modern Technology</span>
            </h2>

            <p className="welcome-desc">
              We design, build, and deploy stunning high-performance websites
              using the latest tools — complete with professional email and
              domain setup.
            </p>

            <div className="welcome-features">
              <span className="welcome-feature">
                <span className="welcome-feature-dot" /> Responsive Design
              </span>
              <span className="welcome-feature">
                <span className="welcome-feature-dot" /> Secure Hosting
              </span>
              <span className="welcome-feature">
                <span className="welcome-feature-dot" /> Email & Domain
              </span>
            </div>

            <a
              className="welcome-whatsapp-btn"
              href="https://wa.me/252634048063?text=Hello%20FIKRADO%20Security%2C%20I%27d%20like%20to%20build%20a%20website."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} strokeWidth={2.2} />
              Chat on WhatsApp
              <ArrowRight size={16} strokeWidth={2.4} className="welcome-btn-arrow" />
            </a>

            <button className="welcome-skip" onClick={close}>
              Maybe later
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
