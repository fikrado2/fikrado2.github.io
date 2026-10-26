import { useEffect } from "react";

const CARD_SELECTOR = [
  ".glass-card",
  ".card",
  ".service-card",
  ".course-card",
  ".book-cover-card",
  ".books-partnership-card",
  ".video-card",
  ".video-embed-card",
  ".news-card",
  ".value",
  ".office",
  ".cert-card",
  ".hp-feature-card",
  ".hp-ai-feature",
  ".hp-security-card",
  ".hp-stat-card",
  ".hp-cert-card",
  ".hp-ceo-card",
  ".hp-cta",
  ".cta-band",
  ".mission-box",
  ".hq-photo",
  ".contact-card",
  ".contact-info",
  ".news-state",
].join(", ");

/**
 * CardTiltManager — global delegated 3D tilt engine.
 *
 * Automatically attaches interactive 3D tilt and specular lighting
 * to every card on every page without requiring manual per-card setup
 * or re-binding across client-side page transitions.
 */
export default function CardTiltManager() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let activeCard = null;
    let rafId = null;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let glareX = 50;
    let glareY = 50;

    const resetCard = (card) => {
      if (!card) return;
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)";
      card.style.setProperty("--glare-opacity", "0");
      card.classList.remove("card-3d-active");
      card.classList.add("card-3d-leaving");
      setTimeout(() => {
        if (card && !card.classList.contains("card-3d-active")) {
          card.classList.remove("card-3d-leaving");
          card.style.transform = "";
        }
      }, 450);
    };

    const updateTilt = () => {
      if (activeCard) {
        currentTiltX += (targetTiltX - currentTiltX) * 0.18;
        currentTiltY += (targetTiltY - currentTiltY) * 0.18;

        activeCard.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) translateZ(12px) scale3d(1.025, 1.025, 1.025)`;
        activeCard.style.setProperty("--glare-x", `${glareX.toFixed(1)}%`);
        activeCard.style.setProperty("--glare-y", `${glareY.toFixed(1)}%`);
        activeCard.style.setProperty("--glare-opacity", "0.22");
        rafId = requestAnimationFrame(updateTilt);
      }
    };

    const onPointerMove = (e) => {
      // Disable 3D tilt on the contact page
      if (window.location.pathname.includes('/contact')) {
        if (activeCard) {
          resetCard(activeCard);
          activeCard = null;
          if (rafId) cancelAnimationFrame(rafId);
        }
        return;
      }

      const card = e.target.closest(CARD_SELECTOR);

      if (!card) {
        if (activeCard) {
          resetCard(activeCard);
          activeCard = null;
          if (rafId) cancelAnimationFrame(rafId);
        }
        return;
      }

      if (activeCard !== card) {
        if (activeCard) resetCard(activeCard);
        activeCard = card;
        activeCard.classList.add("card-3d-active");
        activeCard.classList.remove("card-3d-leaving");
        currentTiltX = 0;
        currentTiltY = 0;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateTilt);
      }

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width - 0.5) * 2; // -1 to 1
      const py = (y / rect.height - 0.5) * 2; // -1 to 1

      // Tilt angles (responsive, max 9.5 degrees)
      targetTiltX = -py * 9.5;
      targetTiltY = px * 9.5;

      glareX = (x / rect.width) * 100;
      glareY = (y / rect.height) * 100;
    };

    const onPointerLeave = () => {
      if (activeCard) {
        resetCard(activeCard);
        activeCard = null;
        if (rafId) cancelAnimationFrame(rafId);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
      if (activeCard) resetCard(activeCard);
    };
  }, []);

  return null;
}
