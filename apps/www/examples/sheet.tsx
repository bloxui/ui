import {
  Button,
  Field,
  Input,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@blox-ui/ui";

export default function SheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="soft">Open filters</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down the list.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Field label="Search">
            <Input placeholder="Component name" />
          </Field>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Apply</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
