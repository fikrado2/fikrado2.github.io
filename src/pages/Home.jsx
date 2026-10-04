import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Clock3, Grid2X2, Move3d, Plus, X } from "lucide-react";
import anime from "../lib/anime.es.js";

const PROJECTS = [
  {
    title: "Hubtown",
    description: "A digital world for culture, commerce, and the people shaping tomorrow.",
    category: "Digital",
    bg_color: "#121212",
    image: `${import.meta.env.BASE_URL}headquarters.png`,
    video: "",
    link: "/about",
    x: -29,
    y: -20,
    z: 20,
  },
  {
    title: "OceanX",
    description: "An immersive identity for a new generation of ocean discovery.",
    category: "Digital",
    bg_color: "#000b33",
    image: `${import.meta.env.BASE_URL}Isbar_AI_Macalin_La’aan_2.png`,
    video: "",
    link: "/services",
    x: 22,
    y: -11,
    z: 80,
  },
  {
    title: "RobCo",
    description: "Motion, machine intelligence, and a sharper way to see what is next.",
    category: "Motion",
    bg_color: "#18181b",
    image: `${import.meta.env.BASE_URL}Isbar_Computer_Macalin_La’aan.png`,
    video: "",
    link: "/videos",
    x: -8,
    y: 21,
    z: 145,
  },
  {
    title: "Crosswire",
    description: "A living visual system built for brands that refuse to stay still.",
    category: "Branding & WebGL",
    bg_color: "#2d0036",
    image: `${import.meta.env.BASE_URL}Isbar_Hacking_Macalin_La’aan.jpg`,
    video: "",
    link: "/courses",
    x: 33,
    y: 18,
    z: 60,
  },
  {
    title: "KIKK Festival",
    description: "A bright, elastic identity for ideas in motion.",
    category: "Branding",
    bg_color: "#ffffff",
    image: `${import.meta.env.BASE_URL}Isbar_Programming_Macalin_La’aan.png`,
    video: "",
    link: "/books",
    x: -35,
    y: 13,
    z: 105,
  },
];

const FILTERS = ["All", "Digital", "Motion", "Branding"];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("spatial");
  const [clock, setClock] = useState(() => formatTime(new Date()));
  const [activeProject, setActiveProject] = useState(null);
  const pageRef = useRef(null);
  const galleryRef = useRef(null);
  const cardRefs = useRef([]);
  const cursorRef = useRef(null);
  const cursorTextRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatTime(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!page || !cards.length) return;

    anime.set(cards, { opacity: 0, translateY: 28, scale: 0.94 });
    const intro = anime.timeline({ easing: "easeOutExpo" });
    intro.add({
      targets: cards,
      opacity: 1,
      translateY: 0,
      scale: 1,
      delay: anime.stagger(120),
      duration: 1100,
    });
    intro.add({
      targets: page.querySelectorAll(".unseen-reveal"),
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(80),
      duration: 900,
    }, "-=900");

    return () => intro.pause();
  }, []);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const matching = cards.filter((_, index) => {
      const category = PROJECTS[index].category;
      return filter === "All" || category === filter || (filter === "Branding" && category.includes("Branding"));
    });
    const hidden = cards.filter((card) => !matching.includes(card));

    anime({
      targets: hidden,
      opacity: 0,
      scale: 0.72,
      translateY: 24,
      duration: 360,
      delay: anime.stagger(35),
      easing: "easeInQuad",
      complete: () => hidden.forEach((card) => { card.style.pointerEvents = "none"; }),
    });
    anime({
      targets: matching,
      opacity: 1,
      scale: 1,
      translateY: 0,
      duration: 750,
      delay: anime.stagger(90),
      easing: "spring(1, 80, 10, 0)",
      begin: () => matching.forEach((card) => { card.style.pointerEvents = "auto"; }),
    });
  }, [filter]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const isGrid = viewMode === "grid";
    anime({
      targets: cards,
      translateX: isGrid ? 0 : (card, index) => `${PROJECTS[index].x}vw`,
      translateY: isGrid ? 0 : (card, index) => `${PROJECTS[index].y}vh`,
      translateZ: isGrid ? 0 : (card, index) => PROJECTS[index].z,
      rotateY: isGrid ? 0 : (card, index) => PROJECTS[index].x * -0.18,
      rotateX: isGrid ? 0 : (card, index) => PROJECTS[index].y * 0.12,
      scale: isGrid ? 1 : 0.9,
      duration: 1000,
      delay: anime.stagger(80),
      easing: "spring(1, 80, 10, 0)",
    });
  }, [viewMode]);

  useEffect(() => {
    const page = pageRef.current;
    const gallery = galleryRef.current;
    if (!page || !gallery) return;

    const onMove = (event) => {
      const bounds = gallery.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      anime({
        targets: cardRefs.current.filter(Boolean),
        translateX: viewMode === "grid" ? 0 : (card, index) => `${PROJECTS[index].x + x * 4}vw`,
        translateY: viewMode === "grid" ? 0 : (card, index) => `${PROJECTS[index].y + y * 4}vh`,
        duration: 800,
        easing: "easeOutQuad",
      });
      anime({ targets: cursorRef.current, left: event.clientX, top: event.clientY, duration: 500, easing: "easeOutQuad" });
    };

    const onLeave = () => anime({ targets: cursorRef.current, opacity: 0, scale: 0.5, duration: 220 });
    const onEnter = () => anime({ targets: cursorRef.current, opacity: 1, scale: 1, duration: 220 });
    gallery.addEventListener("mousemove", onMove);
    gallery.addEventListener("mouseenter", onEnter);
    gallery.addEventListener("mouseleave", onLeave);
    return () => {
      gallery.removeEventListener("mousemove", onMove);
      gallery.removeEventListener("mouseenter", onEnter);
      gallery.removeEventListener("mouseleave", onLeave);
    };
  }, [viewMode]);

  const hoverCard = (project) => {
    setActiveProject(project);
    pageRef.current?.style.setProperty("--unseen-bg", project.bg_color);
    anime({ targets: cursorRef.current, scale: 2.8, duration: 500, easing: "easeOutElastic(1, .65)" });
    anime({ targets: cursorTextRef.current, opacity: 1, duration: 180 });
  };

  const leaveCard = () => {
    setActiveProject(null);
    pageRef.current?.style.setProperty("--unseen-bg", "#080808");
    anime({ targets: cursorRef.current, scale: 1, duration: 350, easing: "easeOutQuad" });
    anime({ targets: cursorTextRef.current, opacity: 0, duration: 120 });
  };

  return (
    <main className="unseen-page" ref={pageRef}>
      <div className="unseen-noise" />
      <div className="unseen-cursor" ref={cursorRef} aria-hidden="true"><span ref={cursorTextRef}>VIEW</span></div>
      <header className="unseen-header unseen-reveal">
        <a href="#/" className="unseen-brand">Unseen Studio<span>®</span></a>
        <div className="unseen-clock"><Clock3 size={14} /> {clock} <i /></div>
        <div className="unseen-controls">
          <nav className="unseen-filters" aria-label="Project categories">
            {FILTERS.map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
          </nav>
          <div className="unseen-view-toggle" aria-label="View mode">
            <button className={viewMode === "spatial" ? "is-active" : ""} onClick={() => setViewMode("spatial")}><Move3d size={14} /> Spatial 3D</button>
            <button className={viewMode === "grid" ? "is-active" : ""} onClick={() => setViewMode("grid")}><Grid2X2 size={14} /> 2D Grid</button>
          </div>
        </div>
      </header>

      <section className={`unseen-gallery ${viewMode === "grid" ? "is-grid" : ""}`} ref={galleryRef}>
        <div className="unseen-intro unseen-reveal">
          <p className="unseen-kicker">Independent creative practice / 2026</p>
          <h1>Ideas you can<br /><em>step inside.</em></h1>
          <p className="unseen-summary">We make digital worlds, identities, and experiences for people building the next version of culture.</p>
        </div>
        {PROJECTS.map((project, index) => (
          <a
            className={`unseen-project ${filter !== "All" && project.category !== filter && !(filter === "Branding" && project.category.includes("Branding")) ? "is-filtered" : ""}`}
            href={project.link}
            key={project.title}
            ref={(element) => { cardRefs.current[index] = element; }}
            onMouseEnter={() => hoverCard(project)}
            onMouseLeave={leaveCard}
            style={{ "--project-accent": project.bg_color, "--project-x": `${project.x}vw`, "--project-y": `${project.y}vh`, "--project-z": `${project.z}px` }}
          >
            <div className="unseen-project-image"><img src={project.image} alt={project.title} /></div>
            <div className="unseen-project-meta"><span>{project.category}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <span className="unseen-project-arrow"><ArrowUpRight size={17} /></span>
          </a>
        ))}
        <div className="unseen-orbit unseen-orbit-one" />
        <div className="unseen-orbit unseen-orbit-two" />
      </section>

      <footer className="unseen-footer unseen-reveal">
        <span>East Africa / Worldwide</span>
        <span>{activeProject ? `Selected — ${activeProject.title}` : "Move through the work"}</span>
        <span><Plus size={14} /> Scroll to explore</span>
      </footer>
      <button className="unseen-close" aria-label="Close preview" onClick={leaveCard}><X size={16} /></button>
    </main>
  );
}
