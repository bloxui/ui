import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Button,
  ButtonGroup,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Empty,
  Field,
  getPaginationRange,
  InputOTP,
  Pagination,
  ScrollArea,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
  Toaster,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "../index";

describe("Tabs", () => {
  function Demo() {
    return (
      <Tabs defaultValue="account">
        <TabsList aria-label="Settings">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team" disabled>
            Team
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="billing">Billing panel</TabsContent>
        <TabsContent value="team">Team panel</TabsContent>
      </Tabs>
    );
  }

  it("shows the selected panel and switches on click", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account panel");

    await user.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing panel");
  });

  it("moves between tabs with arrow keys, skipping disabled ones", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    screen.getByRole("tab", { name: "Account" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus();
  });
});

describe("Accordion", () => {
  it("opens one item at a time and can collapse", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>What is Blox UI?</AccordionTrigger>
          <AccordionContent>A component library.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger headingLevel="h4">Is it free?</AccordionTrigger>
          <AccordionContent>Yes, MIT licensed.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const first = screen.getByRole("button", { name: "What is Blox UI?" });
    const second = screen.getByRole("button", { name: "Is it free?" });
    expect(screen.getByRole("heading", { level: 3, name: "What is Blox UI?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "Is it free?" })).toBeInTheDocument();

    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("A component library.")).toBeVisible();

    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");

    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Collapsible", () => {
  it("shows and hides its content", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Show details</CollapsibleTrigger>
        <CollapsibleContent>Hidden details</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show details" }));
    expect(screen.getByText("Hidden details")).toBeInTheDocument();
  });
});

describe("Breadcrumb", () => {
  it("inserts separators between items and marks the current page", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Button</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getAllByRole("link")).toHaveLength(2);
    expect(nav.querySelectorAll("li[aria-hidden]")).toHaveLength(2);
    expect(screen.getByText("Button")).toHaveAttribute("aria-current", "page");
    // Separators are hidden, so only the three real items are announced.
    expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
  });

  it("accepts a custom separator", () => {
    render(
      <Breadcrumb separator="/">
        <BreadcrumbItem>One</BreadcrumbItem>
        <BreadcrumbItem>Two</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(screen.getByText("/")).toBeInTheDocument();
  });
});

describe("Pagination", () => {
  it("computes page ranges with ellipses", () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
    expect(getPaginationRange(6, 20)).toEqual([1, "ellipsis", 5, 6, 7, "ellipsis", 20]);
    expect(getPaginationRange(20, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
    expect(getPaginationRange(10, 20, 2)).toEqual([1, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 20]);
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it("keeps the same number of slots on every page", () => {
    const lengths = new Set(
      Array.from({ length: 20 }, (_, index) => getPaginationRange(index + 1, 20).length),
    );
    expect(lengths.size).toBe(1);
  });

  it("marks the current page and disables the edges", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination page={1} count={10} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    await user.click(screen.getByRole("button", { name: "Page 10" }));
    expect(onPageChange).toHaveBeenLastCalledWith(10);

    rerender(<Pagination page={10} count={10} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });
});

describe("Table", () => {
  it("renders an accessible table with column headers and a caption", () => {
    render(
      <Table striped dense>
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead numeric>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>INV-001</TableCell>
            <TableCell numeric>250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole("table", { name: "Recent invoices" });
    expect(table).toHaveAttribute("data-striped");
    expect(table).toHaveAttribute("data-dense");
    expect(screen.getByRole("columnheader", { name: "Amount" })).toHaveClass("text-right");
    expect(screen.getByRole("cell", { name: "250.00" })).toHaveClass("tabular-nums");
  });
});

describe("Toggle", () => {
  it("switches its pressed state", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );
    const toggle = screen.getByRole("button", { name: "Bold" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});

describe("ToggleGroup", () => {
  it("allows one selection in single mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" defaultValue="left" aria-label="Alignment" onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole("radio", { name: "Center" }));
    expect(onValueChange).toHaveBeenCalledWith("center");
    expect(screen.getByRole("radio", { name: "Center" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Left" })).not.toBeChecked();
  });

  it("allows several selections in multiple mode and passes its style to items", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="multiple" variant="outline" size="sm" aria-label="Formatting">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    await user.click(screen.getByRole("button", { name: "Italic" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Bold" })).toHaveClass("h-8", "border");
  });
});

describe("Layout helpers", () => {
  it("ScrollArea exposes a focusable viewport with its content", () => {
    render(<ScrollArea className="h-20">Long content</ScrollArea>);
    const viewport = screen.getByText("Long content").closest("[tabindex]");
    expect(viewport).toHaveAttribute("tabindex", "0");
  });

  it("AspectRatio sets the ratio", () => {
    const { container } = render(<AspectRatio ratio={16 / 9} />);
    // Browsers normalise the number to "width / 1".
    expect(parseFloat((container.firstChild as HTMLElement).style.aspectRatio)).toBeCloseTo(16 / 9, 3);
  });

  it("ButtonGroup groups its buttons", () => {
    render(
      <ButtonGroup aria-label="History">
        <Button>Undo</Button>
        <Button>Redo</Button>
      </ButtonGroup>,
    );
    expect(within(screen.getByRole("group", { name: "History" })).getAllByRole("button")).toHaveLength(2);
  });

  it("Empty shows a heading, description and actions", () => {
    render(
      <Empty
        title="No projects yet"
        description="Create one to get started."
        headingLevel="h2"
        actions={<Button>New project</Button>}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "No projects yet" })).toBeInTheDocument();
    expect(screen.getByText("Create one to get started.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New project" })).toBeInTheDocument();
  });
});

describe("Toast", () => {
  it("shows a message from anywhere via toast()", async () => {
    render(<Toaster />);
    React.act(() => {
      toast.success("Profile saved");
    });
    expect(await screen.findByText("Profile saved")).toBeInTheDocument();
  });
});

describe("Combobox", () => {
  const options = [
    { value: "next", label: "Next.js" },
    { value: "vite", label: "Vite", keywords: ["bundler"] },
    { value: "astro", label: "Astro", disabled: true },
  ];

  it("is labelled by its Field and shows the placeholder", () => {
    render(
      <Field label="Framework" error="Pick one.">
        <Combobox options={options} placeholder="Choose a framework" />
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: "Framework" });
    expect(trigger).toHaveTextContent("Choose a framework");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Pick one.");
  });

  it("filters by label and keywords, then selects and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={options} aria-label="Framework" name="framework" onValueChange={onValueChange} />);

    const trigger = screen.getByRole("combobox", { name: "Framework" });
    await user.click(trigger);
    await user.type(screen.getByPlaceholderText("Search"), "bundler");
    expect(screen.getByRole("option", { name: "Vite" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Next.js" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Vite" }));
    expect(onValueChange).toHaveBeenCalledWith("vite");
    expect(trigger).toHaveTextContent("Vite");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.querySelector('input[name="framework"]')).toHaveValue("vite");
  });

  it("clears the selection only when clearable", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Combobox options={options} defaultValue="next" aria-label="Framework" onValueChange={onValueChange} />,
    );
    const trigger = screen.getByRole("combobox", { name: "Framework" });

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Next.js" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent("Next.js");

    rerender(
      <Combobox options={options} defaultValue="next" clearable aria-label="Framework" onValueChange={onValueChange} />,
    );
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Next.js" }));
    expect(onValueChange).toHaveBeenCalledWith("");
    expect(trigger).toHaveTextContent("Select an option");
  });
});

describe("InputOTP", () => {
  it("fills the boxes, rejects other characters and reports completion", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onChange = vi.fn();
    render(<InputOTP length={4} groupSize={2} aria-label="Code" onChange={onChange} onComplete={onComplete} />);

    const input = screen.getByRole("textbox", { name: "Code" });
    expect(document.querySelectorAll("[data-slot=input-otp-slot]")).toHaveLength(4);

    await user.type(input, "12ab34");
    expect(input).toHaveValue("1234");
    expect(onChange).toHaveBeenLastCalledWith("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });
});
