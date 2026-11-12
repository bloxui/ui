"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { CheckIcon, CopyIcon, SendIcon, SparklesIcon, SquareIcon } from "../lib/icons";
import { Avatar } from "./avatar";
import { Button } from "./button";

/**
 * Pieces for a chat with an AI assistant. They render and lay out messages;
 * calling the model and streaming the reply stays in your code.
 */

export interface ChatProps extends React.ComponentProps<"div"> {}

/** The scrolling message list. Stays pinned to the newest message unless the reader has scrolled up. */
export function ChatMessages({ className, children, ...props }: ChatProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const pinned = React.useRef(true);

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (element && pinned.current) element.scrollTop = element.scrollHeight;
  });

  return (
    <div
      ref={ref}
      data-slot="chat-messages"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      onScroll={(event) => {
        const element = event.currentTarget;
        pinned.current = element.scrollHeight - element.scrollTop - element.clientHeight < 48;
      }}
      className={cn("flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ChatMessageProps extends Omit<React.ComponentProps<"div">, "content"> {
  role: "user" | "assistant";
  /** Name for the avatar and screen readers. */
  name?: string;
  avatarSrc?: string;
  /** Message text. Plain strings keep their line breaks; pass elements for rich content. */
  content: React.ReactNode;
  /** Show a copy button for assistant messages, copying this text. */
  copyText?: string;
  /** Extra buttons under the message, e.g. regenerate or feedback. */
  actions?: React.ReactNode;
}

export function ChatMessage({
  role,
  name,
  avatarSrc,
  content,
  copyText,
  actions,
  className,
  ...props
}: ChatMessageProps) {
  const isUser = role === "user";
  const label = name ?? (isUser ? "You" : "Assistant");
  return (
    <div
      data-slot="chat-message"
      data-role={role}
      className={cn("flex gap-3", isUser && "flex-row-reverse", className)}
      {...props}
    >
      {isUser ? (
        <Avatar name={label} src={avatarSrc} size="sm" />
      ) : (
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-text [&_svg]:size-4"
        >
          {avatarSrc ? <Avatar name={label} src={avatarSrc} size="sm" /> : <SparklesIcon />}
        </span>
      )}
      <div className={cn("grid max-w-[85%] min-w-0 gap-1.5", isUser && "justify-items-end")}>
        <span className="sr-only">{label} said:</span>
        <div
          className={cn(
            "text-sm leading-relaxed break-words whitespace-pre-wrap",
            isUser ? "rounded-2xl rounded-tr-md bg-brand px-3.5 py-2 text-brand-fg" : "pt-1 text-fg",
          )}
        >
          {content}
        </div>
        {!isUser && (copyText || actions) ? (
          <div className="flex items-center gap-1 text-muted">
            {copyText ? <CopyMessageButton text={copyText} /> : null}
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CopyMessageButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <Button
      variant="ghost"
      tone="neutral"
      size="xs"
      iconOnly
      aria-label={copied ? "Copied" : "Copy message"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          // Clipboard can be blocked; nothing else to do.
        }
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}

/** Three bouncing dots, shown while the assistant is thinking. */
export function ChatTypingIndicator({ label = "Assistant is typing" }: { label?: string }) {
  return (
    <div data-slot="chat-typing" role="status" className="flex gap-3">
      <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-text [&_svg]:size-4">
        <SparklesIcon />
      </span>
      <span className="flex items-center gap-1 pt-1" aria-label={label}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            aria-hidden
            className="size-1.5 animate-bounce rounded-full bg-muted motion-reduce:animate-none"
            style={{ animationDelay: `${dot * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

export interface ChatInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the trimmed message on Enter or the send button. The field clears itself. */
  onSubmit: (message: string) => void;
  /** While true, the send button becomes a stop button. */
  loading?: boolean;
  /** Called by the stop button. */
  onStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** Extra controls on the left of the toolbar, e.g. an attach button. */
  tools?: React.ReactNode;
  className?: string;
}

/** A growing message box. Enter sends, Shift+Enter adds a line. */
export function ChatInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  loading = false,
  onStop,
  placeholder = "Ask anything…",
  disabled,
  tools,
  className,
}: ChatInputProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !loading && !disabled;

  function setValue(next: string) {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
  }, [value]);

  function submit() {
    if (!canSend) return;
    onSubmit(value.trim());
    setValue("");
  }

  return (
    <form
      data-slot="chat-input"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn(
        "grid gap-2 rounded-2xl border border-border-strong bg-surface p-2 shadow-xs",
        "transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
        className,
      )}
    >
      <textarea
        ref={ref}
        rows={1}
        value={value}
        disabled={disabled}
        aria-label="Message"
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          // Enter while composing (IME) belongs to the input method, not to sending.
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
          }
        }}
        className="max-h-[200px] min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted/70 disabled:cursor-not-allowed"
      />
      <div className="flex items-center gap-1">
        {tools}
        {loading ? (
          <Button type="button" size="sm" iconOnly tone="neutral" aria-label="Stop" onClick={onStop} className="ml-auto rounded-full">
            <SquareIcon />
          </Button>
        ) : (
          <Button type="submit" size="sm" iconOnly aria-label="Send" disabled={!canSend} className="ml-auto rounded-full">
            <SendIcon />
          </Button>
        )}
      </div>
    </form>
  );
}

export interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  className?: string;
}

/** Starter prompts shown before the first message. */
export function ChatSuggestions({ suggestions, onSelect, className }: ChatSuggestionsProps) {
  return (
    <div data-slot="chat-suggestions" className={cn("flex flex-wrap gap-2", className)}>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors outline-none hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
