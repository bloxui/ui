"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Blocks, BookOpen, Component, CornerDownLeft, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
} from "@blox-ui/ui";

export interface SiteSearchItem {
  title: string;
  href: string;
  group: string;
  keywords?: string[];
}

const groupIcons: Record<string, React.ReactNode> = {
  Pages: <ArrowRight />,
  Guides: <BookOpen />,
  Components: <Component />,
  Blocks: <Blocks />,
};

/** The header search box. Opens a palette over every page, guide, component and block; Ctrl/⌘ K toggles it. */
export function SiteSearch({ items }: { items: SiteSearchItem[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const groups = React.useMemo(() => {
    const map = new Map<string, SiteSearchItem[]>();
    for (const item of items) map.set(item.group, [...(map.get(item.group) ?? []), item]);
    return [...map.entries()];
  }, [items]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-sunken px-3 text-sm text-muted transition-colors outline-none hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring sm:w-64"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">
          <span className="hidden sm:inline">Search documentation…</span>
          <span className="sm:hidden">Search</span>
        </span>
        <span className="hidden items-center gap-0.5 sm:flex" aria-hidden>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} hotkey="k" title="Search documentation" size="lg">
        <CommandInput placeholder="Search pages, components and blocks…" />
        <CommandList className="max-h-[min(26rem,60dvh)]">
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          {groups.map(([group, groupItems]) => (
            <CommandGroup key={group} heading={group}>
              {groupItems.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.title} ${item.href}`}
                  keywords={item.keywords}
                  icon={groupIcons[group]}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        <div className="flex items-center gap-4 border-t border-border px-3.5 py-2 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Kbd>
              <CornerDownLeft className="size-3" />
            </Kbd>
            Go to page
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>Esc</Kbd>
            Close
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
