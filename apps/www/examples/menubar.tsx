import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@blox-ui/ui";

export default function MenubarExample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="Ctrl T">New tab</MenubarItem>
          <MenubarItem shortcut="Ctrl N">New window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut="Ctrl P">Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="Ctrl Z">Undo</MenubarItem>
          <MenubarItem shortcut="Ctrl Y">Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
