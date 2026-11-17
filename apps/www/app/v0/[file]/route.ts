import { getComponentList } from "@/lib/docs";
import { getPlayground, v0RegistryItem } from "@/lib/playground";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getComponentList().map((item) => ({ file: `${item.name}.json` }));
}

/** One component's example as a shadcn-format registry item, read by "Open in v0". */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const item = v0RegistryItem(getPlayground(file.replace(/\.json$/, "")));
  return Response.json(item, { headers: { "Access-Control-Allow-Origin": "*" } });
}
