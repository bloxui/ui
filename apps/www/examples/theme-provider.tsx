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

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
