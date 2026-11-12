import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@blox-ui/ui";
import { DocsMobileNav, type DocsNavGroup } from "@/components/docs/docs-nav";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/components/button", label: "Components" },
  { href: "/blocks", label: "Blocks" },
  { href: "/docs/theming", label: "Themes" },
];

export function SiteHeader({ navGroups }: { navGroups?: DocsNavGroup[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {navGroups ? <DocsMobileNav groups={navGroups} /> : null}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-brand text-sm text-brand-fg">B</span>
          Blox UI
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-muted transition-colors outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" tone="neutral" size="sm" iconOnly aria-label="GitHub repository">
            <a href="https://github.com/bloxui/ui">
              <Github />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
