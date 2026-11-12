import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DashboardBlock } from "./dashboard";
import { LoginBlock } from "./login";
import { SettingsBlock } from "./settings";
import { passwordStrength, SignupBlock } from "./signup";

describe("LoginBlock", () => {
  it("shows errors for an empty form and does not submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginBlock onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByLabelText(/Email/)).toHaveAccessibleDescription("Enter a valid email address.");
    expect(screen.getByLabelText(/Password/)).toHaveAccessibleDescription("Enter your password.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits trimmed values, including the remember choice", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginBlock onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Email/), "  ada@example.com ");
    await user.type(screen.getByLabelText(/Password/), "secret");
    await user.click(screen.getByRole("checkbox", { name: "Remember me" }));
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSubmit).toHaveBeenCalledWith({ email: "ada@example.com", password: "secret", remember: true });
  });

  it("shows the error message when sign-in is rejected, and clears it on the next try", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error("Wrong email or password.")).mockResolvedValueOnce(undefined);
    render(<LoginBlock onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Email/), "ada@example.com");
    await user.type(screen.getByLabelText(/Password/), "nope");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Wrong email or password.");

    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("SignupBlock", () => {
  it("scores password strength", () => {
    expect(passwordStrength("")).toBe(0);
    expect(passwordStrength("abcdefgh")).toBe(1);
    expect(passwordStrength("Abcdefgh")).toBe(2);
    expect(passwordStrength("Abcdefg1")).toBe(3);
    expect(passwordStrength("Abcdef1!")).toBe(4);
    // Short and without a lowercase letter: only the digit and the symbol count.
    expect(passwordStrength("A1!")).toBe(2);
  });

  it("requires every field and the terms", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupBlock onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Use at least 8 characters.")).toBeInTheDocument();
    expect(screen.getByText("Accept the terms to continue.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the strength as the user types and submits a valid form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupBlock onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Name/), "Ada Lovelace");
    await user.type(screen.getByLabelText(/Email/), "ada@example.com");
    await user.type(screen.getByLabelText(/Password/), "Abcdef1!");
    expect(screen.getByText("Strength: Strong")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Password strength" })).toHaveAttribute("aria-valuenow", "4");

    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ada Lovelace", email: "ada@example.com", password: "Abcdef1!" });
  });
});

describe("SettingsBlock", () => {
  it("saves the profile and confirms it", async () => {
    const user = userEvent.setup();
    const onSaveProfile = vi.fn();
    render(<SettingsBlock onSaveProfile={onSaveProfile} />);

    const name = screen.getByLabelText(/Name/);
    await user.clear(name);
    await user.type(name, "Grace Hopper");
    await user.type(screen.getByLabelText("Bio"), "Compiler pioneer.");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onSaveProfile).toHaveBeenCalledWith({
      name: "Grace Hopper",
      email: "ada@example.com",
      bio: "Compiler pioneer.",
    });
    expect(screen.getByRole("status")).toHaveTextContent("Saved.");
  });

  it("does not save an empty name", async () => {
    const user = userEvent.setup();
    const onSaveProfile = vi.fn();
    render(<SettingsBlock onSaveProfile={onSaveProfile} />);

    await user.clear(screen.getByLabelText(/Name/));
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(onSaveProfile).not.toHaveBeenCalled();
  });

  it("deletes the account only after confirmation", async () => {
    const user = userEvent.setup();
    const onDeleteAccount = vi.fn();
    render(<SettingsBlock onDeleteAccount={onDeleteAccount} />);

    await user.click(screen.getByRole("tab", { name: "Account" }));
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(screen.getByRole("button", { name: "Keep account" }));
    expect(onDeleteAccount).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(screen.getByRole("button", { name: "Yes, delete it" }));
    expect(onDeleteAccount).toHaveBeenCalledOnce();
  });
});

describe("DashboardBlock", () => {
  it("renders the navigation, stats and orders table", () => {
    render(<DashboardBlock />);
    const nav = screen.getByRole("complementary", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");

    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("$48,290")).toBeInTheDocument();
    // A fall in new customers is bad news; a rise in refunds is bad news too.
    expect(screen.getAllByText(/down from last month/)).toHaveLength(1);

    const table = screen.getByRole("table", { name: "Recent orders" });
    expect(within(table).getAllByRole("row")).toHaveLength(6);
  });

  it("signs out from the account menu", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(<DashboardBlock onSignOut={onSignOut} />);

    await user.click(screen.getByRole("button", { name: "Account menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
