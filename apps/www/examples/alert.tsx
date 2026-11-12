import { Alert, Button } from "@blox-ui/ui";

export default function AlertExample() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Alert title="New version available" actions={<Button size="xs" variant="outline">Update</Button>}>
        Blox UI 0.2 adds forms and feedback components.
      </Alert>
      <Alert tone="success" role="status">Your changes were saved.</Alert>
      <Alert tone="danger" variant="outline" role="status" title="Payment failed">
        Check your card details and try again.
      </Alert>
    </div>
  );
}
