"use client";

import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import { Mic, Plus, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

type Props = {
  placeholder?: string;
  disabled?: boolean;
  listening?: boolean;
  defaultValue?: string;
  onSubmit?: (value: string) => void;
  onAttach?: () => void;
  onMic?: () => void;
  className?: string;
  sticky?: boolean;
};

export function AskBar({
  placeholder = copy.askPlaceholder,
  disabled,
  listening,
  defaultValue = "",
  onSubmit,
  onAttach,
  onMic,
  className,
  sticky,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const canSend = value.trim().length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend || disabled) return;
    onSubmit?.(value.trim());
    setValue("");
  }

  return (
    <form
      className={cn(
        "dm-ask",
        listening && "is-live",
        disabled && "is-disabled",
        sticky && "dm-floatask",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="dm-iconbtn"
        aria-label="Add a document"
        onClick={onAttach}
        disabled={disabled}
      >
        <Plus strokeWidth={1.75} />
      </button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
      />
      {canSend ? (
        <button
          type="submit"
          className="dm-iconbtn dm-iconbtn--send"
          aria-label="Send"
          disabled={disabled}
        >
          <Send strokeWidth={1.75} />
        </button>
      ) : (
        <button
          type="button"
          className={cn("dm-iconbtn", listening && "dm-iconbtn--live")}
          aria-label="Speak"
          aria-pressed={listening}
          onClick={onMic}
          disabled={disabled}
        >
          <Mic strokeWidth={1.75} />
        </button>
      )}
    </form>
  );
}
