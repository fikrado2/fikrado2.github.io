import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import PageHero from "../components/PageHero.jsx";

const YOUTUBE_VIDEOS = [
  { id: "JNIudfkfPvk", title: "Cybersecurity Fundamentals" },
  { id: "Ea7Pu9KCoS4", title: "Security Awareness Training" },
  { id: "ljWNdEwQe4s", title: "Linux & Networking Basics" },
  { id: "l10Uzd5OJO8", title: "Ethical Hacking Techniques" },
  { id: "A4v3WBPApfQ", title: "Web Application Security" },
  { id: "pPO6CIlN0Ts", title: "Phishing & Social Engineering Defense" },
];

const CHANNEL_LINKS = [
  { label: "Visit Channel", url: "https://www.youtube.com/@fikrad0" },
  { label: "All Videos", url: "https://www.youtube.com/@fikrad0/videos" },
  { label: "Featured", url: "https://www.youtube.com/@fikrad0/featured" },
  { label: "Community", url: "https://www.youtube.com/@fikrad0/community" },
];

export default function Videos() {
  return (
    <>
      <PageHero
        eyebrow="Watch & Learn"
        title="Video Library"
        subtitle="Free tutorials, talks, and live sessions from our security team."
      />

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="videos-embed-grid">
            {YOUTUBE_VIDEOS.map((vid, i) => (
              <motion.div
                className="video-embed-card glass-card"
                key={vid.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              >
                <div className="video-embed-wrap">
                  <iframe
                    src={`https://www.youtube.com/embed/${vid.id}`}
                    title={vid.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="video-embed-body">
                  <Play size={16} color="#f87171" />
                  <h3>{vid.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="cta-band glass-card hp-cta"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="hp-cta-glow" />
            <h2>Subscribe to our channel</h2>
            <p>
              New tutorials every week. Join our community of learners across the Horn of Africa.
            </p>
            <div className="hp-cta-actions">
              {CHANNEL_LINKS.map((link) => (
                <a
                  key={link.url}
                  className="hp-btn hp-btn-ghost"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={18} color="#f87171" />
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
