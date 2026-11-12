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

/** Where a card would land in a column, from the pointer's height against each other card's middle. */
function slotIn(columnElement: Element, clientY: number, draggingId: string) {
  const cards = [...columnElement.querySelectorAll<HTMLElement>("[data-kanban-card]")].filter(
    (element) => element.dataset.kanbanCard !== draggingId,
  );
  const index = cards.findIndex((element) => {
    const rect = element.getBoundingClientRect();
    return clientY < rect.top + rect.height / 2;
  });
  return index === -1 ? cards.length : index;
}

/** Touch: how long a finger rests on a card before it lifts, and how far it may wander first. */
const LONG_PRESS_MS = 300;
const MOVE_TOLERANCE = 8;
/** Mouse: how far the pointer moves with the button down before a press becomes a drag. */
const MOUSE_DRAG_DISTANCE = 4;

/**
 * A board of columns with cards that move three ways: drag with a mouse, press and hold
 * then drag on touch screens, or from the keyboard (focus a card, Space to pick it up,
 * arrow keys to move, Space to drop, Escape to cancel). Mouse and touch share one
 * pointer-based implementation, so they behave the same in every browser.
 */
export function Kanban({ columns, onColumnsChange, onCardMove, className, "aria-label": ariaLabel = "Board" }: KanbanProps) {
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<{ column: string; index: number } | null>(null);
  // Keyboard move: the picked-up card and where it started, so Escape can put it back.
  const [lifted, setLifted] = React.useState<{ id: string; origin: KanbanColumn[] } | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const cardRefs = React.useRef(new Map<string, HTMLDivElement>());
  const boardRef = React.useRef<HTMLDivElement>(null);
  const dropTargetRef = React.useRef(dropTarget);
  dropTargetRef.current = dropTarget;
  // Pointer drag: the pending press, then the active drag, and a copy of the card under the pointer.
  const touch = React.useRef<{
    id: string;
    x: number;
    y: number;
    mouse: boolean;
    pointerId: number;
    element: HTMLDivElement;
    timer: ReturnType<typeof setTimeout> | null;
    active: boolean;
  } | null>(null);
  const [ghost, setGhost] = React.useState<{ title: React.ReactNode; x: number; y: number; width: number } | null>(null);

  // While a touch drag is active, stop the page from scrolling under the finger.
  React.useEffect(() => {
    const block = (event: TouchEvent) => {
      if (touch.current?.active) event.preventDefault();
    };
    document.addEventListener("touchmove", block, { passive: false });
    return () => document.removeEventListener("touchmove", block);
  }, []);

  function endTouch() {
    if (touch.current?.timer) clearTimeout(touch.current.timer);
    touch.current = null;
    setGhost(null);
    setDragging(null);
    setDropTarget(null);
  }

  /** Lifts the card: from now on it follows the pointer. */
  function startDrag(card: KanbanCard, x: number, y: number) {
    const state = touch.current;
    if (!state || state.id !== card.id) return;
    state.active = true;
    state.element.setPointerCapture?.(state.pointerId);
    setDragging(card.id);
    setGhost({ title: card.title, x, y, width: state.element.getBoundingClientRect().width });
    if (!state.mouse) navigator.vibrate?.(15);
  }

  function pointerHandlers(card: KanbanCard) {
    return {
      onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
        // Only the main button starts a drag; right-click keeps its menu.
        if (event.pointerType === "mouse" && event.button !== 0) return;
        const mouse = event.pointerType === "mouse";
        const start = { x: event.clientX, y: event.clientY };
        touch.current = {
          id: card.id,
          ...start,
          mouse,
          pointerId: event.pointerId,
          element: event.currentTarget,
          active: false,
          // Touch waits for a long press so a swipe can still scroll; a mouse drags as soon as it moves.
          timer: mouse ? null : setTimeout(() => startDrag(card, start.x, start.y), LONG_PRESS_MS),
        };
      },
      onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
        const state = touch.current;
        if (!state || state.id !== card.id) return;
        if (!state.active) {
          const moved = Math.hypot(event.clientX - state.x, event.clientY - state.y);
          if (state.mouse) {
            if (moved > MOUSE_DRAG_DISTANCE) startDrag(card, event.clientX, event.clientY);
            else return;
          } else {
            // Moving before the long press finishes means the user is scrolling.
            if (moved > MOVE_TOLERANCE) endTouch();
            return;
          }
        }
        setGhost((current) => (current ? { ...current, x: event.clientX, y: event.clientY } : current));
        // Near the board's left or right edge, scroll it so hidden columns can be reached.
        const board = boardRef.current;
        if (board) {
          const rect = board.getBoundingClientRect();
          const edge = 48;
          if (event.clientX < rect.left + edge) board.scrollLeft -= 14;
          else if (event.clientX > rect.right - edge) board.scrollLeft += 14;
        }
        const column = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-kanban-column]");
        setDropTarget(column ? { column: column.dataset.kanbanColumn!, index: slotIn(column, event.clientY, card.id) } : null);
      },
      onPointerUp: () => {
        const state = touch.current;
        const target = dropTargetRef.current;
        if (state?.active && target) apply(card.id, target.column, target.index);
        endTouch();
      },
      onPointerCancel: endTouch,
      // A long press would otherwise open the browser's own menu.
      onContextMenu: (event: React.MouseEvent) => {
        if (touch.current) event.preventDefault();
      },
    };
  }

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
    <div ref={boardRef} data-slot="kanban" role="group" aria-label={ariaLabel} className={cn("flex gap-4 overflow-x-auto pb-2", className)}>
      {columns.map((column) => {
        const full = column.limit !== undefined && column.cards.length >= column.limit;
        const target = dropTarget?.column === column.id ? dropTarget.index : null;
        return (
          <section
            key={column.id}
            data-kanban-column={column.id}
            aria-label={`${column.title}, ${column.cards.length} ${column.cards.length === 1 ? "card" : "cards"}`}
            className={cn(
              toneClasses[column.tone ?? "neutral"],
              "flex min-w-48 flex-1 basis-0 flex-col rounded-xl bg-sunken p-2 sm:max-w-80",
              dragging && target !== null && "ring-2 ring-ring/40",
            )}
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
                      tabIndex={0}
                      aria-roledescription="draggable card"
                      aria-pressed={isLifted}
                      onBlur={() => {
                        // Leaving a lifted card drops it where it is.
                        if (isLifted) setLifted(null);
                      }}
                      onKeyDown={(event) => onCardKeyDown(event, card, column, index)}
                      {...pointerHandlers(card)}
                      className={cn(
                        "grid cursor-grab touch-manipulation gap-1 rounded-lg select-none [-webkit-touch-callout:none] [-webkit-user-drag:none] border border-border bg-surface p-3 text-sm shadow-xs transition-[box-shadow,opacity,transform] outline-none",
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
      {ghost ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-2 rounded-lg border border-border bg-surface p-3 text-sm font-medium shadow-raised ring-2 ring-ring"
          style={{ left: ghost.x, top: ghost.y, width: ghost.width }}
        >
          {ghost.title}
        </div>
      ) : null}
      <p aria-live="assertive" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

function DropIndicator() {
  return <span aria-hidden className="mb-2 block h-1 rounded-full bg-brand" />;
}
