import { Button, Result } from "@blox-ui/ui";

export default function ResultExample() {
  return (
    <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
      <Result
        status="success"
        title="Payment received"
        description="Your order #1042 is confirmed. A receipt is on its way to your inbox."
        actions={<Button size="sm">View order</Button>}
        className="rounded-xl border border-border py-8"
      />
      <Result status={404} actions={<Button size="sm" variant="outline" tone="neutral">Go home</Button>} className="rounded-xl border border-border py-8" />
    </div>
  );
}
