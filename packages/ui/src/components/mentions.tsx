"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { Avatar } from "./avatar";

export interface MentionOption {
  /** Inserted after the trigger, e.g. "ada" for "@ada". */
  value: string;
  label: string;
  description?: string;
  avatarSrc?: string;
}

export interface MentionsProps {
  options: MentionOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Character that opens the list. */
  trigger?: string;
  /** Called when a mention is inserted. */
  onMention?: (option: MentionOption) => void;
  placeholder?: string;
  rows?: number;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/**
 * The open mention query at the caret: for "Hi @ad|" returns { start: 3, query: "ad" }.
 * The trigger must start the text or follow whitespace, and the query has no spaces.
 */
export function findMentionQuery(text: string, caret: number, trigger = "@") {
  const before = text.slice(0, caret);
  const index = before.lastIndexOf(trigger);
  if (index === -1) return null;
  if (index > 0 && !/\s/.test(before[index - 1]!)) return null;
  const query = before.slice(index + trigger.length);
  if (/\s/.test(query)) return null;
  return { start: index, query };
}

/** A textarea where typing @ suggests people (or anything else) to mention. */
export function Mentions({
  options,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  trigger = "@",
  onMention,
  placeholder,
  rows = 3,
  invalid,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: MentionsProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const listId = React.useId();
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;
  const [query, setQuery] = React.useState<{ start: number; query: string } | null>(null);
  const [active, setActive] = React.useState(0);

  const matches = query
    ? options
        .filter((option) => {
          const needle = query.query.toLowerCase();
          return option.value.toLowerCase().includes(needle) || option.label.toLowerCase().includes(needle);
        })
        .slice(0, 8)
    : [];
  const open = query !== null && matches.length > 0;

  function setValue(next: string) {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  function refreshQuery(element: HTMLTextAreaElement) {
    setQuery(findMentionQuery(element.value, element.selectionStart ?? 0, trigger));
    setActive(0);
  }

  function insert(option: MentionOption) {
    const element = ref.current;
    if (!element || !query) return;
    const caret = element.selectionStart ?? value.length;
    const inserted = `${trigger}${option.value} `;
    const next = value.slice(0, query.start) + inserted + value.slice(caret);
    setValue(next);
    setQuery(null);
    onMention?.(option);
    const position = query.start + inserted.length;
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(position, position);
    });
  }

  return (
    <div data-slot="mentions" className={cn("relative w-full", className)}>
      <textarea
        ref={ref}
        id={control.id}
        name={name}
        rows={rows}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        role="combobox"
        aria-label={ariaLabel}
        aria-describedby={control["aria-describedby"]}
        aria-invalid={control.invalid || undefined}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onChange={(event) => {
          setValue(event.target.value);
          refreshQuery(event.target);
        }}
        onClick={(event) => refreshQuery(event.currentTarget)}
        onBlur={() => setQuery(null)}
        onKeyDown={(event) => {
          if (!open) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const delta = event.key === "ArrowDown" ? 1 : -1;
            setActive((current) => (current + delta + matches.length) % matches.length);
          } else if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            insert(matches[active]!);
          } else if (event.key === "Escape") {
            event.preventDefault();
            setQuery(null);
          }
        }}
        className={cn(
          "block w-full resize-y rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-fg shadow-xs",
          "transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted/70",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:bg-sunken disabled:opacity-60",
          "aria-invalid:border-danger",
        )}
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-surface p-1 shadow-raised animate-pop-in"
        >
          {matches.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              // Keep focus in the textarea.
              onMouseDown={(event) => {
                event.preventDefault();
                insert(option);
              }}
              onMouseEnter={() => setActive(index)}
              className={cn(
                "flex cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 text-sm",
                index === active && "bg-neutral-soft",
              )}
            >
              <Avatar name={option.label} src={option.avatarSrc} size="xs" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{option.label}</span>
                {option.description ? <span className="block truncate text-xs text-muted">{option.description}</span> : null}
              </span>
              <span className="text-xs text-muted">
                {trigger}
                {option.value}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
