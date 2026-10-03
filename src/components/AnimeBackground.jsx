import { useEffect, useRef } from "react";
import anime from "../lib/anime.es.js";

/**
 * AnimeBackground — an anime.js-driven canvas artwork for the home page.
 *
 * Layered composition:
 *  1. Flowing gradient orbs that drift and morph (anime.js shape tween)
 *  2. A particle constellation field with mouse-reactive connection lines
 *  3. Occasional "energy pulses" that ripple outward
 *
 * Everything is drawn on a single <canvas> sized to its container.
 * No external images; purely procedural and GPU-light.
 */
export default function AnimeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = 0,
      H = 0,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouseX = -9999,
      mouseY = -9999;
    let rafId = null;
    let pulses = [];
    let orbs = [];
    let particles = [];
    let orbAnim = null;
    let pulseTimer = null;

    /* ---------- sizing ---------- */
    function resize() {
      const parent = canvas.parentElement;
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ---------- orbs: large drifting gradient blobs ---------- */
    const ORB_COLORS = [
      { r: 253, g: 224, b: 71 }, // gold
      { r: 52, g: 211, b: 153 }, // emerald
      { r: 125, g: 211, b: 252 }, // sky
      { r: 167, g: 139, b: 250 }, // violet (used sparingly)
    ];

    function makeOrbs() {
      orbs = Array.from({ length: 4 }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        baseR: 180 + Math.random() * 160,
        r: 180 + Math.random() * 160,
        color: ORB_COLORS[i % ORB_COLORS.length],
        opacity: 0.12 + Math.random() * 0.08,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    /* ---------- particles: constellation field ---------- */
    function makeParticles() {
      const count = Math.min(90, Math.floor((W * H) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        baseSize: 1 + Math.random() * 2.2,
        size: 1 + Math.random() * 2.2,
        opacity: 0.25 + Math.random() * 0.5,
        twinkle: Math.random() * Math.PI * 2,
      }));
    }

    /* ---------- anime.js: orb breathing + particle twinkle ---------- */
    function startAnimeLoops() {
      if (orbAnim) orbAnim.pause();

      // Breathing — orbs grow/shrink in a gentle loop
      orbAnim = anime({
        targets: orbs,
        r: (o) => o.baseR * (0.7 + Math.random() * 0.6),
        opacity: () => 0.08 + Math.random() * 0.12,
        duration: () => 4000 + Math.random() * 3000,
        delay: anime.stagger(800),
        easing: "easeInOutSine",
        direction: "alternate",
        loop: true,
      });

      // Twinkle — particles pulse in size
      anime({
        targets: particles,
        size: (p) => p.baseSize * (0.5 + Math.random() * 1.8),
        opacity: () => 0.15 + Math.random() * 0.6,
        duration: () => 1500 + Math.random() * 2500,
        delay: anime.stagger(40),
        easing: "easeInOutSine",
        direction: "alternate",
        loop: true,
      });
    }

    /* ---------- energy pulses ---------- */
    function spawnPulse() {
      pulses.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0,
        maxR: 200 + Math.random() * 250,
        opacity: 0.25,
        color: ORB_COLORS[Math.floor(Math.random() * 3)],
      });
    }

    function schedulePulses() {
      pulseTimer = setInterval(() => {
        if (pulses.length < 3) spawnPulse();
      }, 3500);
    }

    /* ---------- draw helpers ---------- */
    function drawOrb(o) {
      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      const c = o.color;
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${o.opacity})`);
      grad.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},${o.opacity * 0.4})`);
      grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPulse(p) {
      const grad = ctx.createRadialGradient(p.x, p.y, p.r * 0.85, p.x, p.y, p.r);
      const c = p.color;
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0)`);
      grad.addColorStop(0.7, `rgba(${c.r},${c.g},${c.b},${p.opacity * 0.5})`);
      grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // Ring stroke
      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${p.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawParticle(p, i) {
      // Glow halo
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      glow.addColorStop(0, `rgba(253,224,71,${p.opacity * 0.6})`);
      glow.addColorStop(1, "rgba(253,224,71,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawConnections() {
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        // Mouse connections
        const mdx = a.x - mouseX;
        const mdy = a.y - mouseY;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 160) {
          const alpha = (1 - mDist / 160) * 0.35;
          ctx.strokeStyle = `rgba(253,224,71,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        // Particle-to-particle
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(200,220,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    /* ---------- main render loop ---------- */
    function render() {
      ctx.clearRect(0, 0, W, H);

      // Orbs
      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        // Soft wall bounce
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;
        drawOrb(o);
      }

      // Pulses
      pulses = pulses.filter((p) => p.opacity > 0.01);
      for (const p of pulses) {
        p.r += 1.8;
        p.opacity *= 0.985;
        drawPulse(p);
      }

      // Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around edges
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        // Gentle mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          const force = (1 - dist / 120) * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        drawParticle(p, i);
      }

      drawConnections();

      rafId = requestAnimationFrame(render);
    }

    /* ---------- mouse tracking ---------- */
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    /* ---------- init ---------- */
    function init() {
      resize();
      makeOrbs();
      makeParticles();
      startAnimeLoops();
      schedulePulses();
      render();
    }

    function onResize() {
      resize();
      makeOrbs();
      makeParticles();
    }

    init();

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    /* ---------- cleanup ---------- */
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (orbAnim) orbAnim.pause();
      if (pulseTimer) clearInterval(pulseTimer);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="anime-bg-canvas" aria-hidden="true" />;
}
