"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface AnchorLink {
  /** The id of the section, without "#". */
  id: string;
  title: React.ReactNode;
  children?: AnchorLink[];
}

export interface AnchorProps extends Omit<React.ComponentProps<"nav">, "children" | "title"> {
  links: AnchorLink[];
  /** Height of a sticky header, so sections count as active below it and scroll clear of it. */
  offset?: number;
  title?: React.ReactNode;
}

function flatten(links: AnchorLink[]): string[] {
  return links.flatMap((link) => [link.id, ...flatten(link.children ?? [])]);
}

/** The section in view: the last one whose top has scrolled past the offset line. */
export function activeSection(tops: { id: string; top: number }[], offset: number) {
  let active = tops[0]?.id ?? null;
  for (const { id, top } of tops) if (top - offset <= 1) active = id;
  return active;
}

/** "On this page" links that highlight the section in view and scroll smoothly to it. */
export function Anchor({ links, offset = 80, title = "On this page", className, ...props }: AnchorProps) {
  const ids = React.useMemo(() => flatten(links), [links]);
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null);

  React.useEffect(() => {
    const update = () => {
      const tops = ids
        .map((id) => ({ id, element: document.getElementById(id) }))
        .filter((entry): entry is { id: string; element: HTMLElement } => entry.element !== null)
        .map(({ id, element }) => ({ id, top: element.getBoundingClientRect().top }));
      // At the very bottom, the last section is active even if it is short.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? (tops.at(-1)?.id ?? null) : activeSection(tops, offset));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids, offset]);

  function renderLinks(items: AnchorLink[], depth: number) {
    return (
      <ul className={cn("grid gap-0.5", depth > 0 && "pl-3")}>
        {items.map((link) => {
          const isActive = active === link.id;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  const target = document.getElementById(link.id);
                  if (!target) return;
                  event.preventDefault();
                  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: reduce ? "auto" : "smooth" });
                  history.replaceState(null, "", `#${link.id}`);
                  setActive(link.id);
                  // Move focus too, so keyboard and screen reader users land in the section.
                  target.setAttribute("tabindex", "-1");
                  target.focus({ preventScroll: true });
                }}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-3 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "border-brand font-medium text-fg" : "border-transparent text-muted hover:text-fg",
                )}
              >
                {link.title}
              </a>
              {link.children?.length ? renderLinks(link.children, depth + 1) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <nav data-slot="anchor" aria-label={typeof title === "string" ? title : "On this page"} className={cn("grid gap-2", className)} {...props}>
      {title ? <p className="text-sm font-semibold">{title}</p> : null}
      <div className="border-l border-border">{renderLinks(links, 0)}</div>
    </nav>
  );
}
