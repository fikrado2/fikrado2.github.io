import { useLocation } from "../compat/react-router-dom.jsx";
import { Suspense, lazy, useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import AnimeBackground from "./AnimeBackground.jsx";
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
  useEffect(() => setMounted(true), []);
  const variant = ROUTE_VARIANTS[location.pathname] || "home";

  useSEO(location.pathname);

  return (
    <>
      <div className="page-bg" data-page={variant} aria-hidden="true">
        <div className="bg-grid" />
        {mounted && (variant === "home" ? (
          <div className="bg-anime">
            <AnimeBackground />
          </div>
        ) : (
          <div className="bg-scene">
            <Suspense fallback={null}>
              <Scene3D variant={variant} key={variant} />
            </Suspense>
          </div>
        ))}
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
