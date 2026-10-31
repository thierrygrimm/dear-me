"use client";

import { SettingsList } from "@/components/home/Settings";
import { copy } from "@/lib/copy";
import {
  Bell,
  FileText,
  HelpCircle,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MePage() {
  const router = useRouter();
  const [share, setShare] = useState(false);

  return (
    <>
      <div className="dm-row" style={{ gap: 14, alignItems: "center" }}>
        <span className="dm-avatar" aria-hidden>
          L
        </span>
        <div>
          <h1 className="dm-hello" style={{ fontSize: 24 }}>
            Lena
          </h1>
          <p className="dm-small dm-muted" style={{ margin: 0 }}>
            {copy.me.title}
          </p>
        </div>
      </div>

      <SettingsList
        sections={[
          {
            id: "data",
            title: "Your data",
            rows: [
              {
                id: "know",
                title: copy.me.whatWeKnow,
                subtitle: "12 facts · edit anytime",
                icon: <UserRound strokeWidth={1.75} />,
                value: "12",
                onClick: () => router.push("/me/know"),
              },
              {
                id: "docs",
                title: copy.me.documents,
                subtitle: "Certificates, AHV, 3a",
                icon: <FileText strokeWidth={1.75} />,
                onClick: () => router.push("/me/docs"),
              },
            ],
          },
          {
            id: "privacy",
            title: copy.me.privacy,
            rows: [
              {
                id: "privacy-page",
                title: "Privacy and data",
                subtitle: "Sharing, analytics, delete",
                icon: <Shield strokeWidth={1.75} />,
                onClick: () => router.push("/me/privacy"),
              },
              {
                id: "share",
                title: "Share with Pax",
                subtitle: "Off by default",
                icon: <Shield strokeWidth={1.75} />,
                switchChecked: share,
                onToggle: setShare,
              },
              {
                id: "reminders",
                title: copy.me.reminders,
                subtitle: "Email and calendar",
                icon: <Bell strokeWidth={1.75} />,
              },
            ],
          },
          {
            id: "more",
            title: "More",
            rows: [
              {
                id: "partner",
                title: copy.me.partner,
                icon: <Sparkles strokeWidth={1.75} />,
                value: "Pax",
                onClick: () => router.push("/me/book"),
              },
              {
                id: "help",
                title: copy.me.help,
                icon: <HelpCircle strokeWidth={1.75} />,
              },
            ],
          },
        ]}
      />
    </>
  );
}
