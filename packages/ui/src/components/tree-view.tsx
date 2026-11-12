"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { ChevronRightIcon, FileIcon, FolderIcon } from "../lib/icons";

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  /** Text used for type-ahead and the accessible name when `label` is not plain text. */
  textValue?: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeViewProps {
  items: TreeNode[];
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedIdChange?: (id: string) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  /** Use folder and file icons for nodes without their own. */
  showIcons?: boolean;
  className?: string;
  "aria-label"?: string;
}

interface VisibleNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  setSize: number;
  position: number;
}

/** The nodes currently on screen, in order, with what ARIA needs to describe each one. */
export function flattenVisible(items: TreeNode[], expanded: Set<string>) {
  const result: VisibleNode[] = [];
  function walk(nodes: TreeNode[], level: number, parentId: string | null) {
    nodes.forEach((node, index) => {
      result.push({ node, level, parentId, setSize: nodes.length, position: index + 1 });
      if (node.children?.length && expanded.has(node.id)) walk(node.children, level + 1, node.id);
    });
  }
  walk(items, 1, null);
  return result;
}

/**
 * A hierarchical list such as a file tree. Follows the ARIA tree pattern: arrow keys move,
 * Right/Left expand and collapse, Home/End jump, and typing a letter jumps to a match.
 */
export function TreeView({
  items,
  selectedId: selectedProp,
  defaultSelectedId = null,
  onSelectedIdChange,
  expandedIds: expandedProp,
  defaultExpandedIds = [],
  onExpandedIdsChange,
  showIcons = true,
  className,
  "aria-label": ariaLabel,
}: TreeViewProps) {
  const [selectedInternal, setSelectedInternal] = React.useState(defaultSelectedId);
  const [expandedInternal, setExpandedInternal] = React.useState(defaultExpandedIds);
  const selectedId = selectedProp === undefined ? selectedInternal : selectedProp;
  const expandedList = expandedProp ?? expandedInternal;
  const expanded = React.useMemo(() => new Set(expandedList), [expandedList]);
  const visible = flattenVisible(items, expanded);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const refs = React.useRef(new Map<string, HTMLDivElement>());

  // One node is in the tab order: the focused one, else the selected one, else the first.
  const tabStop = visible.find((entry) => entry.node.id === focusedId)?.node.id
    ?? visible.find((entry) => entry.node.id === selectedId)?.node.id
    ?? visible[0]?.node.id;

  function setExpanded(next: string[]) {
    if (expandedProp === undefined) setExpandedInternal(next);
    onExpandedIdsChange?.(next);
  }

  function toggle(id: string, open?: boolean) {
    const isOpen = expanded.has(id);
    const want = open ?? !isOpen;
    if (want === isOpen) return;
    setExpanded(want ? [...expandedList, id] : expandedList.filter((item) => item !== id));
  }

  function select(node: TreeNode) {
    if (node.disabled) return;
    if (selectedProp === undefined) setSelectedInternal(node.id);
    onSelectedIdChange?.(node.id);
  }

  function focus(id: string | undefined) {
    if (!id) return;
    setFocusedId(id);
    refs.current.get(id)?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, entry: VisibleNode) {
    const index = visible.indexOf(entry);
    const { node } = entry;
    const hasChildren = Boolean(node.children?.length);
    const isOpen = expanded.has(node.id);
    let handled = true;

    switch (event.key) {
      case "ArrowDown":
        focus(visible[index + 1]?.node.id);
        break;
      case "ArrowUp":
        focus(visible[index - 1]?.node.id);
        break;
      case "Home":
        focus(visible[0]?.node.id);
        break;
      case "End":
        focus(visible.at(-1)?.node.id);
        break;
      case "ArrowRight":
        if (hasChildren && !isOpen) toggle(node.id, true);
        else if (hasChildren) focus(visible[index + 1]?.node.id);
        break;
      case "ArrowLeft":
        if (hasChildren && isOpen) toggle(node.id, false);
        else focus(entry.parentId ?? undefined);
        break;
      case "Enter":
      case " ":
        select(node);
        if (hasChildren && event.key === "Enter") toggle(node.id);
        break;
      default:
        handled = false;
        // Type-ahead: jump to the next node whose text starts with the typed letter.
        if (event.key.length === 1 && /\S/.test(event.key)) {
          const letter = event.key.toLowerCase();
          const ordered = [...visible.slice(index + 1), ...visible.slice(0, index + 1)];
          const match = ordered.find((candidate) => {
            const text = candidate.node.textValue ?? (typeof candidate.node.label === "string" ? candidate.node.label : "");
            return text.toLowerCase().startsWith(letter);
          });
          if (match) {
            focus(match.node.id);
            handled = true;
          }
        }
    }
    if (handled) event.preventDefault();
  }

  return (
    <div data-slot="tree-view" role="tree" aria-label={ariaLabel} className={cn("grid gap-px text-sm", className)}>
      {visible.map((entry) => {
        const { node, level } = entry;
        const hasChildren = Boolean(node.children?.length);
        const isOpen = expanded.has(node.id);
        const isSelected = node.id === selectedId;
        const icon = node.icon ?? (showIcons ? hasChildren ? <FolderIcon /> : <FileIcon /> : null);
        return (
          <div
            key={node.id}
            ref={(element) => {
              if (element) refs.current.set(node.id, element);
              else refs.current.delete(node.id);
            }}
            role="treeitem"
            aria-level={level}
            aria-setsize={entry.setSize}
            aria-posinset={entry.position}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-selected={isSelected}
            aria-disabled={node.disabled || undefined}
            aria-label={node.textValue}
            tabIndex={node.id === tabStop ? 0 : -1}
            onFocus={() => setFocusedId(node.id)}
            onKeyDown={(event) => onKeyDown(event, entry)}
            onClick={() => {
              focus(node.id);
              select(node);
              if (hasChildren) toggle(node.id);
            }}
            style={{ paddingLeft: `calc(${level - 1} * 1.25rem + 0.375rem)` }}
            className={cn(
              "flex h-8 cursor-default items-center gap-1.5 rounded-md pr-2 outline-none select-none",
              "hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isSelected && "bg-brand-soft text-brand-text hover:bg-brand-soft",
              node.disabled && "pointer-events-none opacity-50",
            )}
          >
            <span className="flex size-4 shrink-0 items-center justify-center text-muted">
              {hasChildren ? (
                <ChevronRightIcon className={cn("size-3.5 transition-transform duration-150", isOpen && "rotate-90")} />
              ) : null}
            </span>
            {icon ? <span className="flex shrink-0 text-muted [&_svg]:size-4">{icon}</span> : null}
            <span className="truncate">{node.label}</span>
          </div>
        );
      })}
    </div>
  );
}
