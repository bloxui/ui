import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@blox-ui/ui";

export default function ContextMenuExample() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full max-w-xs items-center justify-center rounded-lg border border-dashed border-border-strong text-sm text-muted">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem shortcut="Ctrl C">Copy</ContextMenuItem>
        <ContextMenuItem shortcut="Ctrl V">Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem tone="danger">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
