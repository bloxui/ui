import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Button,
  Checkbox,
  Field,
  getInitials,
  Input,
  Progress,
  Switch,
  Textarea,
} from "../index";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("is disabled and busy while loading", () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("renders its child element with asChild", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).not.toHaveAttribute("type");
  });
});

describe("Field", () => {
  it("connects the label and hint to the control", () => {
    render(
      <Field label="Email" hint="We never share it.">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("We never share it.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("marks the control invalid and describes it with the error", () => {
    render(
      <Field label="Email" hint="We never share it." error="Enter a valid email." required>
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("Enter a valid email.");
    expect(screen.queryByText("We never share it.")).not.toBeInTheDocument();
  });

  it("works with Textarea, Checkbox and Switch", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Field label="Bio">
          <Textarea />
        </Field>
        <Field label="Accept terms" orientation="horizontal">
          <Checkbox />
        </Field>
        <Field label="Notifications" orientation="horizontal">
          <Switch />
        </Field>
      </>,
    );
    expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    await user.click(screen.getByText("Accept terms"));
    expect(checkbox).toBeChecked();

    const toggle = screen.getByRole("switch", { name: "Notifications" });
    await user.click(toggle);
    expect(toggle).toBeChecked();
  });

  it("uses the id given to Field for the control", () => {
    render(
      <Field label="Name" id="custom">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "custom");
  });
});

describe("Checkbox", () => {
  it("exposes the indeterminate state", () => {
    render(<Checkbox checked="indeterminate" aria-label="Select all" onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute("aria-checked", "mixed");
  });
});

describe("Avatar", () => {
  it("derives initials from a name", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
    expect(getInitials("  grace   brewster hopper ")).toBe("GH");
    expect(getInitials("Ada")).toBe("A");
    expect(getInitials("")).toBe("");
  });

  it("shows initials when there is no image", () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent("AL");
  });

  it("collapses extra avatars into a counter", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Alan Turing" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Linus Torvalds" />
      </AvatarGroup>,
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.queryByText("GH")).not.toBeInTheDocument();
  });
});

describe("Alert", () => {
  it("announces danger assertively and others politely", () => {
    render(
      <>
        <Alert tone="danger" title="Payment failed" />
        <Alert tone="success" title="Saved" />
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Payment failed");
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("calls onDismiss from the close button", async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Heads up" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

describe("Progress", () => {
  it("reports its value, and omits it when indeterminate", () => {
    const { rerender } = render(<Progress value={40} aria-label="Upload" />);
    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute("aria-valuenow", "40");
    rerender(<Progress aria-label="Upload" />);
    expect(screen.getByRole("progressbar", { name: "Upload" })).not.toHaveAttribute("aria-valuenow");
  });
});
