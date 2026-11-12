import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  acceptsFile,
  ChatInput,
  ChatMessage,
  ChatMessages,
  ColorPicker,
  countryFlag,
  Field,
  FileUpload,
  flattenVisible,
  formatBytes,
  formatPhone,
  hexToHsv,
  hsvToHex,
  Kanban,
  type KanbanColumn,
  moveCard,
  MultiSelect,
  parseHex,
  parsePhone,
  defaultCountries,
  PhoneInput,
  Rating,
  Stepper,
  stepState,
  Timeline,
  TreeView,
  type TreeNode,
} from "../index";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", keywords: ["red"] },
  { value: "durian", label: "Durian", disabled: true },
];

describe("MultiSelect", () => {
  it("adds and removes options from the list and from the chips", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Field label="Fruit">
        <MultiSelect options={fruits} onValueChange={onValueChange} name="fruit" />
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Apple" }));
    await user.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["apple", "cherry"]);
    // The list stays open so several can be picked.
    expect(screen.getByRole("option", { name: /Apple, selected/ })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(trigger).toHaveTextContent("2 selected");
    expect([...document.querySelectorAll('input[name="fruit"]')].map((input) => (input as HTMLInputElement).value)).toEqual([
      "apple",
      "cherry",
    ]);

    await user.click(screen.getByRole("button", { name: "Remove Apple" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["cherry"]);
  });

  it("searches keywords and respects maxSelected", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={fruits} aria-label="Fruit" defaultValue={["apple"]} maxSelected={1} />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("aria-disabled", "true");

    await user.type(screen.getByPlaceholderText("Search"), "red");
    expect(screen.getByRole("option", { name: "Cherry" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Apple/ })).not.toBeInTheDocument();
  });

  it("collapses extra chips into a count", () => {
    render(<MultiSelect options={fruits} aria-label="Fruit" defaultValue={["apple", "banana", "cherry"]} maxVisible={2} />);
    expect(screen.getByText("+1 more")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove Cherry" })).not.toBeInTheDocument();
  });
});

describe("FileUpload", () => {
  const file = (name: string, size: number, type: string) => new File(["x".repeat(size)], name, { type });

  it("formats sizes and matches accept rules", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
    expect(acceptsFile({ name: "a.PNG", type: "image/png" }, "image/*")).toBe(true);
    expect(acceptsFile({ name: "a.pdf", type: "application/pdf" }, "image/*,.pdf")).toBe(true);
    expect(acceptsFile({ name: "a.zip", type: "application/zip" }, "image/*,.pdf")).toBe(false);
    expect(acceptsFile({ name: "a.zip", type: "application/zip" })).toBe(true);
  });

  it("adds valid files, rejects the rest with a reason, and removes files", async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onFilesAdded = vi.fn();
    render(
      <Field label="Attachments">
        <FileUpload accept="image/*" maxSize={1000} maxFiles={2} onFilesAdded={onFilesAdded} />
      </Field>,
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, [
      file("photo.png", 10, "image/png"),
      file("notes.txt", 10, "text/plain"),
      file("huge.png", 5000, "image/png"),
    ]);

    expect(onFilesAdded).toHaveBeenCalledOnce();
    expect(onFilesAdded.mock.calls[0]?.[0]).toHaveLength(1);
    const list = screen.getByRole("list", { name: "Selected files" });
    expect(within(list).getByText("photo.png")).toBeInTheDocument();
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("notes.txt: this type of file is not allowed.");
    expect(alert).toHaveTextContent("huge.png: larger than");
    // Inside a Field the button takes the field label as its name.
    expect(screen.getByRole("button", { name: "Attachments" })).toHaveAccessibleDescription(/not allowed/);

    await user.click(screen.getByRole("button", { name: "Remove photo.png" }));
    expect(screen.queryByRole("list", { name: "Selected files" })).not.toBeInTheDocument();
  });

  it("accepts dropped files and enforces maxFiles", () => {
    const onFilesChange = vi.fn();
    render(<FileUpload maxFiles={1} onFilesChange={onFilesChange} />);
    const zone = screen.getByRole("presentation");
    fireEvent.drop(zone, { dataTransfer: { files: [file("a.txt", 1, "text/plain"), file("b.txt", 1, "text/plain")] } });
    expect(onFilesChange.mock.calls[0]?.[0]).toHaveLength(1);
    expect(screen.getByRole("alert")).toHaveTextContent("b.txt: you can add up to 1 files.");
  });

  it("shows progress and errors passed in from outside", () => {
    render(
      <FileUpload
        files={[
          { id: "1", file: file("a.png", 1, "image/png"), progress: 40 },
          { id: "2", file: file("b.png", 1, "image/png"), error: "Upload failed." },
        ]}
      />,
    );
    expect(screen.getByRole("progressbar", { name: "Uploading a.png" })).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByText("Upload failed.")).toBeInTheDocument();
  });
});

describe("Stepper", () => {
  const steps = [{ title: "Account" }, { title: "Profile" }, { title: "Done" }];

  it("works out each step's state", () => {
    expect([0, 1, 2].map((index) => stepState(index, 1))).toEqual(["complete", "current", "upcoming"]);
  });

  it("marks the current step and lets finished steps be revisited", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} current={1} onStepClick={onStepClick} />);
    const items = within(screen.getByRole("list", { name: "Progress" })).getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveTextContent("(completed)");

    expect(screen.getAllByRole("button")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: /Account/ }));
    expect(onStepClick).toHaveBeenCalledWith(0);
  });
});

describe("Rating", () => {
  it("sets the value by click and with arrow keys, and can be cleared", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating aria-label="Quality" clearable onValueChange={onValueChange} labels={["Bad", "Poor", "OK", "Good", "Great"]} />);
    const group = screen.getByRole("radiogroup", { name: "Quality" });

    await user.click(within(group).getByRole("radio", { name: "Good" }));
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    expect(within(group).getByRole("radio", { name: "Good" })).toBeChecked();

    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    expect(within(group).getByRole("radio", { name: "Great" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(1);

    await user.click(within(group).getByRole("radio", { name: "Bad" }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("keeps a single tab stop", () => {
    render(<Rating aria-label="Quality" defaultValue={3} />);
    const tabbable = screen.getAllByRole("radio").filter((radio) => radio.tabIndex === 0);
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveAccessibleName("3 stars");
  });

  it("reads out a read-only value", () => {
    render(<Rating readOnly value={3.5} aria-label="Average" />);
    expect(screen.getByRole("img", { name: "Average: 3.5 out of 5" })).toBeInTheDocument();
  });
});

describe("Timeline", () => {
  it("renders events in order with machine-readable times", () => {
    render(
      <Timeline
        items={[
          { title: "Order placed", time: new Date("2026-01-05T10:00:00Z") },
          { title: "Shipped", description: "Left the warehouse.", time: "Today" },
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByText("Order placed")).toBeInTheDocument();
    expect(items[0]!.querySelector("time")).toHaveAttribute("dateTime", "2026-01-05T10:00:00.000Z");
    expect(within(items[1]!).getByText("Today")).toBeInTheDocument();
  });
});

const tree: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "app", label: "app.tsx" },
      { id: "lib", label: "lib", children: [{ id: "utils", label: "utils.ts" }] },
    ],
  },
  { id: "readme", label: "README.md" },
];

describe("TreeView", () => {
  it("lists only the visible nodes", () => {
    expect(flattenVisible(tree, new Set()).map((entry) => entry.node.id)).toEqual(["src", "readme"]);
    expect(flattenVisible(tree, new Set(["src"])).map((entry) => entry.node.id)).toEqual(["src", "app", "lib", "readme"]);
  });

  it("follows the tree keyboard pattern", async () => {
    const user = userEvent.setup();
    const onSelectedIdChange = vi.fn();
    render(<TreeView items={tree} aria-label="Files" onSelectedIdChange={onSelectedIdChange} />);
    const src = screen.getByRole("treeitem", { name: "src" });
    expect(src).toHaveAttribute("aria-expanded", "false");
    expect(src).toHaveAttribute("tabindex", "0");

    src.focus();
    await user.keyboard("{ArrowRight}");
    expect(src).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("treeitem", { name: "app.tsx" })).toHaveFocus();
    expect(screen.getByRole("treeitem", { name: "app.tsx" })).toHaveAttribute("aria-level", "2");

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelectedIdChange).toHaveBeenLastCalledWith("lib");
    expect(screen.getByRole("treeitem", { name: "lib" })).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(src).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveFocus();
    await user.keyboard("a");
    expect(screen.getByRole("treeitem", { name: "app.tsx" })).toHaveFocus();
  });
});

describe("PhoneInput", () => {
  it("formats, parses and builds flags", () => {
    expect(formatPhone("9876543210", [5, 5])).toBe("98765 43210");
    expect(formatPhone("98765", [5, 5])).toBe("98765");
    expect(formatPhone("123456789012", [5, 5])).toBe("12345 67890 12");
    expect(parsePhone("+919876543210", defaultCountries)).toEqual({
      country: defaultCountries[0],
      national: "9876543210",
    });
    expect(parsePhone("+14155550100", defaultCountries, "CA")?.country.code).toBe("CA");
    expect(countryFlag("in")).toBe("🇮🇳");
  });

  it("emits an E.164 value as the user types and keeps only digits", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput onValueChange={onValueChange} name="phone" />);
    const input = screen.getByRole("textbox", { name: "Phone number" });

    await user.type(input, "98a765-43210");
    expect(onValueChange).toHaveBeenLastCalledWith("+919876543210");
    expect(input).toHaveValue("98765 43210");
    expect(document.querySelector('input[name="phone"]')).toHaveValue("+919876543210");
  });

  it("switches country from the picker and from a pasted number", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput defaultValue="+919876543210" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: /Country: India/ }));
    await user.type(screen.getByPlaceholderText("Search country"), "united king");
    await user.click(screen.getByRole("option", { name: /United Kingdom/ }));
    expect(onValueChange).toHaveBeenLastCalledWith("+449876543210");

    const input = screen.getByRole("textbox", { name: "Phone number" });
    await user.clear(input);
    await user.click(input);
    await user.paste("+1 415 555 0100");
    expect(onValueChange).toHaveBeenLastCalledWith("+14155550100");
  });
});

describe("ColorPicker", () => {
  it("converts between hex and HSV", () => {
    expect(parseHex("#f00")).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseHex("nope")).toBeNull();
    expect(hsvToHex({ h: 0, s: 1, v: 1 })).toBe("#ff0000");
    expect(hsvToHex({ h: 120, s: 1, v: 1 })).toBe("#00ff00");
    for (const hex of ["#6366f1", "#14b8a6", "#000000", "#ffffff", "#ff8800"]) {
      expect(hsvToHex(hexToHsv(hex)!)).toBe(hex);
    }
  });

  it("changes colour from swatches, the hex field and the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Field label="Brand colour">
        <ColorPicker defaultValue="#ff0000" onValueChange={onValueChange} name="brand" />
      </Field>,
    );
    await user.click(screen.getByRole("button", { name: /Brand colour|Colour: #ff0000/ }));

    await user.click(screen.getByRole("button", { name: "#3b82f6" }));
    expect(onValueChange).toHaveBeenLastCalledWith("#3b82f6");

    const hex = screen.getByRole("textbox", { name: "Hex" });
    await user.clear(hex);
    await user.type(hex, "#00ff00");
    expect(onValueChange).toHaveBeenLastCalledWith("#00ff00");

    screen.getByRole("slider", { name: "Hue" }).focus();
    await user.keyboard("{Shift>}{ArrowRight}{/Shift}");
    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute("aria-valuenow", "130");
    expect(document.querySelector('input[name="brand"]')).toHaveValue(onValueChange.mock.lastCall?.[0]);

    screen.getByRole("slider", { name: "Saturation and brightness" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(hexToHsv(onValueChange.mock.lastCall?.[0])!.v).toBeCloseTo(0.99, 2);
  });
});

const board: KanbanColumn[] = [
  { id: "todo", title: "To do", cards: [{ id: "a", title: "Write docs" }, { id: "b", title: "Fix bug" }] },
  { id: "doing", title: "Doing", cards: [{ id: "c", title: "Review PR" }], limit: 2 },
  { id: "done", title: "Done", cards: [] },
];

function Board(props: { onCardMove?: (move: unknown) => void }) {
  const [columns, setColumns] = React.useState(board);
  return <Kanban columns={columns} onColumnsChange={setColumns} onCardMove={props.onCardMove} />;
}

const cardsIn = (column: string) =>
  within(screen.getByRole("region", { name: new RegExp(`^${column},`) }))
    .queryAllByRole("listitem")
    .map((item) => item.querySelector("[data-kanban-card] p")?.textContent)
    .filter(Boolean);

describe("Kanban", () => {
  it("moves cards immutably and clamps the index", () => {
    const next = moveCard(board, "a", "done", 99);
    expect(next.find((column) => column.id === "done")!.cards.map((card) => card.id)).toEqual(["a"]);
    expect(board[0]!.cards).toHaveLength(2);
    expect(moveCard(board, "missing", "done", 0)).toBe(board);
  });

  it("moves a card with the keyboard and announces it", async () => {
    const user = userEvent.setup();
    const onCardMove = vi.fn();
    render(<Board onCardMove={onCardMove} />);
    const card = screen.getByText("Write docs").closest("[data-kanban-card]") as HTMLElement;

    card.focus();
    await user.keyboard(" ");
    expect(card).toHaveAttribute("aria-pressed", "true");
    await user.keyboard("{ArrowDown}");
    expect(cardsIn("To do")).toEqual(["Fix bug", "Write docs"]);
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(cardsIn("Done")).toEqual(["Write docs"]);
    expect(onCardMove).toHaveBeenLastCalledWith({ cardId: "a", from: "doing", to: "done", index: 0 });
    expect(screen.getByText(/Write docs moved to Done, position 1/)).toBeInTheDocument();
    await user.keyboard(" ");
    expect(screen.getByText(/dropped in Done/)).toBeInTheDocument();
  });

  it("puts the card back on Escape and refuses full columns", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const card = screen.getByText("Write docs").closest("[data-kanban-card]") as HTMLElement;
    card.focus();
    await user.keyboard(" {ArrowRight}");
    expect(cardsIn("Doing")).toEqual(["Write docs", "Review PR"]);
    await user.keyboard("{Escape}");
    expect(cardsIn("To do")).toEqual(["Write docs", "Fix bug"]);

    // Doing now holds 1 of 2; fill it, then the next move is refused.
    const second = screen.getByText("Fix bug").closest("[data-kanban-card]") as HTMLElement;
    second.focus();
    await user.keyboard(" {ArrowRight} ");
    const first = screen.getByText("Write docs").closest("[data-kanban-card]") as HTMLElement;
    first.focus();
    await user.keyboard(" {ArrowRight}");
    expect(cardsIn("Doing")).toHaveLength(2);
    expect(screen.getByText("Doing is full.")).toBeInTheDocument();
  });
});

describe("Kanban touch drag", () => {
  function pointer(type: "pointerDown" | "pointerMove" | "pointerUp", element: Element, x: number, y: number) {
    fireEvent[type](element, { pointerType: "touch", pointerId: 1, clientX: x, clientY: y });
  }

  it("lifts a card after a long press and drops it where the finger lets go", () => {
    vi.useFakeTimers();
    try {
      const onCardMove = vi.fn();
      render(<Board onCardMove={onCardMove} />);
      const card = screen.getByText("Write docs").closest("[data-kanban-card]") as HTMLElement;
      const done = document.querySelector('[data-kanban-column="done"]') as HTMLElement;
      const spy = vi.spyOn(document, "elementFromPoint").mockReturnValue(done);

      pointer("pointerDown", card, 10, 10);
      act(() => {
        vi.advanceTimersByTime(350);
      });
      expect(card).toHaveClass("opacity-40");
      pointer("pointerMove", card, 600, 40);
      pointer("pointerUp", card, 600, 40);

      expect(onCardMove).toHaveBeenCalledWith({ cardId: "a", from: "todo", to: "done", index: 0 });
      expect(cardsIn("Done")).toEqual(["Write docs"]);
      spy.mockRestore();
    } finally {
      vi.useRealTimers();
    }
  });

  it("drags with the mouse as soon as it moves, without a long press", () => {
    const onCardMove = vi.fn();
    render(<Board onCardMove={onCardMove} />);
    const card = screen.getByText("Fix bug").closest("[data-kanban-card]") as HTMLElement;
    const doing = document.querySelector('[data-kanban-column="doing"]') as HTMLElement;
    const spy = vi.spyOn(document, "elementFromPoint").mockReturnValue(doing);
    const mouse = (type: "pointerDown" | "pointerMove" | "pointerUp", x: number, y: number) =>
      fireEvent[type](card, { pointerType: "mouse", pointerId: 2, button: 0, clientX: x, clientY: y });

    mouse("pointerDown", 10, 10);
    mouse("pointerMove", 12, 11);
    expect(card).not.toHaveClass("opacity-40");
    mouse("pointerMove", 300, 40);
    expect(card).toHaveClass("opacity-40");
    mouse("pointerUp", 300, 40);

    expect(onCardMove).toHaveBeenCalledWith({ cardId: "b", from: "todo", to: "doing", index: 1 });
    spy.mockRestore();
  });

  it("ignores the right mouse button", () => {
    render(<Board />);
    const card = screen.getByText("Fix bug").closest("[data-kanban-card]") as HTMLElement;
    fireEvent.pointerDown(card, { pointerType: "mouse", pointerId: 3, button: 2, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(card, { pointerType: "mouse", pointerId: 3, clientX: 200, clientY: 10 });
    expect(card).not.toHaveClass("opacity-40");
  });

  it("treats a quick swipe as scrolling, not dragging", () => {
    vi.useFakeTimers();
    try {
      const onCardMove = vi.fn();
      render(<Board onCardMove={onCardMove} />);
      const card = screen.getByText("Write docs").closest("[data-kanban-card]") as HTMLElement;

      pointer("pointerDown", card, 10, 10);
      pointer("pointerMove", card, 10, 60);
      act(() => {
        vi.advanceTimersByTime(350);
      });
      expect(card).not.toHaveClass("opacity-40");
      pointer("pointerUp", card, 10, 60);
      expect(onCardMove).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Chat", () => {
  it("sends on Enter, adds a line on Shift+Enter, and clears", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    const box = screen.getByRole("textbox", { name: "Message" });
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();

    await user.type(box, "Hello{Shift>}{Enter}{/Shift}there");
    expect(box).toHaveValue("Hello\nthere");
    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("Hello\nthere");
    expect(box).toHaveValue("");
  });

  it("shows a stop button while loading", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(<ChatInput onSubmit={() => {}} loading onStop={onStop} />);
    await user.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it("labels who said each message inside a live log", () => {
    render(
      <ChatMessages>
        <ChatMessage role="user" content="What is Blox UI?" />
        <ChatMessage role="assistant" content="A component library." copyText="A component library." />
      </ChatMessages>,
    );
    const log = screen.getByRole("log");
    expect(within(log).getByText("You said:")).toBeInTheDocument();
    expect(within(log).getByText("Assistant said:")).toBeInTheDocument();
    expect(within(log).getByRole("button", { name: "Copy message" })).toBeInTheDocument();
  });

  it("keeps the newest message in view", () => {
    const { rerender } = render(<ChatMessages>{[<ChatMessage key="1" role="user" content="One" />]}</ChatMessages>);
    const log = screen.getByRole("log");
    Object.defineProperty(log, "scrollHeight", { configurable: true, value: 900 });
    act(() => {
      rerender(<ChatMessages>{[<ChatMessage key="1" role="user" content="One" />, <ChatMessage key="2" role="assistant" content="Two" />]}</ChatMessages>);
    });
    expect(log.scrollTop).toBe(900);
  });
});
