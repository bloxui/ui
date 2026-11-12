"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { FileIcon, UploadIcon, XIcon } from "../lib/icons";
import { Progress } from "./progress";

export interface UploadFile {
  /** Stable id for the list. */
  id: string;
  file: File;
  /** 0–100 while uploading; leave undefined when you do not track progress. */
  progress?: number;
  /** Set when the upload failed. */
  error?: string;
}

export interface FileUploadProps {
  /** The files in the list. Pass with onFilesChange to control it. */
  files?: UploadFile[];
  defaultFiles?: UploadFile[];
  onFilesChange?: (files: UploadFile[]) => void;
  /** Called with the files that passed validation, as they are added. Start uploads here. */
  onFilesAdded?: (files: UploadFile[]) => void;
  /** Same format as the input's accept attribute, e.g. "image/*,.pdf". */
  accept?: string;
  /** Largest file size, in bytes. */
  maxSize?: number;
  /** Most files the list may hold. */
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  /** Text under the main prompt, e.g. "PNG or JPG, up to 5 MB". */
  hint?: React.ReactNode;
  id?: string;
  className?: string;
  "aria-describedby"?: string;
}

/** "1536" → "1.5 KB". */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

/** Whether a file matches an accept string such as "image/*,.pdf,application/zip". */
export function acceptsFile(file: Pick<File, "name" | "type">, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith(".")) return name.endsWith(rule);
      if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
}

let counter = 0;
const nextId = () => `upload-${Date.now().toString(36)}-${(counter += 1)}`;

/**
 * A drop zone with a file list. It validates type, size and count; uploading is up to you:
 * start it in onFilesAdded and report progress or errors back through `files`.
 */
export function FileUpload({
  files: filesProp,
  defaultFiles = [],
  onFilesChange,
  onFilesAdded,
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  disabled,
  invalid,
  hint,
  id,
  className,
  "aria-describedby": describedBy,
}: FileUploadProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internal, setInternal] = React.useState(defaultFiles);
  const [dragging, setDragging] = React.useState(false);
  const [rejections, setRejections] = React.useState<string[]>([]);
  const files = filesProp ?? internal;
  const messageId = React.useId();

  function setFiles(next: UploadFile[]) {
    if (filesProp === undefined) setInternal(next);
    onFilesChange?.(next);
  }

  function add(list: FileList | File[]) {
    const incoming = [...list];
    const problems: string[] = [];
    const accepted: UploadFile[] = [];
    const room = maxFiles === undefined ? Infinity : maxFiles - files.length;

    for (const file of multiple ? incoming : incoming.slice(0, 1)) {
      if (!acceptsFile(file, accept)) problems.push(`${file.name}: this type of file is not allowed.`);
      else if (maxSize !== undefined && file.size > maxSize) problems.push(`${file.name}: larger than ${formatBytes(maxSize)}.`);
      else if (accepted.length >= room) problems.push(`${file.name}: you can add up to ${maxFiles} files.`);
      else accepted.push({ id: nextId(), file });
    }

    setRejections(problems);
    if (accepted.length === 0) return;
    setFiles(multiple ? [...files, ...accepted] : accepted);
    onFilesAdded?.(accepted);
  }

  const descriptions = [control["aria-describedby"], rejections.length ? messageId : undefined].filter(Boolean).join(" ");

  return (
    <div data-slot="file-upload" className={cn("grid gap-3", className)}>
      <div
        role="presentation"
        data-dragging={dragging ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onDragOver={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) add(event.dataTransfer.files);
        }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          "border-border-strong bg-sunken/50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/25",
          "data-[dragging]:border-brand data-[dragging]:bg-brand-soft",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
          control.invalid && "border-danger",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-surface text-muted shadow-xs">
          <UploadIcon className="size-5" />
        </span>
        <p className="text-sm">
          <button
            type="button"
            id={control.id}
            disabled={disabled}
            aria-describedby={descriptions || undefined}
            aria-invalid={control.invalid || undefined}
            onClick={() => inputRef.current?.click()}
            className="font-medium text-brand-text underline-offset-4 outline-none hover:underline disabled:pointer-events-none"
          >
            Choose {multiple ? "files" : "a file"}
          </button>{" "}
          <span className="text-muted">or drag {multiple ? "them" : "it"} here</span>
        </p>
        {hint ? <p className="text-xs text-muted">{hint}</p> : null}
        <input
          ref={inputRef}
          type="file"
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files) add(event.target.files);
            // Let the same file be chosen again after removing it.
            event.target.value = "";
          }}
        />
      </div>

      {rejections.length > 0 ? (
        <ul id={messageId} role="alert" className="grid gap-1 text-sm text-danger-text">
          {rejections.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}

      {files.length > 0 ? (
        <ul aria-label="Selected files" className="grid gap-2">
          {files.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border bg-surface p-3",
                item.error ? "border-danger" : "border-border",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral-soft text-muted">
                <FileIcon className="size-4" />
              </span>
              <div className="grid min-w-0 flex-1 gap-1">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{item.file.name}</span>
                  <span className="shrink-0 text-xs text-muted tabular-nums">{formatBytes(item.file.size)}</span>
                </div>
                {item.error ? (
                  <p className="text-xs text-danger-text">{item.error}</p>
                ) : item.progress !== undefined && item.progress < 100 ? (
                  <Progress value={item.progress} size="sm" aria-label={`Uploading ${item.file.name}`} />
                ) : null}
              </div>
              <button
                type="button"
                aria-label={`Remove ${item.file.name}`}
                onClick={() => setFiles(files.filter((entry) => entry.id !== item.id))}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted outline-none hover:bg-neutral-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
