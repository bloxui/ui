import { Separator, Space } from "@blox-ui/ui";

export default function SpaceExample() {
  return (
    <div className="grid gap-4 text-sm">
      <Space separator="·" className="text-muted">
        <span>Ada Lovelace</span>
        <span>12 min read</span>
        <span>Jan 12</span>
      </Space>
      <Space gap={3} separator={<Separator orientation="vertical" className="h-4" />}>
        <a href="#" className="font-medium text-brand-text">Docs</a>
        <a href="#" className="font-medium text-brand-text">Changelog</a>
        <a href="#" className="font-medium text-brand-text">GitHub</a>
      </Space>
    </div>
  );
}
