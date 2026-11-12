"use client";

import { Trash2 } from "lucide-react";
import { Button, Popconfirm, toast, Toaster } from "@blox-ui/ui";

export default function PopconfirmExample() {
  return (
    <>
      <Toaster />
      <Popconfirm
        title="Delete this comment?"
        description="It will be removed for everyone."
        confirmLabel="Delete"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
          toast.success("Comment deleted");
        }}
      >
        <Button variant="soft" tone="danger" leftIcon={<Trash2 />}>Delete comment</Button>
      </Popconfirm>
    </>
  );
}
