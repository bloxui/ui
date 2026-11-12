import { Field, Mentions } from "@blox-ui/ui";

const people = [
  { value: "ada", label: "Ada Lovelace", description: "Engineering" },
  { value: "alan", label: "Alan Turing", description: "Research" },
  { value: "grace", label: "Grace Hopper", description: "Platform" },
  { value: "margaret", label: "Margaret Hamilton", description: "Mobile" },
];

export default function MentionsExample() {
  return (
    <Field label="Comment" hint="Type @ to mention someone." className="w-full max-w-md">
      <Mentions options={people} placeholder="Looks good, @ada can you review?" />
    </Field>
  );
}
