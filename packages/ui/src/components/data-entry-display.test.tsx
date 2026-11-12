import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { describe, expect, it, vi } from "vitest";
import {
  activeSection,
  Affix,
  Anchor,
  BackToTop,
  Blockquote,
  Cascader,
  Checkbox,
  clampNumber,
  Descriptions,
  Field,
  findMentionQuery,
  findTreeNode,
  Flex,
  FloatButton,
  FloatButtonGroup,
  Form,
  FormField,
  FormRootError,
  FormSubmit,
  formatTime,
  Grid,
  gridColumnClasses,
  Heading,
  Image,
  Input,
  InputNumber,
  List,
  ListItem,
  Mentions,
  optionsForPath,
  parseNumber,
  parseTime,
  placeTourCard,
  Popconfirm,
  QRCode,
  Result,
  Space,
  Statistic,
  Text,
  ThemeProvider,
  themeScript,
  TimePicker,
  Tour,
  Transfer,
  TreeSelect,
  useTheme,
  Watermark,
  Button,
  statusMessages,
} from "../index";

describe("Form", () => {
  const schema = z.object({
    email: z.email("Enter a valid email address."),
    terms: z.literal(true, { error: "Accept the terms." }),
  });

  function SignupForm(props: { onSubmit: (values: z.infer<typeof schema>) => Promise<void> | void }) {
    const form = useForm<z.input<typeof schema>, unknown, z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: { email: "", terms: false as unknown as true },
    });
    return (
      <Form form={form} onSubmit={props.onSubmit}>
        <FormRootError />
        <FormField name="email" label="Email" required render={({ field }) => <Input {...field} />} />
        <FormField
          name="terms"
          label="I accept the terms"
          orientation="horizontal"
          render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
        />
        <FormSubmit>Create account</FormSubmit>
      </Form>
    );
  }

  it("shows schema errors on the right fields and does not submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Create account" }));
    const email = screen.getByLabelText(/Email/);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Enter a valid email address.");
    expect(screen.getByText("Accept the terms.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values and clears errors as the user fixes them", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Create account" }));
    await user.type(screen.getByLabelText(/Email/), "ada@example.com");
    await user.click(screen.getByRole("checkbox", { name: "I accept the terms" }));
    expect(screen.queryByText("Enter a valid email address.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ email: "ada@example.com", terms: true });
  });

  it("shows a form-level error set by the submit handler", async () => {
    const user = userEvent.setup();
    function ServerForm() {
      const form = useForm<{ name: string }>({ defaultValues: { name: "Ada" } });
      return (
        <Form form={form} onSubmit={() => form.setError("root", { message: "That name is taken." })}>
          <FormRootError />
          <FormField name="name" label="Name" rules={{ required: "Enter a name." }} render={({ field }) => <Input {...field} />} />
          <FormSubmit />
        </Form>
      );
    }
    render(<ServerForm />);
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByRole("alert")).toHaveTextContent("That name is taken.");
  });
});

describe("InputNumber", () => {
  it("clamps and parses", () => {
    expect(clampNumber(12.345, 0, 10, 1)).toBe(10);
    expect(clampNumber(3.14159, undefined, undefined, 2)).toBe(3.14);
    expect(parseNumber("₹ 1,234.50")).toBe(1234.5);
    expect(parseNumber("abc")).toBeNull();
  });

  it("steps with buttons and keys, respecting min and max", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputNumber aria-label="Quantity" defaultValue={2} min={1} max={5} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });

    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    input.focus();
    await user.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    expect(input).toHaveAttribute("aria-valuenow", "5");
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it("commits typed text on blur, clamped and formatted", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputNumber aria-label="Price" max={1000} precision={2} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton", { name: "Price" });
    await user.type(input, "1234.567");
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(1000);
    expect(input).toHaveValue("1,000.00");
  });
});

describe("TimePicker", () => {
  it("parses and formats times", () => {
    expect(parseTime("09:05")).toEqual({ hour: 9, minute: 5 });
    expect(parseTime("25:00")).toBeNull();
    expect(formatTime("14:05", true)).toBe("2:05 PM");
    expect(formatTime("00:30", true)).toBe("12:30 AM");
    expect(formatTime("14:05", false)).toBe("14:05");
  });

  it("picks an hour, minute and period", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Start" hour12 minuteStep={15} defaultValue="09:00" onValueChange={onValueChange} name="start" />);
    await user.click(screen.getByRole("button", { name: "Start" }));

    await user.click(within(screen.getByRole("listbox", { name: "Minute" })).getByRole("option", { name: "30" }));
    expect(onValueChange).toHaveBeenLastCalledWith("09:30");
    await user.click(within(screen.getByRole("listbox", { name: "AM or PM" })).getByRole("option", { name: "PM" }));
    expect(onValueChange).toHaveBeenLastCalledWith("21:30");
    await user.click(within(screen.getByRole("listbox", { name: "Hour" })).getByRole("option", { name: "3" }));
    expect(onValueChange).toHaveBeenLastCalledWith("15:30");
    expect(screen.getByRole("button", { name: "Start" })).toHaveTextContent("3:30 PM");
    expect(document.querySelector('input[name="start"]')).toHaveValue("15:30");
  });
});

describe("Mentions", () => {
  it("finds the query at the caret", () => {
    expect(findMentionQuery("Hi @ad", 6)).toEqual({ start: 3, query: "ad" });
    expect(findMentionQuery("email@x", 7)).toBeNull();
    expect(findMentionQuery("@ada done", 9)).toBeNull();
  });

  it("suggests people and inserts the chosen one", async () => {
    const user = userEvent.setup();
    const onMention = vi.fn();
    render(
      <Mentions
        aria-label="Comment"
        onMention={onMention}
        options={[
          { value: "ada", label: "Ada Lovelace" },
          { value: "alan", label: "Alan Turing" },
          { value: "grace", label: "Grace Hopper" },
        ]}
      />,
    );
    const box = screen.getByRole("combobox", { name: "Comment" });
    await user.type(box, "Thanks @a");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    await user.keyboard("l");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Alan Turing");
    await user.keyboard("{Enter}");
    expect(box).toHaveValue("Thanks @alan ");
    expect(onMention).toHaveBeenCalledWith(expect.objectContaining({ value: "alan" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

const places = [
  {
    value: "in",
    label: "India",
    children: [
      { value: "gj", label: "Gujarat", children: [{ value: "surat", label: "Surat" }, { value: "ahmedabad", label: "Ahmedabad" }] },
      { value: "mh", label: "Maharashtra", children: [{ value: "pune", label: "Pune" }] },
    ],
  },
  { value: "np", label: "Nepal", disabled: true },
];

describe("Cascader", () => {
  it("resolves a path", () => {
    expect(optionsForPath(places, ["in", "gj", "surat"]).map((o) => o.label)).toEqual(["India", "Gujarat", "Surat"]);
    expect(optionsForPath(places, ["in", "nope"]).map((o) => o.label)).toEqual(["India"]);
  });

  it("walks the levels and selects a leaf", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Cascader options={places} aria-label="City" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "City" });

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "India" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("option", { name: "Gujarat" }));
    await user.click(screen.getByRole("option", { name: "Surat" }));
    expect(onValueChange.mock.calls[0]?.[0]).toEqual(["in", "gj", "surat"]);
    expect(trigger).toHaveTextContent("India / Gujarat / Surat");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Transfer", () => {
  it("moves checked items across and back", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Transfer
        onValueChange={onValueChange}
        items={[
          { key: "a", label: "Apple" },
          { key: "b", label: "Banana" },
          { key: "c", label: "Cherry", disabled: true },
        ]}
      />,
    );
    const left = screen.getByRole("region", { name: "Available" });
    await user.click(within(left).getByRole("checkbox", { name: "Apple" }));
    await user.click(screen.getByRole("button", { name: "Move checked to Selected" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["a"]);
    expect(within(screen.getByRole("region", { name: "Selected" })).getByText("Apple")).toBeInTheDocument();

    await user.click(within(left).getByRole("checkbox", { name: "Select all in Available" }));
    await user.click(screen.getByRole("button", { name: "Move checked to Selected" }));
    // The disabled item stays.
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);

    await user.type(within(screen.getByRole("region", { name: "Selected" })).getByRole("searchbox"), "ban");
    expect(within(screen.getByRole("region", { name: "Selected" })).queryByText("Apple")).not.toBeInTheDocument();
  });
});

describe("TreeSelect", () => {
  const tree = [{ id: "eng", label: "Engineering", children: [{ id: "web", label: "Web" }, { id: "ios", label: "iOS" }] }];

  it("finds nodes with their ancestors", () => {
    expect(findTreeNode(tree, "ios")).toEqual({ node: tree[0]!.children[1], ancestors: ["eng"] });
  });

  it("selects a leaf and shows its label", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TreeSelect items={tree} aria-label="Team" leavesOnly onValueChange={onValueChange} />);
    await user.click(screen.getByRole("combobox", { name: "Team" }));
    await user.click(screen.getByRole("treeitem", { name: "Engineering" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("treeitem", { name: "Web" }));
    expect(onValueChange).toHaveBeenCalledWith("web");
    expect(screen.getByRole("combobox", { name: "Team" })).toHaveTextContent("Web");
  });
});

describe("Typography", () => {
  it("keeps the heading level separate from its size", () => {
    render(
      <>
        <Heading level={1} size="lg">
          Small page title
        </Heading>
        <Text variant="lead" as="span">
          Lead
        </Text>
        <Blockquote>Quote</Blockquote>
      </>,
    );
    const heading = screen.getByRole("heading", { level: 1, name: "Small page title" });
    expect(heading).toHaveClass("text-lg");
    expect(screen.getByText("Lead").tagName).toBe("SPAN");
    expect(screen.getByText("Quote").tagName).toBe("BLOCKQUOTE");
  });
});

describe("Descriptions", () => {
  it("renders a description list", () => {
    render(<Descriptions title="Order" items={[{ label: "Status", value: "Paid" }, { label: "Total", value: "₹1,200" }]} />);
    const terms = screen.getAllByRole("term");
    expect(terms.map((term) => term.textContent)).toEqual(["Status", "Total"]);
    expect(screen.getAllByRole("definition")[1]).toHaveTextContent("₹1,200");
  });
});

describe("List", () => {
  it("renders items, an empty state and a loading state", () => {
    const { rerender } = render(
      <List aria-label="People">
        <ListItem title="Ada" description="Owner" action={<a href="/ada" />} />
      </List>,
    );
    expect(within(screen.getByRole("list", { name: "People" })).getByRole("link")).toHaveTextContent("AdaOwner");

    rerender(<List aria-label="People" empty="No people" />);
    expect(screen.getByText("No people")).toBeInTheDocument();

    rerender(<List aria-label="People" loading loadingRows={2} />);
    expect(screen.getByRole("list", { name: "People" })).toHaveAttribute("aria-busy", "true");
  });
});

describe("Statistic", () => {
  it("formats the value and explains the change in words", () => {
    render(<Statistic label="Revenue" value={48290} formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} change={-3.2} />);
    expect(screen.getByText("$48,290")).toBeInTheDocument();
    expect(screen.getByText("decrease")).toHaveClass("sr-only");
    expect(screen.getByText("3.2%")).toBeInTheDocument();
  });
});

describe("Statistic count-up", () => {
  it("always ends on the real value, even when animation frames never run", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "requestAnimationFrame", "performance"] });
    try {
      render(<Statistic label="Users" value={1200} animate />);
      act(() => {
        vi.advanceTimersByTime(1300);
      });
      expect(screen.getAllByText("1,200").length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Image", () => {
  it("shows a fallback when the image fails", () => {
    render(<Image src="/missing.png" alt="Team photo" />);
    fireEvent.error(screen.getByRole("img", { name: "Team photo" }));
    expect(screen.getByRole("img", { name: "Team photo" }).tagName).toBe("DIV");
  });

  it("opens a preview with zoom controls", async () => {
    const user = userEvent.setup();
    render(<Image src="/photo.png" alt="Team photo" preview />);
    fireEvent.load(screen.getByRole("img", { name: "Team photo" }));
    await user.click(screen.getByRole("button", { name: "Preview: Team photo" }));
    const dialog = screen.getByRole("dialog", { name: "Team photo" });
    expect(within(dialog).getByText("100%")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Zoom in" }));
    expect(within(dialog).getByText("150%")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Close preview" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("QRCode", () => {
  it("draws a scannable-sized SVG with an accessible name", () => {
    render(<QRCode value="https://example.com" size={120} />);
    const svg = screen.getByRole("img", { name: "QR code: https://example.com" });
    expect(svg).toHaveAttribute("width", "120");
    expect(svg.querySelector("path")?.getAttribute("d")?.length).toBeGreaterThan(100);
  });
});

describe("Tour", () => {
  it("places the card below, above or centred", () => {
    const viewport = { width: 1000, height: 800 };
    const card = { width: 300, height: 150 };
    expect(placeTourCard({ top: 100, left: 100, width: 200, height: 40 }, card, viewport).top).toBe(152);
    expect(placeTourCard({ top: 700, left: 100, width: 200, height: 40 }, card, viewport).top).toBe(538);
    expect(placeTourCard(null, card, viewport)).toEqual({ top: 325, left: 350 });
    // Never off the left edge.
    expect(placeTourCard({ top: 100, left: 0, width: 20, height: 20 }, card, viewport).left).toBe(12);
  });

  it("walks through steps and finishes", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    function Demo() {
      const [open, setOpen] = React.useState(true);
      return (
        <>
          <button id="new">New</button>
          <Tour
            open={open}
            onOpenChange={setOpen}
            onFinish={onFinish}
            steps={[
              { target: "#new", title: "Create things", description: "Start here." },
              { title: "All set" },
            ]}
          />
        </>
      );
    }
    render(<Demo />);
    const dialog = screen.getByRole("dialog", { name: "Create things" });
    expect(dialog).toHaveFocus();
    expect(within(dialog).getByText("1 of 2")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onFinish).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Result", () => {
  it("fills in messages for status codes", () => {
    render(<Result status={404} headingLevel={1} actions={<Button>Go home</Button>} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page not found (error 404)");
    expect(screen.getByText(statusMessages[404]!.description)).toBeInTheDocument();
  });

  it("uses an icon for named states", () => {
    render(<Result status="success" title="Payment received" />);
    expect(screen.getByRole("heading", { name: "Payment received" })).toBeInTheDocument();
  });
});

describe("Watermark", () => {
  it("overlays a hidden, non-interactive mask over the content", () => {
    const { container } = render(
      <Watermark text="Confidential">
        <p>Report</p>
      </Watermark>,
    );
    const overlay = container.querySelector("[aria-hidden]") as HTMLElement;
    expect(overlay).toHaveClass("pointer-events-none");
    expect(overlay.style.maskImage || overlay.style.webkitMaskImage).toContain("Confidential");
    expect(screen.getByText("Report")).toBeInTheDocument();
  });
});

describe("Popconfirm", () => {
  it("focuses Cancel first and waits for the confirm action", async () => {
    const user = userEvent.setup();
    let resolve: () => void = () => {};
    const onConfirm = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(
      <Popconfirm title="Delete this file?" onConfirm={onConfirm}>
        <Button>Delete</Button>
      </Popconfirm>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = screen.getByRole("alertdialog", { name: "Delete this file?" });
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus();

    await user.click(within(dialog).getByRole("button", { name: "Confirm" }));
    expect(within(dialog).getByRole("button", { name: "Confirm" })).toHaveAttribute("aria-busy", "true");
    await act(async () => resolve());
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});

describe("Layout primitives", () => {
  it("maps props to classes", () => {
    render(
      <>
        <Flex data-testid="flex" direction="column" gap={4} align="center" justify="between" wrap />
        <Grid data-testid="grid" columns={{ base: 1, md: 3 }} gap={6} />
      </>,
    );
    expect(screen.getByTestId("flex")).toHaveClass("flex", "flex-col", "gap-4", "items-center", "justify-between", "flex-wrap");
    expect(screen.getByTestId("grid")).toHaveClass("grid", "grid-cols-1", "md:grid-cols-3", "gap-6");
    expect(gridColumnClasses(4)).toBe("grid-cols-4");
  });

  it("Space puts a separator between items and skips empty ones", () => {
    render(
      <Space separator="·">
        <span>One</span>
        {false}
        <span>Two</span>
      </Space>,
    );
    expect(screen.getAllByText("·")).toHaveLength(1);
  });
});

describe("FloatButton", () => {
  it("names the button and opens a group", async () => {
    const user = userEvent.setup();
    render(
      <FloatButtonGroup label="Create">
        <FloatButton icon={<span />} label="New note" />
      </FloatButtonGroup>,
    );
    const toggle = screen.getByRole("button", { name: "Create" });
    expect(screen.queryByRole("button", { name: "New note" })).not.toBeInTheDocument();
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "New note" })).toBeVisible();
  });

  it("BackToTop appears after scrolling", () => {
    render(<BackToTop threshold={100} />);
    expect(screen.queryByRole("button", { name: "Back to top" })).not.toBeInTheDocument();
    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("button", { name: "Back to top" })).toBeInTheDocument();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });
});

describe("Anchor", () => {
  it("picks the section past the offset line", () => {
    expect(activeSection([{ id: "a", top: -200 }, { id: "b", top: 50 }, { id: "c", top: 600 }], 80)).toBe("b");
    expect(activeSection([{ id: "a", top: 200 }], 80)).toBe("a");
  });

  it("links to sections and marks the current one", async () => {
    const user = userEvent.setup();
    window.scrollTo = vi.fn();
    render(
      <>
        <Anchor links={[{ id: "intro", title: "Intro" }, { id: "usage", title: "Usage" }]} />
        <section id="intro">Intro</section>
        <section id="usage">Usage</section>
      </>,
    );
    const usage = screen.getByRole("link", { name: "Usage" });
    expect(usage).toHaveAttribute("href", "#usage");
    await user.click(usage);
    expect(usage).toHaveAttribute("aria-current", "location");
    expect(document.getElementById("usage")).toHaveFocus();
  });
});

describe("Affix", () => {
  it("sticks at the offset", () => {
    render(<Affix offsetTop={64}>Toolbar</Affix>);
    const affix = screen.getByText("Toolbar");
    expect(affix).toHaveClass("sticky");
    expect(affix.style.top).toBe("64px");
  });
});

describe("ThemeProvider", () => {
  function Toggle() {
    const { resolvedTheme, setTheme } = useTheme();
    return <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>{resolvedTheme}</button>;
  }

  it("switches the dark class, remembers the choice and applies tokens", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    render(
      <ThemeProvider defaultTheme="light" tokens={{ "--bx-radius": "2px" }}>
        <Toggle />
      </ThemeProvider>,
    );
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.style.getPropertyValue("--bx-radius")).toBe("2px");
    await user.click(screen.getByRole("button", { name: "light" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("blox-theme")).toBe("dark");
    document.documentElement.classList.remove("dark");
  });

  it("produces a pre-paint script", () => {
    expect(themeScript("key")).toContain('localStorage.getItem("key")');
  });

  it("keeps themeScript out of client-only files, so a server layout can call it", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    // Tests run from the package folder.
    const source = readFileSync(join(process.cwd(), "src/lib/theme-script.ts"), "utf8");
    expect(source).not.toMatch(/^s*["']use client["']/);
    const provider = readFileSync(join(process.cwd(), "src/components/theme-provider.tsx"), "utf8");
    expect(provider).not.toMatch(/export function themeScript/);
  });
});

describe("Field integration", () => {
  it("labels the new controls", () => {
    render(
      <>
        <Field label="Quantity">
          <InputNumber />
        </Field>
        <Field label="Start time">
          <TimePicker />
        </Field>
      </>,
    );
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start time" })).toBeInTheDocument();
  });
});
