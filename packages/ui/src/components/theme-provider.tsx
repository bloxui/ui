"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  /** What the user chose. */
  theme: Theme;
  /** What is on screen after resolving "system". */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>.");
  return context;
}

/**
 * Inline script for the <head> that applies the saved theme before the first paint,
 * so dark-mode users never see a flash of light. Put it in a <script> tag.
 */
export function themeScript(storageKey = "blox-theme", defaultTheme: Theme = "system") {
  return `try{var t=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(defaultTheme)};var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}`;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  /** localStorage key for the user's choice. */
  storageKey?: string;
  /**
   * Token overrides applied to the page, e.g. { "--bx-radius": "0.25rem", "--bx-brand": "oklch(0.6 0.2 150)" }.
   * Use it for per-customer branding; for a fixed theme, set the variables in CSS instead.
   */
  tokens?: Record<`--bx-${string}`, string>;
}

function systemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Manages light, dark and system themes: remembers the choice, follows the operating
 * system when set to "system", and toggles the `dark` class the tokens respond to.
 */
export function ThemeProvider({ children, defaultTheme = "system", storageKey = "blox-theme", tokens }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [systemDark, setSystemDark] = React.useState(false);

  // Read the saved choice after mount, so server and client render the same markup.
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark" || saved === "system") setThemeState(saved);
    } catch {
      // Storage may be blocked; fall back to the default.
    }
    setSystemDark(systemPrefersDark());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [storageKey]);

  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  React.useEffect(() => {
    if (!tokens) return;
    const root = document.documentElement;
    for (const [name, value] of Object.entries(tokens)) root.style.setProperty(name, value);
    return () => {
      for (const name of Object.keys(tokens)) root.style.removeProperty(name);
    };
  }, [tokens]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // The choice still applies for this visit.
      }
    },
    [storageKey],
  );

  const value = React.useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
