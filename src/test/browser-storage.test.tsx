import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { readBrowserStorage, writeBrowserStorage } from "../lib/browser-storage.js";
import { LanguageProvider } from "../i18n/LanguageContext.jsx";

describe("browser storage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads and writes values when storage is available", () => {
    writeBrowserStorage("localStorage", "test-key", "test-value");

    expect(readBrowserStorage("localStorage", "test-key")).toBe("test-value");
  });

  it("falls back safely when the browser blocks storage access", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    });

    expect(() => writeBrowserStorage("localStorage", "test-key", "test-value")).not.toThrow();
    expect(readBrowserStorage("localStorage", "test-key")).toBeNull();
  });

  it("renders the language provider when browser storage is blocked", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    });
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    });

    render(
      <LanguageProvider>
        <p>Site content</p>
      </LanguageProvider>,
    );

    expect(screen.getByText("Site content")).toBeInTheDocument();
  });
});
