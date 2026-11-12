import { MessageCircle, Pencil, Share2 } from "lucide-react";
import { FloatButton } from "@blox-ui/ui";

export default function FloatButtonExample() {
  return (
    <div className="flex items-end gap-4">
      <FloatButton icon={<MessageCircle />} label="Chat with us" badge={3} />
      <FloatButton icon={<Pencil />} label="New note" tone="neutral" size="md" />
      <FloatButton icon={<Share2 />} label="Share" tone="success" size="md" />
    </div>
  );
}
