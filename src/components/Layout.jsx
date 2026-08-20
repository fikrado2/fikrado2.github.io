import { Outlet, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import useSEO from "../hooks/useSEO.js";

const Scene3D = lazy(() => import("./Scene3D.jsx"));

const ROUTE_VARIANTS = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/courses": "courses",
  "/books": "books",
  "/videos": "videos",
  "/contact": "contact",
};

export default function Layout() {
  const location = useLocation();
  const variant = ROUTE_VARIANTS[location.pathname] || "home";

  useSEO(location.pathname);

  return (
    <>
      <div className="page-bg" data-page={variant} aria-hidden="true">
        <div className="bg-grid" />
        <div className="bg-scene">
          <Suspense fallback={null}>
            <Scene3D variant={variant} key={variant} />
          </Suspense>
        </div>
        <div className="bg-vignette" />
      </div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <LanguageSwitcher />
    </>
  );
}
