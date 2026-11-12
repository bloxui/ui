import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@blox-ui/ui";

export default function AccordionExample() {
  return (
    <Accordion type="single" collapsible defaultValue="what" className="w-full max-w-md">
      <AccordionItem value="what">
        <AccordionTrigger>What is Blox UI?</AccordionTrigger>
        <AccordionContent>React components you copy into your project and own.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="a11y">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. Keyboard and screen reader support come built in.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="theme">
        <AccordionTrigger>Can I change the look?</AccordionTrigger>
        <AccordionContent>Override any --bx-* CSS variable to restyle every component.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
