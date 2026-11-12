import { FolderOpen } from "lucide-react";
import { Button, Empty } from "@blox-ui/ui";

export default function EmptyExample() {
  return (
    <Empty
      icon={<FolderOpen />}
      title="No projects yet"
      description="Projects you create will show up here."
      actions={<Button size="sm">New project</Button>}
      className="w-full max-w-md"
    />
  );
}
