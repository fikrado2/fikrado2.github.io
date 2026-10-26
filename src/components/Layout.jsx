import { useLocation } from "../compat/react-router-dom.jsx";
import { Suspense, lazy, useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import CardTiltManager from "./CardTiltManager.jsx";
import useSEO from "../hooks/useSEO.js";

const Scene3D = lazy(() => import("./Scene3D.jsx"));

const ROUTE_VARIANTS = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/courses": "courses",
  "/books": "books",
  "/videos": "videos",
  "/news": "news",
  "/contact": "contact",
};

export default function Layout({ children }) {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    setMounted(true);
    const onMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const variant = ROUTE_VARIANTS[location.pathname] || "home";

  useSEO(location.pathname);

  return (
    <>
      <CardTiltManager />
      <div className="page-bg" data-page={variant} aria-hidden="true">
        <div className="bg-grid" />
        {mounted && (
          <div className="bg-scene">
            <Suspense fallback={null}>
              <Scene3D variant={variant} key={variant} />
            </Suspense>
          </div>
        )}
        <div
          className="bg-mouse-glow"
          style={{
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
          }}
        />
        <div className="bg-vignette" />
      </div>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      <LanguageSwitcher />
    </>
  );
}
