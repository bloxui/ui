import { TreeView, type TreeNode } from "@blox-ui/ui";

const files: TreeNode[] = [
  {
    id: "app",
    label: "app",
    children: [
      { id: "layout", label: "layout.tsx" },
      { id: "page", label: "page.tsx" },
      { id: "settings", label: "settings", children: [{ id: "settings-page", label: "page.tsx" }] },
    ],
  },
  {
    id: "components",
    label: "components",
    children: [
      { id: "ui", label: "ui", children: [{ id: "button", label: "button.tsx" }, { id: "dialog", label: "dialog.tsx" }] },
    ],
  },
  { id: "package", label: "package.json" },
];

export default function TreeViewExample() {
  return (
    <TreeView
      items={files}
      aria-label="Project files"
      defaultExpandedIds={["app", "components", "ui"]}
      defaultSelectedId="page"
      className="w-full max-w-xs rounded-lg border border-border p-2"
    />
  );
}
