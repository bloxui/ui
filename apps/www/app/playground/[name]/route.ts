import { getComponentList } from "@/lib/docs";
import { getPlayground, stackblitzFiles } from "@/lib/playground";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getComponentList().map((item) => ({ name: item.name }));
}

/** The files of a Vite project for one component, opened in StackBlitz by the docs button. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return Response.json(stackblitzFiles(getPlayground(name)));
}
