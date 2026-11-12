import { Check, Package, Truck } from "lucide-react";
import { Timeline } from "@blox-ui/ui";

export default function TimelineExample() {
  return (
    <Timeline
      className="w-full max-w-md"
      items={[
        { title: "Order placed", description: "We have received your order.", time: "Mon, 9:12 AM", icon: <Check />, tone: "success" },
        { title: "Packed", description: "Your items are ready to ship.", time: "Mon, 4:40 PM", icon: <Package />, tone: "success" },
        { title: "Out for delivery", description: "Arriving today by 7 PM.", time: "Today, 8:05 AM", icon: <Truck />, tone: "brand" },
        { title: "Delivered", time: "Expected today" },
      ]}
    />
  );
}
