import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";

const BOOK_COVERS = [
  {
    image: "Isbar_Hacking_Macalin_La’aan.jpg",
    title: "Isbar Hacking Macalin La’aan",
    tag: "Cybersecurity",
    desc: "A practical introduction to ethical hacking and responsible digital defense.",
    glow: "#2575d8",
    accent: "#e879c7",
  },
  {
    image: "Isbar_Linux_Macalin_La’aan.png",
    title: "Isbar Linux Macalin La’aan",
    tag: "Linux",
    desc: "Learn Linux fundamentals through accessible, hands-on computer lessons.",
    glow: "#19cce4",
    accent: "#f6b51b",
  },
  {
    image: "Isbar_AI_Macalin_La’aan_2.png",
    title: "Isbar AI Macalin La’aan 2",
    tag: "Artificial Intelligence",
    desc: "Explore artificial intelligence and discover how technology is shaping tomorrow.",
    glow: "#159dd8",
    accent: "#ff8b22",
  },
  {
    image: "Isbar_Computer_Macalin_La’aan.png",
    title: "Isbar Computer Macalin La’aan",
    tag: "Computer Skills",
    desc: "Build essential computer knowledge with clear lessons for every learner.",
    glow: "#ff0f83",
    accent: "#f8e52b",
  },
  {
    image: "Isbar_Programming_Macalin_La’aan.png",
    title: "Isbar Programming Macalin La’aan",
    tag: "Programming",
    desc: "Start your programming journey and turn ideas into useful digital projects.",
    glow: "#27eb72",
    accent: "#b6ffca",
  },
];

export default function Books() {
  const { t } = useLanguage();
  const b = t.books;

  return (
    <>
      <PageHero
        eyebrow={b.eyebrow}
        title={b.title}
        subtitle="Practical technology books written by Yahye Abdirahman for curious learners across the Horn of Africa."
      />

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="books-grid">
            {BOOK_COVERS.map((book, i) => (
              <motion.article
                className="book book-cover-card glass-card"
                key={book.image}
                style={{ "--book-glow": book.glow, "--book-accent": book.accent }}
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              >
                <div className="book-cover-wrap">
                  <img
                    src={`${import.meta.env.BASE_URL}${book.image}`}
                    alt={`${book.title} by Yahye Abdirahman`}
                    className="book-cover"
                    loading="lazy"
                  />
                  <div className="book-cover-shine" />
                </div>
                <div className="book-content">
                  <span className="book-tag">{book.tag}</span>
                  <h3>{book.title}</h3>
                  <p>{book.desc}</p>
                  <div className="book-author">
                    <BookOpen size={14} />
                    Written by Yahye Abdirahman
                  </div>
                  <div className="book-price">
                    <span className="book-price-amount">$7</span>
                    <span className="book-price-format">PDF Download</span>
                  </div>
                  <Link className="book-order-btn" to="/contact">
                    <ShoppingCart size={16} />
                    Order Now
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
