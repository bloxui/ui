"use client";

import { Button, toast, Toaster } from "@blox-ui/ui";

export default function ToastExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button variant="soft" tone="neutral" onClick={() => toast("Event created", { description: "Monday at 9:00" })}>
        Default
      </Button>
      <Button variant="soft" tone="success" onClick={() => toast.success("Profile saved")}>
        Success
      </Button>
      <Button variant="soft" tone="danger" onClick={() => toast.error("Payment failed")}>
        Error
      </Button>
    </div>
  );
}
