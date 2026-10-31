"use client";

import { Chat, ChatWidget, type ChatMessage } from "@/components/chat/Chat";
import { ChatSteps } from "@/components/chat/ChatSteps";
import { copy } from "@/lib/copy";
import { Clock, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Ask in your own words. I'll answer first, then we can play with the numbers.",
    },
  ]);

  return (
    <div className="dm-app-shell" style={{ minHeight: "100dvh" }}>
      <header className="dm-appbar" style={{ padding: "12px 16px" }}>
        <Link href="/" aria-label={copy.chat.close}>
          <X strokeWidth={1.75} />
        </Link>
        <b style={{ font: "600 15px/20px var(--font-text)" }}>
          {copy.chat.title}
        </b>
        <button type="button" aria-label={copy.chat.history}>
          <Clock strokeWidth={1.75} />
        </button>
      </header>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 16px 16px",
          minHeight: 0,
        }}
      >
        <Chat
          messages={messages}
          onSend={(value) => {
            setMessages((prev) => [
              ...prev,
              { id: `m-${prev.length}`, role: "me", content: value },
              {
                id: `a-${prev.length}`,
                role: "assistant",
                content: (
                  <>
                    <ChatSteps
                      steps={[
                        {
                          id: "s1",
                          label: "Reading what you asked",
                          done: true,
                        },
                        {
                          id: "s2",
                          label: "Checking what we know",
                          done: true,
                        },
                        {
                          id: "s3",
                          label: "Working out the francs",
                          done: true,
                        },
                      ]}
                      collapsedSummary="Checked against what we know."
                    />
                    <ChatWidget>
                      <b>Here&apos;s a starting point</b>
                      <p className="dm-small dm-muted" style={{ margin: 0 }}>
                        Open the guided answer to play with workload and see the
                        monthly difference at 65.
                      </p>
                      <Link href="/answer" className="dm-btn dm-btn--primary">
                        Open the answer
                      </Link>
                    </ChatWidget>
                  </>
                ),
              },
            ]);
          }}
        />
      </div>
    </div>
  );
}
