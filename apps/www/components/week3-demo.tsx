"use client";

import * as React from "react";
import { Copy, LogOut, Search, Settings, Trash2, User, UserPlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Field,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Kbd,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipProvider,
} from "@blox-ui/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

export function Week3Demo() {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [bookmarks, setBookmarks] = React.useState(true);
  const [density, setDensity] = React.useState("comfortable");
  const [pinned, setPinned] = React.useState(false);
  const [sidebar, setSidebar] = React.useState(true);

  return (
    <>
      <Section title="Dialog, Alert Dialog, Sheet, Drawer">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Edit profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Changes are visible to your team.</DialogDescription>
              </DialogHeader>
              <DialogBody className="grid gap-4">
                <Field label="Name">
                  <Input defaultValue="Ada Lovelace" />
                </Field>
                <Field label="Username" hint="Letters and numbers only.">
                  <Input leading="@" defaultValue="ada" />
                </Field>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" tone="neutral">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button tone="danger" variant="soft" leftIcon={<Trash2 />}>
                Delete project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                <AlertDialogDescription>
                  All components and their history will be removed. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction tone="danger">Delete project</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {(["right", "left"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="soft">Sheet ({side})</Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down the component list.</SheetDescription>
                </SheetHeader>
                <SheetBody className="grid content-start gap-4">
                  <Field label="Search">
                    <Input leading={<Search />} placeholder="Component name" />
                  </Field>
                </SheetBody>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>Apply</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="soft">Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Share this page</DrawerTitle>
                  <DrawerDescription>Drag the handle down to dismiss.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button leftIcon={<Copy />}>Copy link</Button>
                  <DrawerClose asChild>
                    <Button variant="outline" tone="neutral">
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </Section>

      <Section title="Popover, Tooltip, Hover Card">
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" tone="neutral">
                  Dimensions
                </Button>
              </PopoverTrigger>
              <PopoverContent className="grid gap-3">
                <p className="font-medium">Dimensions</p>
                <Field label="Width">
                  <Input size="sm" defaultValue="100%" />
                </Field>
                <Field label="Height">
                  <Input size="sm" defaultValue="25px" />
                </Field>
              </PopoverContent>
            </Popover>

            <Tooltip content="Open settings" shortcut="Ctrl ,">
              <Button iconOnly variant="outline" tone="neutral" aria-label="Settings">
                <Settings />
              </Button>
            </Tooltip>
            <Tooltip content="Shown below" side="bottom">
              <Button variant="soft">Hover or focus me</Button>
            </Tooltip>

            <HoverCard>
              <HoverCardTrigger
                href="#"
                className="text-sm font-medium text-brand-text underline underline-offset-4"
              >
                @ada
              </HoverCardTrigger>
              <HoverCardContent className="flex gap-3">
                <Avatar name="Ada Lovelace" />
                <div className="grid gap-1">
                  <p className="font-medium">Ada Lovelace</p>
                  <p className="text-muted">Wrote the first published program.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </TooltipProvider>
      </Section>

      <Section title="Dropdown Menu, Context Menu, Menubar">
        <div className="flex flex-wrap items-start gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" tone="neutral">
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuItem icon={<User />} shortcut="Ctrl P">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem icon={<Settings />} shortcut="Ctrl ,">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger icon={<UserPlus />}>Invite people</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>By email</DropdownMenuItem>
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
                Show bookmarks
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel inset>Density</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
                <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem tone="danger" icon={<LogOut />}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem checked={sidebar} onCheckedChange={setSidebar}>
                  Show sidebar
                </MenubarCheckboxItem>
                <MenubarItem inset>Full screen</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        <ContextMenu>
          <ContextMenuTrigger className="flex h-28 items-center justify-center rounded-lg border border-dashed border-border-strong text-sm text-muted">
            Right-click (or long-press) here
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem shortcut="Ctrl C">Copy</ContextMenuItem>
            <ContextMenuItem shortcut="Ctrl V">Paste</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
              Pinned
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem tone="danger" inset>
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Section>

      <Section title="Command palette">
        <Button variant="outline" tone="neutral" leftIcon={<Search />} onClick={() => setPaletteOpen(true)}>
          Search
          <span className="flex gap-1">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </span>
        </Button>
        <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen} hotkey="k">
          <CommandInput placeholder="Type a command or search" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem icon={<User />} shortcut="Ctrl P" onSelect={() => setPaletteOpen(false)}>
                Profile
              </CommandItem>
              <CommandItem icon={<Settings />} shortcut="Ctrl ," onSelect={() => setPaletteOpen(false)}>
                Settings
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem icon={<Copy />} onSelect={() => setPaletteOpen(false)}>
                Copy link
              </CommandItem>
              <CommandItem icon={<LogOut />} tone="danger" onSelect={() => setPaletteOpen(false)}>
                Sign out
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Section>
    </>
  );
}
