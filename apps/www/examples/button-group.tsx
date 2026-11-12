import { Button, ButtonGroup } from "@blox-ui/ui";

export default function ButtonGroupExample() {
  return (
    <ButtonGroup aria-label="History">
      <Button variant="outline" tone="neutral">Undo</Button>
      <Button variant="outline" tone="neutral">Redo</Button>
      <Button variant="outline" tone="neutral">Reset</Button>
    </ButtonGroup>
  );
}
