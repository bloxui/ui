import { Badge, Button, Descriptions } from "@blox-ui/ui";

export default function DescriptionsExample() {
  return (
    <Descriptions
      title="Order #1042"
      extra={<Button size="xs" variant="outline" tone="neutral">Edit</Button>}
      bordered
      className="w-full max-w-2xl"
      items={[
        { label: "Customer", value: "Ada Lovelace" },
        { label: "Status", value: <Badge tone="success" dot>Paid</Badge> },
        { label: "Total", value: "₹12,400" },
        { label: "Placed", value: "12 Jan 2026, 9:12 AM" },
        { label: "Payment", value: "UPI" },
        { label: "Items", value: "3" },
        { label: "Shipping address", value: "21 Ring Road, Surat, Gujarat 395002", span: 3 },
      ]}
    />
  );
}
