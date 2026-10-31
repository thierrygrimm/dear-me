import type { LessonMeta } from "@/lib/lessons";

type Props = {
  art: LessonMeta["art"];
};

export function LessonArt({ art }: Props) {
  if (art === "pillars") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 8,
          paddingBottom: 22,
        }}
      >
        <i
          style={{
            width: 22,
            height: "70%",
            background: "#FAF7F0",
            borderRadius: 6,
          }}
        />
        <i
          style={{
            width: 22,
            height: "48%",
            background: "#ECFF23",
            borderRadius: 6,
          }}
        />
        <i
          style={{
            width: 22,
            height: "24%",
            background: "#FF80AC",
            borderRadius: 6,
          }}
        />
      </div>
    );
  }

  if (art === "part-time") {
    return (
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          top: "40%",
          height: 26,
          borderRadius: 8,
          background:
            "repeating-linear-gradient(135deg,rgba(10,5,7,.35) 0 5px,rgba(10,5,7,.15) 5px 10px)",
          overflow: "hidden",
        }}
      >
        <i
          style={{
            position: "absolute",
            left: "35%",
            top: 0,
            bottom: 0,
            width: "30%",
            background: "#0A0507",
          }}
        />
      </div>
    );
  }

  if (art === "certificate") {
    return (
      <div
        style={{
          position: "absolute",
          inset: "18px 26px",
          background: "#fff",
          borderRadius: 6,
          boxShadow: "0 6px 16px rgba(10,5,7,.12)",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <i style={{ height: 5, background: "#e8e2d6", display: "block" }} />
        <i style={{ height: 5, background: "#ECFF23", display: "block" }} />
        <i style={{ height: 5, background: "#e8e2d6", display: "block" }} />
        <i style={{ height: 5, background: "#e8e2d6", display: "block" }} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <i
        style={{
          width: 70,
          height: 88,
          background: "#FF80AC",
          clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)",
          display: "block",
        }}
      />
    </div>
  );
}
