import { getComponentList } from "@/lib/docs";
import { componentMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getComponentList().map((item) => ({ name: item.name }));
}

/** A component page as Markdown. Served at /docs/components/<name>.md through a rewrite in next.config. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const markdown = componentMarkdown(name);
  if (!markdown) return new Response("Not found", { status: 404 });
  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
}
