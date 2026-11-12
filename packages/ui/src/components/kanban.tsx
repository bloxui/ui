"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { toneClasses, type Tone } from "../lib/tone";

export interface KanbanCard {
  id: string;
  title: React.ReactNode;
  /** Plain-text name, used in announcements when `title` is not a string. */
  textValue?: string;
  description?: React.ReactNode;
  /** Extra content at the bottom of the card, e.g. badges or avatars. */
  footer?: React.ReactNode;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tone?: Tone;
  cards: KanbanCard[];
  /** Most cards the column takes; it refuses drops beyond this. */
  limit?: number;
}

export interface KanbanProps {
  columns: KanbanColumn[];
  /** Receives the whole board after every move. */
  onColumnsChange: (columns: KanbanColumn[]) => void;
  /** Called after a card moves, e.g. to save it. */
  onCardMove?: (move: { cardId: string; from: string; to: string; index: number }) => void;
  className?: string;
  "aria-label"?: string;
}

/** Returns a new board with the card moved to `toColumn` at `index`. The input is not changed. */
export function moveCard(columns: KanbanColumn[], cardId: string, toColumn: string, index: number) {
  const from = columns.find((column) => column.cards.some((card) => card.id === cardId));
  const card = from?.cards.find((item) => item.id === cardId);
  const target = columns.find((column) => column.id === toColumn);
  if (!from || !card || !target) return columns;
  return columns.map((column) => {
    let cards = column.cards.filter((item) => item.id !== cardId);
    if (column.id === toColumn) {
      const position = Math.max(0, Math.min(index, cards.length));
      cards = [...cards.slice(0, position), card, ...cards.slice(position)];
    }
    return { ...column, cards };
  });
}

const cardText = (card: KanbanCard) => card.textValue ?? (typeof card.title === "string" ? card.title : "Card");

/**
 * A board of columns with cards that move by drag and drop or from the keyboard:
 * focus a card, press Space to pick it up, arrow keys to move, Space to drop, Escape to cancel.
 */
export function Kanban({ columns, onColumnsChange, onCardMove, className, "aria-label": ariaLabel = "Board" }: KanbanProps) {
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<{ column: string; index: number } | null>(null);
  // Keyboard move: the picked-up card and where it started, so Escape can put it back.
  const [lifted, setLifted] = React.useState<{ id: string; origin: KanbanColumn[] } | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const cardRefs = React.useRef(new Map<string, HTMLDivElement>());

  const columnOf = (cardId: string, board = columns) => board.find((column) => column.cards.some((card) => card.id === cardId));
  const isFull = (column: KanbanColumn, cardId: string) =>
    column.limit !== undefined && column.cards.length >= column.limit && !column.cards.some((card) => card.id === cardId);

  function apply(cardId: string, to: string, index: number, announce = true) {
    const fromColumn = columnOf(cardId);
    const target = columns.find((column) => column.id === to);
    if (!fromColumn || !target || isFull(target, cardId)) {
      if (target && announce) setAnnouncement(`${target.title} is full.`);
      return false;
    }
    const next = moveCard(columns, cardId, to, index);
    onColumnsChange(next);
    onCardMove?.({ cardId, from: fromColumn.id, to, index });
    if (announce) {
      const card = fromColumn.cards.find((item) => item.id === cardId)!;
      const position = next.find((column) => column.id === to)!.cards.findIndex((item) => item.id === cardId) + 1;
      setAnnouncement(`${cardText(card)} moved to ${target.title}, position ${position}.`);
    }
    return true;
  }

  // Keep focus on a card after it moves to another column (it remounts there).
  React.useEffect(() => {
    if (lifted) cardRefs.current.get(lifted.id)?.focus();
  }, [columns, lifted]);

  function onCardKeyDown(event: React.KeyboardEvent, card: KanbanCard, column: KanbanColumn, index: number) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (lifted?.id === card.id) {
        setLifted(null);
        setAnnouncement(`${cardText(card)} dropped in ${column.title}, position ${index + 1}.`);
      } else {
        setLifted({ id: card.id, origin: columns });
        setAnnouncement(
          `${cardText(card)} picked up in ${column.title}. Use arrow keys to move, Space to drop, Escape to cancel.`,
        );
      }
      return;
    }
    if (event.key === "Escape" && lifted?.id === card.id) {
      event.preventDefault();
      onColumnsChange(lifted.origin);
      setLifted(null);
      setAnnouncement(`Move cancelled. ${cardText(card)} is back where it was.`);
      return;
    }
    if (lifted?.id !== card.id) return;

    const columnIndex = columns.indexOf(column);
    const moves: Record<string, () => void> = {
      ArrowUp: () => index > 0 && apply(card.id, column.id, index - 1),
      ArrowDown: () => index < column.cards.length - 1 && apply(card.id, column.id, index + 1),
      ArrowLeft: () => {
        const target = columns[columnIndex - 1];
        if (target) apply(card.id, target.id, Math.min(index, target.cards.length));
      },
      ArrowRight: () => {
        const target = columns[columnIndex + 1];
        if (target) apply(card.id, target.id, Math.min(index, target.cards.length));
      },
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      move();
    }
  }

  return (
    <div data-slot="kanban" role="group" aria-label={ariaLabel} className={cn("flex gap-4 overflow-x-auto pb-2", className)}>
      {columns.map((column) => {
        const full = column.limit !== undefined && column.cards.length >= column.limit;
        const target = dropTarget?.column === column.id ? dropTarget.index : null;
        return (
          <section
            key={column.id}
            aria-label={`${column.title}, ${column.cards.length} ${column.cards.length === 1 ? "card" : "cards"}`}
            className={cn(
              toneClasses[column.tone ?? "neutral"],
              "flex w-72 shrink-0 flex-col rounded-xl bg-sunken p-2",
              dragging && target !== null && "ring-2 ring-ring/40",
            )}
            onDragOver={(event) => {
              if (!dragging) return;
              event.preventDefault();
              // Work out the slot from the pointer's position against each card's middle.
              const cards = [...event.currentTarget.querySelectorAll<HTMLElement>("[data-kanban-card]")].filter(
                (element) => element.dataset.kanbanCard !== dragging,
              );
              const index = cards.findIndex((element) => {
                const rect = element.getBoundingClientRect();
                return event.clientY < rect.top + rect.height / 2;
              });
              setDropTarget({ column: column.id, index: index === -1 ? cards.length : index });
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTarget(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragging && target !== null) apply(dragging, column.id, target);
              setDragging(null);
              setDropTarget(null);
            }}
          >
            <header className="flex items-center gap-2 px-2 pt-1 pb-3">
              <span aria-hidden className="size-2 rounded-full bg-(--t)" />
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <span className="ml-auto text-xs text-muted tabular-nums">
                {column.cards.length}
                {column.limit !== undefined ? ` / ${column.limit}` : null}
              </span>
            </header>
            <ul className="flex min-h-16 flex-1 flex-col gap-2">
              {column.cards.map((card, index) => {
                const isLifted = lifted?.id === card.id;
                return (
                  <li key={card.id}>
                    {target === index ? <DropIndicator /> : null}
                    <div
                      ref={(element) => {
                        if (element) cardRefs.current.set(card.id, element);
                        else cardRefs.current.delete(card.id);
                      }}
                      data-kanban-card={card.id}
                      draggable
                      tabIndex={0}
                      aria-roledescription="draggable card"
                      aria-pressed={isLifted}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", card.id);
                        setDragging(card.id);
                      }}
                      onDragEnd={() => {
                        setDragging(null);
                        setDropTarget(null);
                      }}
                      onBlur={() => {
                        // Leaving a lifted card drops it where it is.
                        if (isLifted) setLifted(null);
                      }}
                      onKeyDown={(event) => onCardKeyDown(event, card, column, index)}
                      className={cn(
                        "grid cursor-grab gap-1 rounded-lg border border-border bg-surface p-3 text-sm shadow-xs transition-[box-shadow,opacity,transform] outline-none",
                        "hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
                        dragging === card.id && "opacity-40",
                        isLifted && "-rotate-1 shadow-raised ring-2 ring-ring",
                      )}
                    >
                      <p className="font-medium">{card.title}</p>
                      {card.description ? <p className="text-muted">{card.description}</p> : null}
                      {card.footer ? <div className="pt-1">{card.footer}</div> : null}
                    </div>
                  </li>
                );
              })}
              {target === column.cards.filter((card) => card.id !== dragging).length ? (
                <li aria-hidden>
                  <DropIndicator />
                </li>
              ) : null}
              {column.cards.length === 0 && target === null ? (
                <li className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border-strong p-4 text-xs text-muted">
                  {full ? "Full" : "Drop cards here"}
                </li>
              ) : null}
            </ul>
          </section>
        );
      })}
      <p aria-live="assertive" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

function DropIndicator() {
  return <span aria-hidden className="mb-2 block h-1 rounded-full bg-brand" />;
}
