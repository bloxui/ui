"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "../lib/icons";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

export interface TransferItem {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface TransferProps {
  items: TransferItem[];
  /** Keys of the items in the right-hand list. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  titles?: [string, string];
  searchable?: boolean;
  className?: string;
}

function TransferList({
  title,
  items,
  checked,
  onCheckedChange,
  searchable,
}: {
  title: string;
  items: TransferItem[];
  checked: Set<string>;
  onCheckedChange: (keys: Set<string>) => void;
  searchable: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const shown = items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));
  const selectable = shown.filter((item) => !item.disabled);
  const checkedShown = selectable.filter((item) => checked.has(item.key)).length;
  const headingId = React.useId();

  return (
    <section aria-labelledby={headingId} className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <header className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Checkbox
          size="sm"
          aria-label={`Select all in ${title}`}
          disabled={selectable.length === 0}
          checked={checkedShown === 0 ? false : checkedShown === selectable.length ? true : "indeterminate"}
          onCheckedChange={(state) => {
            const next = new Set(checked);
            for (const item of selectable) {
              if (state === true) next.add(item.key);
              else next.delete(item.key);
            }
            onCheckedChange(next);
          }}
        />
        <h3 id={headingId} className="text-sm font-medium">
          {title}
        </h3>
        <span className="ml-auto text-xs text-muted tabular-nums">
          {checked.size > 0 ? `${checked.size}/` : ""}
          {items.length}
        </span>
      </header>
      {searchable ? (
        <div className="flex items-center gap-2 border-b border-border px-3">
          <SearchIcon className="size-3.5 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label={`Search ${title}`}
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
          />
        </div>
      ) : null}
      <ul className="h-56 overflow-y-auto p-1">
        {shown.length === 0 ? (
          <li className="flex h-full items-center justify-center text-sm text-muted">{items.length ? "No matches" : "Empty"}</li>
        ) : (
          shown.map((item) => {
            const id = `${headingId}-${item.key}`;
            return (
              <li key={item.key}>
                <label
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-soft",
                    item.disabled && "pointer-events-none opacity-50",
                  )}
                >
                  <Checkbox
                    id={id}
                    size="sm"
                    disabled={item.disabled}
                    checked={checked.has(item.key)}
                    onCheckedChange={(state) => {
                      const next = new Set(checked);
                      if (state === true) next.add(item.key);
                      else next.delete(item.key);
                      onCheckedChange(next);
                    }}
                    className="mt-0.5"
                  />
                  <span className="min-w-0">
                    <span className="block truncate">{item.label}</span>
                    {item.description ? <span className="block truncate text-xs text-muted">{item.description}</span> : null}
                  </span>
                </label>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

/** Two lists side by side; tick items and move them across. Its value is the keys on the right. */
export function Transfer({
  items,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  titles = ["Available", "Selected"],
  searchable = true,
  className,
}: TransferProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;
  const inTarget = new Set(value);
  const [leftChecked, setLeftChecked] = React.useState<Set<string>>(new Set());
  const [rightChecked, setRightChecked] = React.useState<Set<string>>(new Set());

  const source = items.filter((item) => !inTarget.has(item.key));
  const target = items.filter((item) => inTarget.has(item.key));

  function setValue(next: string[]) {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  return (
    <div data-slot="transfer" className={cn("flex flex-col items-stretch gap-3 sm:flex-row sm:items-center", className)}>
      <TransferList title={titles[0]} items={source} checked={leftChecked} onCheckedChange={setLeftChecked} searchable={searchable} />
      <div className="flex justify-center gap-2 sm:flex-col">
        <Button
          variant="outline"
          tone="neutral"
          size="sm"
          iconOnly
          aria-label={`Move checked to ${titles[1]}`}
          disabled={leftChecked.size === 0}
          onClick={() => {
            setValue([...value, ...items.filter((item) => leftChecked.has(item.key)).map((item) => item.key)]);
            setLeftChecked(new Set());
          }}
          className="max-sm:rotate-90"
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant="outline"
          tone="neutral"
          size="sm"
          iconOnly
          aria-label={`Move checked to ${titles[0]}`}
          disabled={rightChecked.size === 0}
          onClick={() => {
            setValue(value.filter((key) => !rightChecked.has(key)));
            setRightChecked(new Set());
          }}
          className="max-sm:rotate-90"
        >
          <ChevronLeftIcon />
        </Button>
      </div>
      <TransferList title={titles[1]} items={target} checked={rightChecked} onCheckedChange={setRightChecked} searchable={searchable} />
    </div>
  );
}
