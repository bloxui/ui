import { DocsSidebar, type DocsNavGroup } from "@/components/docs/docs-nav";
import { DocsToc } from "@/components/docs/docs-toc";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getNavigation } from "@/lib/docs";

const guides: DocsNavGroup = {
  title: "Getting started",
  items: [
    { title: "Introduction", href: "/docs" },
    { title: "Installation", href: "/docs/installation" },
    { title: "CLI", href: "/docs/cli" },
    { title: "Theming", href: "/docs/theming" },
  ],
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const groups: DocsNavGroup[] = [
    guides,
    ...getNavigation().map((group) => ({ title: group.title, items: group.items.map(({ title, href }) => ({ title, href })) })),
  ];
  return (
    <>
      <SiteHeader navGroups={groups} />
      <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
        <DocsSidebar groups={groups} />
        <main id="content" className="min-w-0 flex-1 py-10 lg:py-12">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
        <aside className="sticky top-14 hidden max-h-[calc(100dvh-3.5rem)] w-52 shrink-0 self-start overflow-y-auto py-12 xl:block">
          <DocsToc />
        </aside>
      </div>
      <SiteFooter />
    </>
  );
}
