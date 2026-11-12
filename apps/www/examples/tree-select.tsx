import { Field, TreeSelect } from "@blox-ui/ui";

const teams = [
  {
    id: "eng",
    label: "Engineering",
    children: [
      { id: "web", label: "Web" },
      { id: "mobile", label: "Mobile", children: [{ id: "ios", label: "iOS" }, { id: "android", label: "Android" }] },
    ],
  },
  { id: "design", label: "Design", children: [{ id: "brand", label: "Brand" }, { id: "product", label: "Product design" }] },
];

export default function TreeSelectExample() {
  return (
    <Field label="Team" hint="Only teams, not departments." className="w-full max-w-xs">
      <TreeSelect items={teams} leavesOnly placeholder="Choose a team" />
    </Field>
  );
}
