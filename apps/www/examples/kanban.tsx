"use client";

import * as React from "react";
import { Avatar, Badge, Kanban, type KanbanColumn } from "@blox-ui/ui";

const initial: KanbanColumn[] = [
  {
    id: "todo",
    title: "To do",
    cards: [
      { id: "1", title: "Write the CLI guide", footer: <Badge size="sm">Docs</Badge> },
      { id: "2", title: "Add a phone input", description: "Country picker and E.164 output." },
    ],
  },
  {
    id: "doing",
    title: "In progress",
    tone: "brand",
    limit: 3,
    cards: [{ id: "3", title: "Kanban keyboard support", footer: <Avatar name="Ada Lovelace" size="xs" /> }],
  },
  { id: "done", title: "Done", tone: "success", cards: [{ id: "4", title: "Theme builder" }] },
];

export default function KanbanExample() {
  const [columns, setColumns] = React.useState(initial);
  return (
    <div className="grid w-full gap-3">
      <Kanban columns={columns} onColumnsChange={setColumns} aria-label="Release board" />
      <p className="text-center text-xs text-muted">
        Drag a card with the mouse, or press and hold it on a touch screen. From the keyboard: Tab to a card, Space to
        pick it up, arrow keys to move, Space to drop.
      </p>
    </div>
  );
}
