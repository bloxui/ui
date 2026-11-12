import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, InfoIcon, SearchIcon, UserIcon, XIcon } from "../lib/icons";
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
} from "./alert-dialog";
import { Avatar } from "./avatar";
import { Button } from "./button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import {
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
} from "./dropdown-menu";
import { Field } from "./field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Input } from "./input";
import { Kbd } from "./kbd";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./menubar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Tooltip, TooltipProvider } from "./tooltip";

const meta = { title: "Components/Overlays" } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DialogStory: Story = {
  name: "Dialog",
  render: () => (
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
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const DialogSizes: Story = {
  name: "Dialog — sizes",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="soft">{size}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size {size}</DialogTitle>
              <DialogDescription>The dialog never grows past the screen.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const DialogScrollingBody: Story = {
  name: "Dialog — long content",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="soft">Terms of service</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>The header and footer stay in view while the body scrolls.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3 text-sm">
          {Array.from({ length: 24 }, (_, index) => (
            <p key={index}>
              Section {index + 1}. You own the code you copy from Blox UI and can change it freely.
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>I agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const DialogNotDismissible: Story = {
  name: "Dialog — not dismissible",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="soft">Unsaved changes</Button>
      </DialogTrigger>
      <DialogContent dismissible={false} showClose={false} size="sm">
        <DialogHeader>
          <DialogTitle>Finish setup</DialogTitle>
          <DialogDescription>Escape and outside clicks are ignored; use the button.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AlertDialogStory: Story = {
  name: "Alert Dialog",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button tone="danger" variant="soft">
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            All 12 components and their history will be removed. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction tone="danger">Delete project</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const SheetStory: Story = {
  name: "Sheet",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["right", "left", "top", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="soft">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Slides in from the {side}.</SheetDescription>
            </SheetHeader>
            <SheetBody className="grid content-start gap-4">
              <Field label="Search">
                <Input leading={<SearchIcon />} placeholder="Component name" />
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
    </div>
  ),
};

export const DrawerStory: Story = {
  name: "Drawer",
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="soft">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Share this page</DrawerTitle>
            <DrawerDescription>Drag the handle down to dismiss.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Copy link</Button>
            <DrawerClose asChild>
              <Button variant="outline" tone="neutral">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const PopoverStory: Story = {
  name: "Popover",
  render: () => (
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
  ),
};

export const TooltipStory: Story = {
  name: "Tooltip",
  render: () => (
    <TooltipProvider>
      <div className="flex gap-3">
        <Tooltip content="Save changes" shortcut="Ctrl S">
          <Button iconOnly variant="outline" tone="neutral" aria-label="Save">
            <CheckIcon />
          </Button>
        </Tooltip>
        <Tooltip content="More information" side="bottom">
          <Button iconOnly variant="outline" tone="neutral" aria-label="Info">
            <InfoIcon />
          </Button>
        </Tooltip>
        <Tooltip content="Without an arrow" arrow={false} side="right">
          <Button variant="soft">Hover me</Button>
        </Tooltip>
        <Tooltip content="Never shown" disabled>
          <Button variant="ghost">Tooltip disabled</Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const HoverCardStory: Story = {
  name: "Hover Card",
  render: () => (
    <HoverCard>
      <HoverCardTrigger href="#" className="text-sm font-medium text-brand-text underline underline-offset-4">
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
  ),
};

export const DropdownMenuStory: Story = {
  name: "Dropdown Menu",
  render: () => {
    const [bookmarks, setBookmarks] = React.useState(true);
    const [density, setDensity] = React.useState("comfortable");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" tone="neutral">
            Options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem icon={<UserIcon />} shortcut="Ctrl P">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem icon={<SearchIcon />} shortcut="Ctrl K">
            Search
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<InfoIcon />}>Invite people</DropdownMenuSubTrigger>
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
          <DropdownMenuItem disabled icon={<CheckIcon />}>
            Archive (disabled)
          </DropdownMenuItem>
          <DropdownMenuItem tone="danger" icon={<XIcon />}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const ContextMenuStory: Story = {
  name: "Context Menu",
  render: () => {
    const [pinned, setPinned] = React.useState(false);
    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-lg border border-dashed border-border-strong text-sm text-muted">
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
    );
  },
};

export const MenubarStory: Story = {
  name: "Menubar",
  render: () => {
    const [sidebar, setSidebar] = React.useState(true);
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
    );
  },
};

function PaletteItems() {
  return (
    <>
      <CommandInput placeholder="Type a command or search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem icon={<SearchIcon />}>Search components</CommandItem>
          <CommandItem icon={<UserIcon />} shortcut="Ctrl P">
            Profile
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem icon={<CheckIcon />}>Mark all as read</CommandItem>
          <CommandItem icon={<InfoIcon />} disabled>
            Billing (disabled)
          </CommandItem>
          <CommandItem icon={<XIcon />} tone="danger">
            Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

export const CommandStory: Story = {
  name: "Command",
  render: () => (
    <div className="w-96 rounded-xl border border-border shadow-raised">
      <Command>
        <PaletteItems />
      </Command>
    </div>
  ),
};

export const CommandDialogStory: Story = {
  name: "Command — ⌘K dialog",
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
          Search
          <span className="flex gap-1">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen} hotkey="k">
          <PaletteItems />
        </CommandDialog>
      </>
    );
  },
};
