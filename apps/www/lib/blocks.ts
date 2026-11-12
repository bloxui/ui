import type { ComponentType } from "react";
import { DashboardBlock } from "@blox-ui/ui/blocks/dashboard";
import { ErrorPageBlock } from "@blox-ui/ui/blocks/error-page";
import { LoginBlock } from "@blox-ui/ui/blocks/login";
import { NotFoundBlock } from "@blox-ui/ui/blocks/not-found";
import { SettingsBlock } from "@blox-ui/ui/blocks/settings";
import { SignupBlock } from "@blox-ui/ui/blocks/signup";

export interface BlockEntry {
  title: string;
  description: string;
  /** Name of the item in the registry. */
  registryName: string;
  Component: ComponentType;
}

export const blocks: Record<string, BlockEntry> = {
  login: {
    title: "Login",
    description: "A sign-in card with validation, a loading state and an error message.",
    registryName: "block-login",
    Component: LoginBlock,
  },
  signup: {
    title: "Signup",
    description: "A sign-up card with a password strength meter and a terms checkbox.",
    registryName: "block-signup",
    Component: SignupBlock,
  },
  settings: {
    title: "Settings",
    description: "An account settings page with profile, notifications and delete account.",
    registryName: "block-settings",
    Component: SettingsBlock,
  },
  dashboard: {
    title: "Dashboard",
    description: "An app shell with a sidebar, stat cards, a chart and an orders table.",
    registryName: "block-dashboard",
    Component: DashboardBlock,
  },
  "not-found": {
    title: "404 page",
    description: "A not-found page with a way back and a few useful links.",
    registryName: "block-not-found",
    Component: NotFoundBlock,
  },
  "error-page": {
    title: "Error page",
    description: "An error page for any status code, with retry and a support reference.",
    registryName: "block-error-page",
    Component: ErrorPageBlock,
  },
};
