import { Badge } from "@blox-ui/ui";

export default function BadgeExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Neutral</Badge>
      <Badge tone="brand">Brand</Badge>
      <Badge tone="success" dot>Active</Badge>
      <Badge tone="warning" variant="outline">Pending</Badge>
      <Badge tone="danger" variant="solid">Overdue</Badge>
    </div>
  );
}
