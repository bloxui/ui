import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Badge,
  Field,
  Kbd,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  SkeletonText,
  Slider,
  Textarea,
} from "../index";

function FrameworkSelect(props: { onValueChange?: (value: string) => void; error?: string }) {
  return (
    <Field label="Framework" error={props.error}>
      <Select onValueChange={props.onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="vite">Vite</SelectItem>
          <SelectItem value="astro" disabled>
            Astro
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}

describe("Select", () => {
  it("is labelled by its Field and shows the placeholder", () => {
    render(<FrameworkSelect />);
    expect(screen.getByRole("combobox", { name: "Framework" })).toHaveTextContent("Choose one");
  });

  it("opens, lets the user pick an option and reports the value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FrameworkSelect onValueChange={onValueChange} />);

    const trigger = screen.getByRole("combobox", { name: "Framework" });
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Vite" }));

    expect(onValueChange).toHaveBeenCalledWith("vite");
    expect(trigger).toHaveTextContent("Vite");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks disabled options", async () => {
    const user = userEvent.setup();
    render(<FrameworkSelect />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Astro" })).toHaveAttribute("aria-disabled", "true");
  });

  it("is marked invalid by a Field error", () => {
    render(<FrameworkSelect error="Pick a framework." />);
    const trigger = screen.getByRole("combobox", { name: "Framework" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Pick a framework.");
  });
});

describe("Slider", () => {
  it("moves with the keyboard and respects step, min and max", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider defaultValue={[50]} step={10} aria-label="Volume" onValueChange={onValueChange} />);

    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "50");

    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([60]);
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith([100]);
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith([0]);
  });

  it("renders one named thumb per value for a range", () => {
    render(<Slider defaultValue={[20, 70]} thumbLabels={["Minimum price", "Maximum price"]} />);
    expect(screen.getByRole("slider", { name: "Minimum price" })).toHaveAttribute("aria-valuenow", "20");
    expect(screen.getByRole("slider", { name: "Maximum price" })).toHaveAttribute("aria-valuenow", "70");
  });
});

describe("RadioGroup", () => {
  function Plans(props: { onValueChange?: (value: string) => void }) {
    return (
      <RadioGroup defaultValue="free" aria-label="Plan" onValueChange={props.onValueChange}>
        <RadioGroupItem value="free" aria-label="Free" />
        <RadioGroupItem value="pro" aria-label="Pro" />
        <RadioGroupItem value="team" aria-label="Team" disabled />
      </RadioGroup>
    );
  }

  it("selects one option at a time", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);

    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(within(group).getByRole("radio", { name: "Free" })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: "Pro" }));
    expect(onValueChange).toHaveBeenCalledWith("pro");
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "Team" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Team" })).toBeDisabled();
  });
});

describe("Textarea autoResize", () => {
  const scrollHeight = vi.spyOn(HTMLTextAreaElement.prototype, "scrollHeight", "get");
  afterEach(() => {
    scrollHeight.mockReset();
  });

  it("sets its height to fit the content on mount and as the user types", async () => {
    scrollHeight.mockReturnValue(80);
    const user = userEvent.setup();
    render(<Textarea autoResize aria-label="Bio" />);
    const textarea = screen.getByRole("textbox", { name: "Bio" });
    expect(textarea.style.height).toBe("80px");

    scrollHeight.mockReturnValue(140);
    await user.type(textarea, "A much longer bio");
    expect(textarea.style.height).toBe("140px");
  });

  it("leaves the height alone without autoResize", async () => {
    scrollHeight.mockReturnValue(140);
    const user = userEvent.setup();
    render(<Textarea aria-label="Bio" />);
    const textarea = screen.getByRole("textbox", { name: "Bio" });
    await user.type(textarea, "Hello");
    expect(textarea.style.height).toBe("");
  });

  it("still forwards ref and onInput", async () => {
    scrollHeight.mockReturnValue(80);
    const ref = { current: null as HTMLTextAreaElement | null };
    const onInput = vi.fn();
    render(<Textarea autoResize ref={ref} onInput={onInput} aria-label="Bio" />);
    await userEvent.type(screen.getByRole("textbox"), "a");
    expect(ref.current).toBe(screen.getByRole("textbox"));
    expect(onInput).toHaveBeenCalledOnce();
  });
});

describe("Badge", () => {
  it("renders its label, with a decorative dot when asked", () => {
    const { rerender } = render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft").querySelector("[aria-hidden]")).toBeNull();

    rerender(<Badge dot>Draft</Badge>);
    expect(screen.getByText("Draft").querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("lets className override the defaults", () => {
    render(<Badge className="rounded-md">Beta</Badge>);
    const badge = screen.getByText("Beta");
    expect(badge).toHaveClass("rounded-md");
    expect(badge).not.toHaveClass("rounded-full");
  });
});

describe("Separator", () => {
  it("is decorative by default and a real separator on request", () => {
    const { rerender } = render(<Separator />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();

    rerender(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("shows a label between two lines", () => {
    render(<Separator decorative={false}>or</Separator>);
    expect(screen.getByRole("separator")).toHaveTextContent("or");
  });
});

describe("Skeleton", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<Skeleton className="h-4 w-20" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the requested number of lines with a shorter last line", () => {
    const { container } = render(<SkeletonText lines={4} />);
    const lines = container.querySelectorAll("[data-slot=skeleton]");
    expect(lines).toHaveLength(4);
    expect(lines[3]).toHaveClass("w-3/5");
    expect(lines[0]).toHaveClass("w-full");
  });
});

describe("Kbd", () => {
  it("renders a kbd element", () => {
    render(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText("Ctrl").tagName).toBe("KBD");
  });
});
