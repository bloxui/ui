import { BarChart3, Home, Settings, Users } from "lucide-react";
import {
  Badge,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@blox-ui/ui";

export default function SidebarExample() {
  return (
    <SidebarProvider hotkey={null} className="h-80 min-h-0 w-full overflow-hidden rounded-lg border border-border">
      <Sidebar className="h-full">
        <SidebarContent>
          <SidebarGroup label="Workspace">
            <SidebarMenu>
              <SidebarMenuItem icon={<Home />} active>Overview</SidebarMenuItem>
              <SidebarMenuItem icon={<BarChart3 />} badge={<Badge size="sm">3</Badge>}>Reports</SidebarMenuItem>
              <SidebarMenuItem icon={<Users />}>Team</SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem icon={<Settings />}>Settings</SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b border-border px-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Overview</span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}
