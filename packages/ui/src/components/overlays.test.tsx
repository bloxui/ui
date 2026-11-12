import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
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
  Button,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
} from "../index";

function ProfileDialog(props: { dismissible?: boolean; showClose?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent dismissible={props.dismissible} showClose={props.showClose}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your details.</DialogDescription>
        </DialogHeader>
        <DialogBody>Form goes here</DialogBody>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens from its trigger with an accessible name and description", async () => {
    const user = userEvent.setup();
    render(<ProfileDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    const dialog = screen.getByRole("dialog", { name: "Edit profile" });
    expect(dialog).toHaveAccessibleDescription("Update your details.");
  });

  it("closes with the close button and with Escape", async () => {
    const user = userEvent.setup();
    render(<ProfileDialog />);

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open on Escape and outside click when not dismissible", async () => {
    const user = userEvent.setup();
    render(<ProfileDialog dismissible={false} />);

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const backdrop = document.querySelector("[data-slot=dialog-backdrop]");
    expect(backdrop).not.toBeNull();
    await user.click(backdrop!);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("can hide the close button", async () => {
    const user = userEvent.setup();
    render(<ProfileDialog showClose={false} />);
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });
});

describe("AlertDialog", () => {
  function DeleteDialog(props: { onConfirm: () => void }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button tone="danger">Delete project</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction tone="danger" onClick={props.onConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  it("focuses Cancel first and does not close on outside click", async () => {
    const user = userEvent.setup();
    render(<DeleteDialog onConfirm={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Delete project" }));

    expect(screen.getByRole("alertdialog", { name: "Delete this project?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();

    await user.click(document.querySelector("[data-slot=alert-dialog-backdrop]")!);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("runs the action and closes; Cancel closes without running it", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<DeleteDialog onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Delete project" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete project" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});

describe("Sheet", () => {
  it("opens on the requested side and closes", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Filters</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow the results.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog", { name: "Filters" })).toHaveAttribute("data-side", "left");

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Drawer", () => {
  it("opens from its trigger with an accessible name", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Share</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Share this page</DrawerTitle>
            <DrawerDescription>Pick where to send it.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(await screen.findByRole("dialog", { name: "Share this page" })).toBeInTheDocument();
  });
});

describe("Popover", () => {
  it("toggles from its trigger and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Settings</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Settings" });
    await user.click(trigger);
    expect(screen.getByText("Popover body")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
  });
});

describe("Tooltip", () => {
  it("describes its trigger on hover and on keyboard focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Save changes" shortcut="Ctrl S" delayDuration={0}>
        <Button>Save</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Save changes");
    expect(screen.getByRole("button", { name: "Save" })).toHaveAccessibleDescription(/Save changes/);
  });

  it("renders only the trigger when disabled or empty", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip content="Hidden" disabled delayDuration={0}>
          <Button>One</Button>
        </Tooltip>
        <Tooltip content="" delayDuration={0}>
          <Button>Two</Button>
        </Tooltip>
      </>,
    );
    await user.hover(screen.getByRole("button", { name: "One" }));
    await user.hover(screen.getByRole("button", { name: "Two" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

describe("HoverCard", () => {
  it("shows its content when open", () => {
    render(
      <HoverCard open>
        <HoverCardTrigger href="/ada">@ada</HoverCardTrigger>
        <HoverCardContent>Ada Lovelace, mathematician</HoverCardContent>
      </HoverCard>,
    );
    expect(screen.getByText("Ada Lovelace, mathematician")).toBeInTheDocument();
  });
});

describe("DropdownMenu", () => {
  function Menu(props: { onSelect: (action: string) => void }) {
    const [bookmarks, setBookmarks] = React.useState(false);
    const [density, setDensity] = React.useState("comfortable");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem shortcut="Ctrl E" onSelect={() => props.onSelect("edit")}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled onSelect={() => props.onSelect("archive")}>
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem tone="danger" onSelect={() => props.onSelect("delete")}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
            Show bookmarks
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  it("opens, runs the selected item and closes", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Edit/ })).toHaveTextContent("Ctrl E");

    await user.click(screen.getByRole("menuitem", { name: /Edit/ }));
    expect(onSelect).toHaveBeenCalledWith("edit");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("marks danger and disabled items", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Options" }));

    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-tone", "danger");
    expect(screen.getByRole("menuitem", { name: "Archive" })).toHaveAttribute("aria-disabled", "true");
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);

    screen.getByRole("button", { name: "Options" }).focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowDown}{Enter}");
    // Archive is disabled, so the second item reached is Delete.
    expect(onSelect).toHaveBeenCalledWith("delete");
  });

  it("toggles checkbox items and switches radio items", async () => {
    const user = userEvent.setup();
    render(<Menu onSelect={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menuitemradio", { name: "Comfortable" })).toBeChecked();
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Show bookmarks" }));

    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menuitemcheckbox", { name: "Show bookmarks" })).toBeChecked();
    await user.click(screen.getByRole("menuitemradio", { name: "Compact" }));

    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menuitemradio", { name: "Compact" })).toBeChecked();
    expect(screen.getByRole("menuitemradio", { name: "Comfortable" })).not.toBeChecked();
  });
});

describe("ContextMenu", () => {
  it("opens on right-click and runs the selected item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.contextMenu(screen.getByText("Right-click here"));
    await user.click(await screen.findByRole("menuitem", { name: "Copy" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe("Menubar", () => {
  it("opens a menu from the bar and runs an item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={onSelect}>New tab</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    expect(screen.getByRole("menubar")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "File" }));
    await user.click(await screen.findByRole("menuitem", { name: "New tab" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe("Command", () => {
  function Palette(props: { onSelect?: (value: string) => void }) {
    return (
      <Command>
        <CommandInput placeholder="Search commands" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={props.onSelect}>Dashboard</CommandItem>
            <CommandItem onSelect={props.onSelect} shortcut="Ctrl ,">
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }

  it("filters items as the user types and shows the empty state", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    const input = screen.getByPlaceholderText("Search commands");

    await user.type(input, "sett");
    expect(screen.getByRole("option", { name: /Settings/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Dashboard" })).not.toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "zzz");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("runs the highlighted item with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Palette onSelect={onSelect} />);
    await user.type(screen.getByPlaceholderText("Search commands"), "dash{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("opens and closes the dialog with its hotkey", async () => {
    const user = userEvent.setup();
    render(
      <CommandDialog hotkey="k">
        <CommandInput placeholder="Search commands" />
        <CommandList>
          <CommandItem>Dashboard</CommandItem>
        </CommandList>
      </CommandDialog>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
