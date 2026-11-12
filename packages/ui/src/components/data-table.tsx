"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, SearchIcon } from "../lib/icons";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Pagination } from "./pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

type SortValue = string | number | Date | boolean | null | undefined;

export interface DataTableColumn<T> {
  /** Unique id for the column. */
  id: string;
  header: React.ReactNode;
  /** The raw value: used for the default cell, for sorting and for search. */
  accessor?: (row: T) => SortValue;
  /** Custom cell content. Defaults to the accessor value. */
  cell?: (row: T) => React.ReactNode;
  /** Let the user sort by this column (needs `accessor`). */
  sortable?: boolean;
  /** Right-align and use tabular figures. */
  numeric?: boolean;
  /** Leave this column out of the search. */
  searchable?: boolean;
  className?: string;
}

export interface DataTableSort {
  id: string;
  direction: "asc" | "desc";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** A stable unique id for each row. */
  getRowId: (row: T) => string;
  /** Show a search box that filters across all columns. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Rows per page. Omit to show every row. */
  pageSize?: number;
  defaultSort?: DataTableSort;
  /** Add a checkbox column. */
  selectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  /** Extra controls shown beside the search box, e.g. filters or bulk actions. */
  toolbar?: React.ReactNode;
  emptyText?: React.ReactNode;
  striped?: boolean;
  dense?: boolean;
  /** Accessible name for the table. */
  "aria-label"?: string;
  className?: string;
}

function compare(a: SortValue, b: SortValue) {
  const emptyA = a === null || a === undefined || a === "";
  const emptyB = b === null || b === undefined || b === "";
  if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

/**
 * A table with sorting, search, pagination and row selection built in.
 * Describe the columns as data; for a fully custom layout use the Table parts directly.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  searchable = false,
  searchPlaceholder = "Search",
  pageSize,
  defaultSort,
  selectable = false,
  selectedIds: selectedProp,
  defaultSelectedIds,
  onSelectedIdsChange,
  toolbar,
  emptyText = "No results.",
  striped,
  dense,
  "aria-label": ariaLabel,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<DataTableSort | null>(defaultSort ?? null);
  const [page, setPage] = React.useState(1);
  const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultSelectedIds ?? []);
  const selectedIds = selectedProp ?? internalSelected;
  const selected = React.useMemo(() => new Set(selectedIds), [selectedIds]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return data;
    const searchColumns = columns.filter((column) => column.accessor && column.searchable !== false);
    return data.filter((row) =>
      searchColumns.some((column) => {
        const value = column.accessor!(row);
        return value !== null && value !== undefined && String(value).toLowerCase().includes(needle);
      }),
    );
  }, [data, columns, query]);

  const sorted = React.useMemo(() => {
    const accessor = sort ? columns.find((column) => column.id === sort.id)?.accessor : undefined;
    if (!sort || !accessor) return filtered;
    const factor = sort.direction === "asc" ? 1 : -1;
    // Empty values stay last in both directions.
    return [...filtered].sort((rowA, rowB) => {
      const a = accessor(rowA);
      const b = accessor(rowB);
      const emptyA = a === null || a === undefined || a === "";
      const emptyB = b === null || b === undefined || b === "";
      if (emptyA || emptyB) return compare(a, b);
      return compare(a, b) * factor;
    });
  }, [filtered, columns, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount);
  const rows = pageSize ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sorted;

  function setSelected(next: string[]) {
    if (selectedProp === undefined) setInternalSelected(next);
    onSelectedIdsChange?.(next);
  }

  function toggleSort(id: string) {
    setPage(1);
    setSort((current) => {
      if (current?.id !== id) return { id, direction: "asc" };
      return current.direction === "asc" ? { id, direction: "desc" } : null;
    });
  }

  const filteredIds = sorted.map(getRowId);
  const selectedInView = filteredIds.filter((id) => selected.has(id)).length;
  const allSelected = filteredIds.length > 0 && selectedInView === filteredIds.length;

  function toggleAll(checked: boolean) {
    const others = selectedIds.filter((id) => !filteredIds.includes(id));
    setSelected(checked ? [...others, ...filteredIds] : others);
  }

  const columnCount = columns.length + (selectable ? 1 : 0);

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-3", className)}>
      {searchable || toolbar ? (
        <div className="flex flex-wrap items-center gap-2">
          {searchable ? (
            <Input
              type="search"
              size="sm"
              leading={<SearchIcon />}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              wrapperClassName="w-full sm:w-64"
            />
          ) : null}
          {toolbar}
        </div>
      ) : null}

      <Table striped={striped} dense={dense} aria-label={ariaLabel}>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                <Checkbox
                  size="sm"
                  aria-label="Select all rows"
                  checked={allSelected ? true : selectedInView > 0 ? "indeterminate" : false}
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                  disabled={filteredIds.length === 0}
                  className="align-middle"
                />
              </TableHead>
            ) : null}
            {columns.map((column) => {
              const active = sort?.id === column.id ? sort.direction : undefined;
              const canSort = column.sortable && column.accessor;
              const SortIcon = active === "asc" ? ArrowUpIcon : active === "desc" ? ArrowDownIcon : ChevronsUpDownIcon;
              return (
                <TableHead
                  key={column.id}
                  numeric={column.numeric}
                  aria-sort={canSort ? (active === "asc" ? "ascending" : active === "desc" ? "descending" : "none") : undefined}
                  className={column.className}
                >
                  {canSort ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.id)}
                      className={cn(
                        "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
                        active && "text-fg",
                      )}
                    >
                      {column.header}
                      <SortIcon className={cn("size-3.5", !active && "opacity-50")} />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-24 text-center text-muted">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.has(id);
              return (
                <TableRow key={id} data-state={isSelected ? "selected" : undefined}>
                  {selectable ? (
                    <TableCell className="w-10">
                      <Checkbox
                        size="sm"
                        aria-label="Select row"
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          setSelected(
                            checked === true ? [...selectedIds, id] : selectedIds.filter((item) => item !== id),
                          )
                        }
                        className="align-middle"
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((column) => {
                    const value = column.accessor?.(row);
                    return (
                      <TableCell key={column.id} numeric={column.numeric} className={column.className}>
                        {column.cell ? column.cell(row) : value instanceof Date ? value.toLocaleDateString() : String(value ?? "")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {selectable || pageSize ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {selectable && selectedIds.length > 0
              ? `${selectedIds.length} of ${data.length} selected`
              : `${sorted.length} ${sorted.length === 1 ? "result" : "results"}`}
          </p>
          {pageSize && pageCount > 1 ? (
            <Pagination page={currentPage} count={pageCount} onPageChange={setPage} size="sm" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
