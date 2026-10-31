"use client";

import { AskBar } from "@/components/answer/AskBar";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export type ChatMessage = {
  id: string;
  role: "me" | "assistant";
  content: ReactNode;
};

type Props = {
  messages: ChatMessage[];
  onSend?: (value: string) => void;
  className?: string;
  footer?: ReactNode;
};

export function Chat({ messages, onSend, className, footer }: Props) {
  return (
    <div className={cn("dm-chat", className)} style={{ flex: 1, minHeight: 0 }}>
      <div className="dm-scroll" style={{ flex: 1 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "dm-bubble",
              m.role === "me" ? "dm-bubble--me" : "dm-bubble--us",
            )}
          >
            {m.content}
          </div>
        ))}
        {footer}
      </div>
      <AskBar onSubmit={onSend} sticky />
    </div>
  );
}

export function ChatWidget({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("dm-widget", className)}>{children}</div>;
}
