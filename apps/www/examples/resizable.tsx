import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@blox-ui/ui";

export default function ResizableExample() {
  return (
    <div className="h-56 w-full max-w-lg overflow-hidden rounded-lg border border-border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full items-center justify-center text-sm text-muted">Sidebar</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <div className="flex h-full items-center justify-center text-sm text-muted">Content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
