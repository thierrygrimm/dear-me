"use client";

import { getPersona, readPersonaId, type PersonaId } from "@/lib/personas";
import { readChatHistory } from "@/lib/session";
import { useEffect, useMemo, useState } from "react";

/** Merge session chat history with persona seed chips; live on dm-chat-history. */
export function useAskHistory(personaId?: PersonaId) {
  const [id, setId] = useState<PersonaId>(personaId ?? "lena");
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    function refresh() {
      setId(personaId ?? readPersonaId());
      setSaved(readChatHistory());
    }
    refresh();
    window.addEventListener("dm-chat-history", refresh);
    window.addEventListener("dm-persona", refresh);
    return () => {
      window.removeEventListener("dm-chat-history", refresh);
      window.removeEventListener("dm-persona", refresh);
    };
  }, [personaId]);

  const chips = useMemo(() => {
    const seeded = getPersona(id).earlierChats;
    return [...saved, ...seeded.filter((q) => !saved.includes(q))];
  }, [id, saved]);

  return { chips, saved, personaId: id };
}
