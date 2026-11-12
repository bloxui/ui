import { Anchor } from "@blox-ui/ui";

export default function AnchorExample() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-border p-4">
      <Anchor
        offset={72}
        links={[
          { id: "installation", title: "Installation" },
          { id: "usage", title: "Usage" },
          { id: "api", title: "API", children: [{ id: "props", title: "Props" }] },
        ]}
      />
      <p className="pt-3 text-xs text-muted">Links jump to sections with matching ids on this page.</p>
    </div>
  );
}
