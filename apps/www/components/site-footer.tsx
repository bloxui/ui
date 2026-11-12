import Link from "next/link";
import { Coffee, Github } from "lucide-react";
import { cn } from "@blox-ui/ui";
import { BrandMark } from "@/components/brand-mark";

const linkClass =
  "inline-flex items-center gap-1.5 rounded-sm text-muted transition-colors outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring";

const columns = [
  {
    title: "Docs",
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/cli", label: "CLI" },
      { href: "/docs/theming", label: "Theming" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/docs/components/button", label: "Components" },
      { href: "/blocks", label: "Blocks" },
      { href: "/showcase", label: "Showcase" },
      { href: "/status", label: "Status pages" },
    ],
  },
];

/** The footer on every page: site links, the source, and a way to support the project. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-border", className)}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:grid-cols-[1fr_auto_auto] sm:gap-16 sm:px-6">
        <div className="grid max-w-sm content-start gap-3">
          <p className="flex items-center gap-2 font-semibold">
            <BrandMark className="size-5" />
            Blox UI
          </p>
          <p className="text-muted">Accessible React components you copy into your project and own. Free and open source.</p>
          <a
            href="https://buymeacoffee.com/harshit187"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg bg-warning px-3.5 py-2 text-sm font-semibold text-warning-fg transition-colors outline-none hover:bg-warning-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Coffee aria-hidden className="size-4" />
            Buy me a coffee
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="grid content-start gap-2.5">
            <p className="font-medium">{column.title}</p>
            <ul className="grid gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-muted sm:px-6">
          <p>MIT licensed. Built with Blox UI.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/bloxui/ui" className={linkClass}>
              <Github aria-hidden className="size-3.5" />
              GitHub
            </a>
            <a href="https://buymeacoffee.com/harshit187" target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Coffee aria-hidden className="size-3.5" />
              Support the project
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
