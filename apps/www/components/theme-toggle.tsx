"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@blox-ui/ui";

export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("blox-theme", dark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  }

  return (
    <Button variant="outline" tone="neutral" size="sm" iconOnly aria-label="Toggle theme" onClick={toggle}>
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
