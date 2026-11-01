"use client";

import { LessonArt } from "@/components/learn/LessonArt";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { PageColumn } from "@/components/layout/PageColumn";
import { copy } from "@/lib/copy";
import {
  LESSONS,
  type LessonId,
  readDoneLessons,
} from "@/lib/lessons";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const NEW_LESSON_IDS = new Set([
  "three-pillars",
  "ahv-part-1",
  "ahv-part-2",
]);

function showNewBadge(
  lesson: (typeof LESSONS)[number],
  isDone: boolean,
): boolean {
  if (isDone) return false;
  if ("isNew" in lesson && typeof (lesson as { isNew?: boolean }).isNew === "boolean") {
    return Boolean((lesson as { isNew?: boolean }).isNew);
  }
  return NEW_LESSON_IDS.has(lesson.id);
}

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
    <PageColumn kind="learn">
      <p className="dm-q" style={{ fontSize: 24, lineHeight: "28px" }}>
        {copy.learn.title}
      </p>
      <span className="dm-small dm-muted">{copy.learn.subtitle}</span>

      <div className="dm-libgrid">
        {LESSONS.map((l) => {
          const isDone = done.includes(l.id);
          const isNew = showNewBadge(l, isDone);
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
                ) : isNew ? (
                  <em className="new">New</em>
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
    </PageColumn>
  );
}
