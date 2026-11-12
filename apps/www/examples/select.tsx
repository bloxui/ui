import { Field, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blox-ui/ui";

export default function SelectExample() {
  return (
    <Field label="Framework" className="w-full max-w-xs">
      <Select defaultValue="next">
        <SelectTrigger>
          <SelectValue placeholder="Choose one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="vite">Vite</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}
