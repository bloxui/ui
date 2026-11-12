"use client";

import * as React from "react";
import { ChatInput, ChatMessage, ChatMessages, ChatSuggestions, ChatTypingIndicator } from "@blox-ui/ui";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

// Stand-in for your model call: streams a canned answer word by word.
const answer = "Blox UI copies each component's source into your project, so you can change anything. Run npx @bloxui/cli add button to try it.";

export default function ChatExample() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [thinking, setThinking] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setThinking(false);
  }

  function send(text: string) {
    const id = Date.now();
    setMessages((current) => [...current, { id, role: "user", content: text }, { id: id + 1, role: "assistant", content: "" }]);
    setThinking(true);
    const words = answer.split(" ");
    let index = 0;
    timer.current = setInterval(() => {
      index += 1;
      setMessages((current) => current.map((m) => (m.id === id + 1 ? { ...m, content: words.slice(0, index).join(" ") } : m)));
      if (index >= words.length) stop();
    }, 60);
  }

  const last = messages.at(-1);
  return (
    <div className="flex h-[28rem] w-full max-w-lg flex-col rounded-xl border border-border">
      <ChatMessages>
        {messages.length === 0 ? (
          <div className="m-auto grid justify-items-center gap-4 text-center">
            <p className="text-sm text-muted">Ask about Blox UI.</p>
            <ChatSuggestions suggestions={["How do I install it?", "Can I change the colours?"]} onSelect={send} className="justify-center" />
          </div>
        ) : null}
        {messages.map((message) =>
          message.role === "assistant" && !message.content ? null : (
            <ChatMessage key={message.id} role={message.role} content={message.content} copyText={message.role === "assistant" ? message.content : undefined} />
          ),
        )}
        {thinking && last?.content === "" ? <ChatTypingIndicator /> : null}
      </ChatMessages>
      <div className="p-3 pt-0">
        <ChatInput onSubmit={send} loading={thinking} onStop={stop} />
      </div>
    </div>
  );
}
