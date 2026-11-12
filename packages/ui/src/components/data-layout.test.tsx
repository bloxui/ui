import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Calendar,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ChartLegendContent,
  ChartTooltipContent,
  DataTable,
  type DataTableColumn,
  DatePicker,
  DateRangePicker,
  Field,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../index";

describe("Calendar", () => {
  it("shows the given month and reports the day the user picks", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={new Date(2026, 0, 1)} onSelect={onSelect} />);

    expect(screen.getByText("January 2026")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /January 15/ }));
    const picked = onSelect.mock.calls[0]?.[0] as Date;
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 0, 15]);
  });

  it("moves between months", async () => {
    const user = userEvent.setup();
    render(<Calendar mode="single" defaultMonth={new Date(2026, 0, 1)} />);
    await user.click(screen.getByRole("button", { name: /next month/i }));
    expect(screen.getByText("February 2026")).toBeInTheDocument();
  });

  it("does not let the user pick a disabled day", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 0, 1)}
        disabled={{ before: new Date(2026, 0, 10) }}
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole("button", { name: /January 5/ })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /January 5/ }));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("DatePicker", () => {
  it("is labelled by its Field, picks a date, closes and can be cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Field label="Start date">
        <DatePicker defaultValue={new Date(2026, 0, 10)} name="start" clearable onChange={onChange} />
      </Field>,
    );
    const trigger = screen.getByRole("button", { name: "Start date" });
    expect(trigger).toHaveTextContent("Jan 10, 2026");
    expect(document.querySelector('input[name="start"]')).toHaveValue("2026-01-10");

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: /January 20/ }));
    expect(trigger).toHaveTextContent("Jan 20, 2026");
    expect(document.querySelector('input[name="start"]')).toHaveValue("2026-01-20");
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear date" }));
    expect(onChange).toHaveBeenLastCalledWith(undefined);
    expect(trigger).toHaveTextContent("Pick a date");
  });

  it("disables days outside min and max", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        aria-label="Date"
        defaultValue={new Date(2026, 0, 15)}
        min={new Date(2026, 0, 10)}
        max={new Date(2026, 0, 20)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Date" }));
    expect(screen.getByRole("button", { name: /January 9/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /January 21/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /January 12/ })).toBeEnabled();
  });

  it("shows a range", () => {
    render(
      <DateRangePicker
        aria-label="Stay"
        defaultValue={{ from: new Date(2026, 0, 10), to: new Date(2026, 0, 14) }}
      />,
    );
    expect(screen.getByRole("button", { name: "Stay" })).toHaveTextContent("Jan 10, 2026 – Jan 14, 2026");
  });
});

interface Person {
  id: string;
  name: string;
  role: string;
  age: number | null;
}

const people: Person[] = [
  { id: "1", name: "Grace Hopper", role: "Admiral", age: 85 },
  { id: "2", name: "Ada Lovelace", role: "Mathematician", age: 36 },
  { id: "3", name: "Alan Turing", role: "Mathematician", age: 41 },
  { id: "4", name: "Linus Torvalds", role: "Engineer", age: null },
];

const columns: DataTableColumn<Person>[] = [
  { id: "name", header: "Name", accessor: (person) => person.name, sortable: true },
  { id: "role", header: "Role", accessor: (person) => person.role },
  { id: "age", header: "Age", accessor: (person) => person.age, sortable: true, numeric: true },
];

function names() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[0]?.textContent);
}

describe("DataTable", () => {
  it("sorts ascending, descending, then back to the original order", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} getRowId={(person) => person.id} aria-label="People" />);
    expect(names()).toEqual(["Grace Hopper", "Ada Lovelace", "Alan Turing", "Linus Torvalds"]);

    const header = screen.getByRole("columnheader", { name: "Name" });
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(names()).toEqual(["Ada Lovelace", "Alan Turing", "Grace Hopper", "Linus Torvalds"]);

    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(names()[0]).toBe("Linus Torvalds");

    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "none");
    expect(names()[0]).toBe("Grace Hopper");
  });

  it("sorts numbers numerically and keeps empty values last in both directions", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} getRowId={(person) => person.id} />);
    const button = within(screen.getByRole("columnheader", { name: "Age" })).getByRole("button");

    await user.click(button);
    expect(names()).toEqual(["Ada Lovelace", "Alan Turing", "Grace Hopper", "Linus Torvalds"]);
    await user.click(button);
    expect(names()).toEqual(["Grace Hopper", "Alan Turing", "Ada Lovelace", "Linus Torvalds"]);
  });

  it("filters across columns and shows the empty state", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} getRowId={(person) => person.id} searchable />);
    const search = screen.getByRole("searchbox", { name: "Search" });

    await user.type(search, "mathem");
    expect(names()).toEqual(["Ada Lovelace", "Alan Turing"]);

    await user.clear(search);
    await user.type(search, "zzz");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("paginates and returns to page one when the search changes", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={people} getRowId={(person) => person.id} pageSize={2} searchable />);
    expect(names()).toEqual(["Grace Hopper", "Ada Lovelace"]);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(names()).toEqual(["Alan Turing", "Linus Torvalds"]);

    await user.type(screen.getByRole("searchbox"), "a");
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
  });

  it("selects rows one by one and all at once", async () => {
    const user = userEvent.setup();
    const onSelectedIdsChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(person) => person.id}
        selectable
        onSelectedIdsChange={onSelectedIdsChange}
      />,
    );
    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" });
    const rowBoxes = screen.getAllByRole("checkbox", { name: "Select row" });

    await user.click(rowBoxes[1]!);
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith(["2"]);
    expect(selectAll).toHaveAttribute("aria-checked", "mixed");
    expect(screen.getByText("1 of 4 selected")).toBeInTheDocument();

    await user.click(selectAll);
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith(["1", "2", "3", "4"]);
    expect(selectAll).toBeChecked();

    await user.click(selectAll);
    expect(onSelectedIdsChange).toHaveBeenLastCalledWith([]);
  });
});

describe("Sidebar", () => {
  function App() {
    return (
      <SidebarProvider>
        <Sidebar label="Main">
          <SidebarContent>
            <SidebarGroup label="Workspace">
              <SidebarMenu>
                <SidebarMenuItem href="/home" active>
                  Home
                </SidebarMenuItem>
                <SidebarMenuItem>Settings</SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  it("renders links and buttons and marks the current page", () => {
    render(<App />);
    const sidebar = screen.getByRole("complementary", { name: "Main" });
    expect(within(sidebar).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(within(sidebar).getByRole("button", { name: "Settings" })).not.toHaveAttribute("aria-current");
  });

  it("collapses from the trigger and from the keyboard shortcut", async () => {
    const user = userEvent.setup();
    render(<App />);
    const sidebar = screen.getByRole("complementary", { name: "Main" });
    expect(sidebar).not.toHaveAttribute("data-collapsed");

    await user.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(sidebar).toHaveAttribute("data-collapsed");
    // The label stays available to screen readers when only the icon is visible.
    expect(within(sidebar).getByRole("link", { name: "Home" })).toBeInTheDocument();

    await user.keyboard("{Control>}b{/Control}");
    expect(sidebar).not.toHaveAttribute("data-collapsed");
  });
});

describe("NavigationMenu", () => {
  it("opens a panel of links from its trigger", async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/button" title="Button" description="Triggers an action." />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs" active>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: /Button/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Components" }));
    expect(await screen.findByRole("link", { name: /Button/ })).toHaveTextContent("Triggers an action.");
  });
});

describe("Carousel", () => {
  it("exposes slides and controls with accessible names", () => {
    render(
      <Carousel aria-label="Featured">
        <CarouselContent>
          <CarouselItem>One</CarouselItem>
          <CarouselItem>Two</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    const region = screen.getByRole("region", { name: "Featured" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(within(region).getAllByRole("group")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
  });
});

describe("Resizable", () => {
  it("renders panels with a separator between them", () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

describe("Chart", () => {
  const payload = [
    { dataKey: "desktop", value: 1200 },
    { dataKey: "mobile", value: 800, color: "#123456" },
  ];

  it("renders tooltip rows with values and nothing when inactive", () => {
    const { rerender, container } = render(<ChartTooltipContent active payload={payload} label="January" />);
    expect(screen.getByText("January")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText("desktop")).toBeInTheDocument();

    rerender(<ChartTooltipContent active={false} payload={payload} label="January" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("formats values and can hide the label", () => {
    render(
      <ChartTooltipContent
        active
        payload={payload}
        label="January"
        hideLabel
        valueFormatter={(value) => `$${String(value)}`}
      />,
    );
    expect(screen.queryByText("January")).not.toBeInTheDocument();
    expect(screen.getByText("$1200")).toBeInTheDocument();
  });

  it("renders a legend entry per series", () => {
    render(<ChartLegendContent payload={payload} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
