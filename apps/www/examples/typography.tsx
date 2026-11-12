import { Blockquote, Heading, InlineCode, Text, TypographyList } from "@blox-ui/ui";

export default function TypographyExample() {
  return (
    <article className="grid max-w-xl gap-4">
      <Heading level={2} size="2xl">The tone system</Heading>
      <Text variant="lead">Every component takes the same five tones, so colours stay consistent.</Text>
      <Text>
        Pass <InlineCode>tone="danger"</InlineCode> to a button, badge or alert and they all match.
      </Text>
      <TypographyList>
        <li>brand, neutral, success, warning, danger</li>
        <li>five roles each: fill, hover, text on fill, soft and coloured text</li>
      </TypographyList>
      <Blockquote>Change a token once and every component follows.</Blockquote>
      <Text variant="muted">Last updated today.</Text>
    </article>
  );
}
