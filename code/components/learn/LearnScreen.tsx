"use client";

import { LessonArt } from "@/components/learn/LessonArt";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { copy } from "@/lib/copy";
import {
  LESSONS,
  type LessonId,
  readDoneLessons,
} from "@/lib/lessons";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function LearnScreen() {
  const router = useRouter();
  const search = useSearchParams();
  const [active, setActive] = useState<LessonId | null>(null);
  const [done, setDone] = useState<LessonId[]>([]);

  useEffect(() => {
    setDone(readDoneLessons());
  }, []);

  useEffect(() => {
    const q = search.get("lesson");
    if (q && LESSONS.some((l) => l.id === q)) {
      setActive(q as LessonId);
    }
  }, [search]);

  function closeLesson() {
    setActive(null);
    if (search.get("lesson")) {
      router.replace("/learn");
    }
  }

  return (
    <>
      <h1 className="dm-q" style={{ fontSize: 24, lineHeight: "28px" }}>
        {copy.learn.title}
      </h1>
      <span className="dm-small dm-muted">{copy.learn.subtitle}</span>

      <div className="dm-libgrid">
        {LESSONS.map((l) => {
          const isDone = done.includes(l.id);
          return (
            <button
              key={l.id}
              type="button"
              className="dm-libtile"
              onClick={() => setActive(l.id)}
            >
              <span className="art" style={{ background: l.background }}>
                <LessonArt art={l.art} />
                {isDone ? (
                  <span className="done">
                    <Check strokeWidth={2.5} />
                  </span>
                ) : null}
              </span>
              <b>{l.title}</b>
              <small>
                {l.time}
                {isDone ? " · done" : ""}
              </small>
            </button>
          );
        })}
      </div>

      {active ? (
        <LessonPlayer
          lessonId={active}
          doneCount={
            done.includes(active) ? done.length : done.length + 1
          }
          totalCount={LESSONS.length}
          onClose={closeLesson}
          onComplete={(id) => {
            setDone((prev) =>
              prev.includes(id) ? prev : [...prev, id],
            );
          }}
        />
      ) : null}
    </>
  );
}
