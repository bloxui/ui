"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, cn, Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@blox-ui/ui";

export interface DocsNavGroup {
  title: string;
  items: { title: string; href: string }[];
}

function NavLinks({ groups, onNavigate }: { groups: DocsNavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation" className="space-y-6 text-sm">
      {groups.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="px-2.5 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-md px-2.5 py-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-brand-soft font-medium text-brand-text" : "text-muted hover:bg-neutral-soft hover:text-fg",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Side navigation on wide screens. */
export function DocsSidebar({ groups }: { groups: DocsNavGroup[] }) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border py-6 pr-4 lg:block">
      <NavLinks groups={groups} />
    </aside>
  );
}

/** The same navigation in a sheet, for narrow screens. */
export function DocsMobileNav({ groups }: { groups: DocsNavGroup[] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Open navigation" className="lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" size="sm" className="overflow-y-auto p-6">
        <SheetTitle className="mb-4 text-base">Blox UI</SheetTitle>
        <SheetDescription className="sr-only">Documentation pages</SheetDescription>
        <NavLinks groups={groups} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
