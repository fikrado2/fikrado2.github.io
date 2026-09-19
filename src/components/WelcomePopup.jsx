import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Sparkles } from "lucide-react";

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
            transition={{ duration: 0.4 }}
            onClick={close}
          />
          <motion.div
            className="welcome-modal"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <button className="welcome-close" onClick={close} aria-label="Close">
              <X size={20} />
            </button>

            <div className="welcome-icon-wrap">
              <div className="welcome-icon-glow" />
              <Sparkles size={40} className="welcome-icon" strokeWidth={1.8} />
            </div>

            <h2 className="welcome-title">
              Build Your Website with <span className="grad-text">Modern Technology</span>
            </h2>
            <p className="welcome-desc">
              We create stunning, high-performance websites using the latest tools and
              technologies. Ready to bring your vision online?
            </p>

            <a
              className="welcome-whatsapp-btn"
              href="https://wa.me/252634048063?text=Hello%20FIKRADO%20Security%2C%20I%27d%20like%20to%20build%20a%20website."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={20} strokeWidth={2.2} />
              Chat on WhatsApp
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
