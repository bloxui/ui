/**
 * Server-safe theme helpers. Kept out of theme-provider (a client component) so a
 * server layout can call themeScript() while rendering <head>.
 */

export type Theme = "light" | "dark" | "system";

/** localStorage key ThemeProvider and themeScript share by default. */
export const DEFAULT_THEME_STORAGE_KEY = "blox-theme";

/**
 * Inline script for <head> that applies the saved theme before the first paint,
 * so people who chose dark never see a flash of light:
 *
 *   <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
 *
 * Pass the same storageKey and defaultTheme you give ThemeProvider.
 */
export function themeScript(storageKey = DEFAULT_THEME_STORAGE_KEY, defaultTheme: Theme = "system") {
  return `try{var t=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(defaultTheme)};var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}`;
}
