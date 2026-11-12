import { Mail, Search } from "lucide-react";
import { Input, Kbd } from "@blox-ui/ui";

export default function InputExample() {
  return (
    <div className="grid w-full max-w-xs gap-3">
      <Input placeholder="Plain input" aria-label="Plain input" />
      <Input leading={<Search />} trailing={<Kbd>/</Kbd>} placeholder="Search" aria-label="Search" />
      <Input leading={<Mail />} type="email" defaultValue="not-an-email" invalid aria-label="Email" />
      <Input leading="https://" trailing=".com" placeholder="your-site" aria-label="Website" />
    </div>
  );
}
