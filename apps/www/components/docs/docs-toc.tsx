"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Anchor, type AnchorLink } from "@blox-ui/ui";

/**
 * "On this page" for docs. Reads the h2 and h3 headings with ids from the page,
 * so every page gets one without listing its sections by hand.
 */
export function DocsToc() {
  const pathname = usePathname();
  const [links, setLinks] = React.useState<AnchorLink[]>([]);

  React.useEffect(() => {
    const headings = document.querySelectorAll<HTMLHeadingElement>("#content h2[id], #content h3[id]");
    const next: AnchorLink[] = [];
    for (const heading of headings) {
      const link = { id: heading.id, title: heading.textContent ?? "" };
      const parent = next.at(-1);
      if (heading.tagName === "H3" && parent) (parent.children ??= []).push(link);
      else next.push(link);
    }
    setLinks(next);
  }, [pathname]);

  // A table of contents only helps when there is something to jump between.
  if (links.length < 2) return null;
  return <Anchor links={links} offset={80} title="On this page" />;
}
