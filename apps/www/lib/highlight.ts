import "server-only";

import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Promise<Highlighter> | undefined;

/** Highlights code at build time. Colours switch with the site theme through CSS variables. */
export async function highlight(code: string, lang: "tsx" | "bash" | "css" | "json") {
  highlighter ??= createHighlighter({ themes: ["github-light", "github-dark"], langs: ["tsx", "bash", "css", "json"] });
  return (await highlighter).codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
