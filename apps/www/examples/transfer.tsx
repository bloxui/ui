import { Transfer } from "@blox-ui/ui";

const permissions = [
  { key: "read", label: "Read projects" },
  { key: "write", label: "Edit projects" },
  { key: "invite", label: "Invite members" },
  { key: "billing", label: "Manage billing", description: "Owners only" },
  { key: "delete", label: "Delete projects", disabled: true },
];

export default function TransferExample() {
  return <Transfer items={permissions} defaultValue={["read"]} titles={["Available", "Granted"]} className="w-full max-w-2xl" />;
}
