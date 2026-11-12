"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { fieldTriggerClass, fieldTriggerSizes, type FieldTriggerSize } from "../lib/control";
import { useFieldControl } from "../lib/field-context";
import { ChevronsUpDownIcon } from "../lib/icons";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { TreeView, type TreeNode } from "./tree-view";

/** The node with an id, and the ids of its ancestors (so they can start expanded). */
export function findTreeNode(nodes: TreeNode[], id: string, ancestors: string[] = []): { node: TreeNode; ancestors: string[] } | null {
  for (const node of nodes) {
    if (node.id === id) return { node, ancestors };
    if (node.children) {
      const found = findTreeNode(node.children, id, [...ancestors, node.id]);
      if (found) return found;
    }
  }
  return null;
}

export interface TreeSelectProps {
  items: TreeNode[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string) => void;
  /** Only allow choosing nodes without children. */
  leavesOnly?: boolean;
  placeholder?: string;
  size?: FieldTriggerSize;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** A select whose options are a tree, such as departments or folders. */
export function TreeSelect({
  items,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  leavesOnly = false,
  placeholder = "Select",
  size = "md",
  invalid,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: TreeSelectProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp === undefined ? internal : valueProp;
  const found = value ? findTreeNode(items, value) : null;
  const label = found ? (found.node.textValue ?? (typeof found.node.label === "string" ? found.node.label : found.node.id)) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-haspopup="tree"
          aria-expanded={open}
          id={control.id}
          aria-label={ariaLabel}
          aria-describedby={control["aria-describedby"]}
          aria-invalid={control.invalid || undefined}
          disabled={disabled}
          className={cn(fieldTriggerClass, fieldTriggerSizes[size], "justify-between", className)}
        >
          <span className={cn("truncate", !label && "text-muted/70")}>{label ?? placeholder}</span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted" />
        </button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <PopoverContent align="start" className="max-h-80 w-(--radix-popover-trigger-width) min-w-56 overflow-y-auto p-1">
        <TreeView
          items={items}
          aria-label={ariaLabel ?? "Options"}
          selectedId={value}
          defaultExpandedIds={found?.ancestors}
          onSelectedIdChange={(picked) => {
            const node = findTreeNode(items, picked)?.node;
            if (leavesOnly && node?.children?.length) return;
            if (valueProp === undefined) setInternal(picked);
            onValueChange?.(picked);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
