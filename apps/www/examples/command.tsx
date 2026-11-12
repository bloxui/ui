import { LogOut, Settings, User } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@blox-ui/ui";

export default function CommandExample() {
  return (
    <Command className="w-full max-w-sm rounded-xl border border-border shadow-raised">
      <CommandInput placeholder="Type a command or search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem icon={<User />} shortcut="Ctrl P">Profile</CommandItem>
          <CommandItem icon={<Settings />} shortcut="Ctrl ,">Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem icon={<LogOut />} tone="danger">Sign out</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
