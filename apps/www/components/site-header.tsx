import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@blox-ui/ui";
import { DocsMobileNav, type DocsNavGroup } from "@/components/docs/docs-nav";
import { SiteNavLinks } from "@/components/site-nav-links";
import { SiteSearch } from "@/components/site-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSearchItems } from "@/lib/search";

export function SiteHeader({ navGroups }: { navGroups?: DocsNavGroup[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {navGroups ? <DocsMobileNav groups={navGroups} /> : null}
        <Link
          href="/"
          className="mr-2 flex shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span aria-hidden className="grid size-6 grid-cols-2 gap-0.5 rounded-md bg-fg p-1">
            <span className="rounded-[2px] bg-bg" />
            <span className="rounded-[2px] bg-bg/40" />
            <span className="rounded-[2px] bg-bg/40" />
            <span className="rounded-[2px] bg-brand" />
          </span>
          Blox UI
        </Link>
        <SiteNavLinks />
        <div className="ml-auto flex min-w-0 items-center gap-1.5">
          <SiteSearch items={getSearchItems()} />
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
