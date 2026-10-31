import { copy } from "@/lib/copy";
import { Check } from "lucide-react";

const lessons = [
  {
    id: "1",
    title: "The three pillars",
    time: "2 min",
    done: true,
    art: "var(--neonweste)",
  },
  {
    id: "2",
    title: "What AHV covers",
    time: "2 min",
    done: false,
    art: "var(--hafermilch)",
  },
  {
    id: "3",
    title: "Pillar 3a room",
    time: "2 min",
    done: false,
    art: "var(--rosa-brille)",
  },
  {
    id: "4",
    title: "Family and money",
    time: "3 min",
    done: false,
    art: "var(--kaugummi)",
  },
];

export default function LearnPage() {
  return (
    <>
      <h1 className="dm-hello">{copy.learn.title}</h1>
      <p className="dm-muted" style={{ margin: 0 }}>
        {copy.learn.empty}
      </p>
      <div className="dm-libgrid">
        {lessons.map((l) => (
          <button key={l.id} type="button" className="dm-libtile">
            <span className="art" style={{ background: l.art }}>
              {l.done ? (
                <span className="done">
                  <Check strokeWidth={2.5} />
                </span>
              ) : null}
            </span>
            <b>{l.title}</b>
            <small>{l.time}</small>
          </button>
        ))}
      </div>
    </>
  );
}
