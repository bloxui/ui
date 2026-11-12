import { Cascader, Field } from "@blox-ui/ui";

const places = [
  {
    value: "in",
    label: "India",
    children: [
      { value: "gj", label: "Gujarat", children: [{ value: "surat", label: "Surat" }, { value: "ahmedabad", label: "Ahmedabad" }] },
      { value: "mh", label: "Maharashtra", children: [{ value: "mumbai", label: "Mumbai" }, { value: "pune", label: "Pune" }] },
    ],
  },
  {
    value: "us",
    label: "United States",
    children: [{ value: "ca", label: "California", children: [{ value: "sf", label: "San Francisco" }] }],
  },
];

export default function CascaderExample() {
  return (
    <Field label="City" className="w-full max-w-xs">
      <Cascader options={places} placeholder="Country / State / City" />
    </Field>
  );
}
