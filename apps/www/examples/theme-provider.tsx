"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { ThemeProvider, ToggleGroup, ToggleGroupItem, useTheme } from "@blox-ui/ui";

function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div className="grid justify-items-center gap-3">
      <ToggleGroup type="single" variant="outline" value={theme} onValueChange={(value) => value && setTheme(value as typeof theme)} aria-label="Theme">
        <ToggleGroupItem value="light" aria-label="Light"><Sun /></ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark"><Moon /></ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label="System"><Monitor /></ToggleGroupItem>
      </ToggleGroup>
      <p className="text-sm text-muted">Showing the {resolvedTheme} theme.</p>
    </div>
  );
}

/*
 * In a real app, wrap your root layout once and add the pre-paint script, so dark mode
 * never flashes light on load (themeScript is safe to call in a server layout):
 *
 *   import { ThemeProvider } from "@/components/ui/theme-provider";
 *   import { themeScript } from "@/lib/theme-script";
 *
 *   <html lang="en" suppressHydrationWarning>
 *     <head><script dangerouslySetInnerHTML={{ __html: themeScript() }} /></head>
 *     <body><ThemeProvider>{children}</ThemeProvider></body>
 *   </html>
 */
export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
