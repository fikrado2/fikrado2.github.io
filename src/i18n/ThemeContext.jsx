import { useEffect } from "react";

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    try {
      localStorage.setItem("fikrado-theme", "dark");
    } catch {
      /* ignore */
    }
  }, []);

  return children;
}
