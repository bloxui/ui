import "server-only";

import { getComponentList } from "./docs";
import { blocks } from "./blocks";

export interface SearchItem {
  title: string;
  href: string;
  group: "Pages" | "Guides" | "Components" | "Blocks";
  /** Extra words to match, e.g. the category. */
  keywords?: string[];
}

/** Everything the site search can jump to, built once at build time. */
export function getSearchItems(): SearchItem[] {
  return [
    { title: "Home", href: "/", group: "Pages" },
    { title: "Docs", href: "/docs", group: "Pages", keywords: ["introduction"] },
    { title: "Showcase", href: "/showcase", group: "Pages", keywords: ["examples", "all components"] },
    { title: "Blocks", href: "/blocks", group: "Pages", keywords: ["templates", "screens"] },
    { title: "Theme builder", href: "/docs/theming#customizer", group: "Pages", keywords: ["colors", "customize"] },
    { title: "Installation", href: "/docs/installation", group: "Guides", keywords: ["setup", "install"] },
    { title: "CLI", href: "/docs/cli", group: "Guides", keywords: ["init", "add", "command line"] },
    { title: "Theming", href: "/docs/theming", group: "Guides", keywords: ["dark mode", "tokens", "css variables"] },
    ...getComponentList().map((item) => ({
      title: item.title,
      href: `/docs/components/${item.name}`,
      group: "Components" as const,
      keywords: [item.category, item.description],
    })),
    ...Object.entries(blocks).map(([name, block]) => ({
      title: `${block.title} block`,
      href: `/blocks/${name}`,
      group: "Blocks" as const,
      keywords: [block.description],
    })),
  ];
}
