"use client";

import * as React from "react";
import { Bell, Plus, Search } from "lucide-react";
import { Button, Input, Tour } from "@blox-ui/ui";

export default function TourExample() {
  const [open, setOpen] = React.useState(false);
  const create = React.useRef<HTMLButtonElement>(null);
  const search = React.useRef<HTMLDivElement>(null);
  const bell = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="grid w-full max-w-lg gap-6">
      <div className="flex items-center gap-2 rounded-xl border border-border p-3">
        <Button ref={create} size="sm" leftIcon={<Plus />}>New</Button>
        <div ref={search} className="flex-1">
          <Input size="sm" leading={<Search />} placeholder="Search" aria-label="Search" />
        </div>
        <Button ref={bell} size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Notifications">
          <Bell />
        </Button>
      </div>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)} className="justify-self-center">
        Start the tour
      </Button>
      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[
          { target: create, title: "Create anything", description: "Start a project, a doc or a board from here." },
          { target: search, title: "Find it fast", description: "Search across everything you have access to." },
          { target: bell, title: "Stay in the loop", description: "Mentions and updates show up here." },
          { title: "You are all set", description: "Press Ctrl K any time to jump around." },
        ]}
      />
    </div>
  );
}
