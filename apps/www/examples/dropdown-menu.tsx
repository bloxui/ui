import { LogOut, Settings, User } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@blox-ui/ui";

export default function DropdownMenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" tone="neutral">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem icon={<User />} shortcut="Ctrl P">Profile</DropdownMenuItem>
        <DropdownMenuItem icon={<Settings />} shortcut="Ctrl ,">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem defaultChecked>Show bookmarks</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger" icon={<LogOut />}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
