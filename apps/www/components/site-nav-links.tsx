"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@blox-ui/ui";

const links = [
  { href: "/docs", label: "Docs", match: (path: string) => path === "/docs" || /^\/docs\/(installation|cli)/.test(path) },
  { href: "/docs/components/button", label: "Components", match: (path: string) => path.startsWith("/docs/components") },
  { href: "/blocks", label: "Blocks", match: (path: string) => path.startsWith("/blocks") },
  { href: "/docs/theming", label: "Themes", match: (path: string) => path.startsWith("/docs/theming") },
  { href: "/showcase", label: "Showcase", match: (path: string) => path.startsWith("/showcase") },
];

export function SiteNavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-0.5 text-sm lg:flex">
      {links.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1.5 font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
