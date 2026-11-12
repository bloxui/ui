import { Button, Field, Input, Popover, PopoverContent, PopoverTrigger } from "@blox-ui/ui";

export default function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" tone="neutral">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-3">
        <Field label="Width">
          <Input size="sm" defaultValue="100%" />
        </Field>
        <Field label="Height">
          <Input size="sm" defaultValue="25px" />
        </Field>
      </PopoverContent>
    </Popover>
  );
}
