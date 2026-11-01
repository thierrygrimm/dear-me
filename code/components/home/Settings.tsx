"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { useToast } from "@/components/feedback/Toast";
import {
  flagCodeFor,
  LangFlag,
  LANGUAGES,
} from "@/components/home/LanguageFlags";
import { cn } from "@/lib/cn";
import { getPersona, readPersonaId, type Persona } from "@/lib/personas";
import {
  applyAppearance,
  languageToast,
  markAppearance,
  markLanguage,
  markReminders,
  markTextSize,
  readAppearance,
  readLanguage,
  readReminders,
  readTextSize,
  remindersLabel,
  textSizeZoom,
  type Appearance,
  type AppLanguage,
  type TextSize,
} from "@/lib/settingsPrefs";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";

function Icon({ children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...rest}>
      {children}
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

function meProfile(p: Persona): { name: string; line: string; initial: string } {
  if (p.id === "lena") {
    return {
      name: "Lena Meier",
      line: "Planning with Marco · since Oct 2026",
      initial: "L",
    };
  }
  if (p.id === "noah") {
    return {
      name: "Noah",
      line: "Planning alone · since Oct 2026",
      initial: "N",
    };
  }
  if (p.id === "sandra") {
    return {
      name: "Sandra",
      line: "Planning alone · since Oct 2026",
      initial: "S",
    };
  }
  return {
    name: "Ruth",
    line: "Planning with Peter · since Oct 2026",
    initial: "R",
  };
}

type LiProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  value?: ReactNode;
  plain?: boolean;
  danger?: boolean;
  onClick?: () => void;
};

function Li({
  icon,
  title,
  subtitle,
  value,
  plain,
  danger,
  onClick,
}: LiProps) {
  return (
    <button
      type="button"
      className={cn("dm-li", plain && "plain", danger && "danger")}
      onClick={onClick}
    >
      <span className="ic">{icon}</span>
      <span className="tx">
        {title}
        {subtitle ? <small>{subtitle}</small> : null}
      </span>
      <span className="rt">
        {value}
        {!plain ? <Chevron /> : null}
      </span>
    </button>
  );
}

/**
 * DS Settings A · You — Me tab hub.
 * What we use · People · App (reminders, appearance, text size, language) · Privacy · More.
 */
export function SettingsYou() {
  const router = useRouter();
  const toast = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [persona, setPersona] = useState<Persona>(() => getPersona("lena"));
  const [appearance, setAppearance] = useState<Appearance>("System");
  const [textSize, setTextSize] = useState<TextSize>("Standard");
  const [language, setLanguage] = useState<AppLanguage>("English");
  const [reminders, setReminders] = useState({
    deadlines: true,
    weekly: false,
  });
  const [sheet, setSheet] = useState<
    "rem" | "theme" | "size" | "lang" | null
  >(null);
  const [draftAppearance, setDraftAppearance] =
    useState<Appearance>("System");
  const [draftSize, setDraftSize] = useState<TextSize>("Standard");
  const [draftLanguage, setDraftLanguage] = useState<AppLanguage>("English");
  const [draftReminders, setDraftReminders] = useState({
    deadlines: true,
    weekly: false,
  });

  useEffect(() => {
    setPersona(getPersona(readPersonaId()));
    const a = readAppearance();
    const s = readTextSize();
    const l = readLanguage();
    const r = readReminders();
    setAppearance(a);
    setTextSize(s);
    setLanguage(l);
    setReminders(r);
    applyAppearance(a);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.style.setProperty("zoom", textSizeZoom(textSize));
  }, [textSize]);

  const profile = meProfile(persona);
  const remLabel = remindersLabel(reminders);
  const showPartner = persona.id === "lena" || persona.id === "ruth";
  const partnerName = persona.id === "ruth" ? "Peter" : "Marco";

  return (
    <>
    <div className="dm-lscroll" ref={scrollRef}>
      <div className="dm-me">
        <span className="av">{profile.initial}</span>
        <span>
          <b>{profile.name}</b>
          <span>{profile.line}</span>
        </span>
      </div>

      <p className="dm-lgroup">What we use</p>
      <Li
        title="What we know"
        subtitle="18 facts"
        icon={
          <Icon>
            <path d="M12 3l9 9-9 9-9-9z" />
          </Icon>
        }
        onClick={() => router.push("/me/know")}
      />
      <Li
        title="Documents"
        subtitle="4 papers"
        icon={
          <Icon>
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v4h4" />
          </Icon>
        }
        onClick={() => router.push("/me/docs")}
      />
      <Li
        title="Connected"
        subtitle="myPax"
        icon={
          <Icon>
            <path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" />
          </Icon>
        }
        onClick={() => toast.show({ message: "myPax is connected." })}
      />

      <p className="dm-lgroup">People</p>
      {showPartner ? (
        <Li
          title={partnerName}
          subtitle="Shares your plans"
          icon={
            <Icon>
              <circle cx="9" cy="8" r="3.5" />
              <circle cx="17" cy="9" r="2.5" />
              <path d="M3 20c1-3.5 3.5-5 6-5s5 1.5 6 5M15 15c2.5 0 4.5 1.5 5.5 4" />
            </Icon>
          }
          onClick={() =>
            toast.show({
              message: `${partnerName} sees shared plans, not your salary.`,
            })
          }
        />
      ) : null}
      <Li
        title="Your advisor"
        subtitle="Sara Keller, Pax"
        icon={
          <Icon>
            <path d="M4 5h16v11H9l-5 4z" />
          </Icon>
        }
        onClick={() => router.push("/me/book")}
      />

      <p className="dm-lgroup">App</p>
      <Li
        title="Reminders"
        value={remLabel}
        icon={
          <Icon>
            <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" />
          </Icon>
        }
        onClick={() => {
          setDraftReminders(reminders);
          setSheet("rem");
        }}
      />
      <Li
        title="Appearance"
        value={appearance}
        icon={
          <Icon>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
          </Icon>
        }
        onClick={() => {
          setDraftAppearance(appearance);
          setSheet("theme");
        }}
      />
      <Li
        title="Text size"
        value={textSize}
        icon={
          <Icon>
            <path d="M5 6h14M12 6v13M8 19h8" />
          </Icon>
        }
        onClick={() => {
          setDraftSize(textSize);
          setSheet("size");
        }}
      />
      <Li
        title="Language"
        value={
          <span className="dm-flagv">
            <LangFlag code={flagCodeFor(language)} />
            {language}
          </span>
        }
        icon={
          <Icon>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
          </Icon>
        }
        onClick={() => {
          setDraftLanguage(language);
          setSheet("lang");
        }}
      />

      <p className="dm-lgroup">Privacy</p>
      <Li
        title="Privacy and data"
        subtitle="Sharing is off unless you turn it on"
        icon={
          <Icon>
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </Icon>
        }
        onClick={() => router.push("/me/privacy")}
      />

      <p className="dm-lgroup">More</p>
      <Li
        title="Help"
        icon={
          <Icon>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" />
          </Icon>
        }
        onClick={() =>
          toast.show({ message: "For demo help, ask in chat or book Sara." })
        }
      />
      <Li
        title="Log out"
        plain
        icon={
          <Icon>
            <path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10" />
          </Icon>
        }
        onClick={() => {
          toast.show({ message: "Signed out of the demo." });
          router.push("/signup");
        }}
      />

    </div>

      <BottomSheet
        open={sheet === "rem"}
        onClose={() => setSheet(null)}
        title="Reminders"
      >
        <div className="dm-stack" style={{ gap: 0 }}>
          <div className="dm-li">
            <span className="ic">
              <Icon>
                <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" />
              </Icon>
            </span>
            <span className="tx">
              Deadlines and next steps
              <small>By email and in the chat</small>
            </span>
            <span className="rt">
              <button
                type="button"
                className="dm-switch"
                role="switch"
                aria-checked={draftReminders.deadlines}
                aria-label="Deadlines and next steps"
                onClick={() =>
                  setDraftReminders((r) => ({
                    ...r,
                    deadlines: !r.deadlines,
                  }))
                }
              />
            </span>
          </div>
          <div className="dm-li">
            <span className="ic">
              <Icon>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </Icon>
            </span>
            <span className="tx">
              Weekly summary
              <small>Sunday evening</small>
            </span>
            <span className="rt">
              <button
                type="button"
                className="dm-switch"
                role="switch"
                aria-checked={draftReminders.weekly}
                aria-label="Weekly summary"
                onClick={() =>
                  setDraftReminders((r) => ({ ...r, weekly: !r.weekly }))
                }
              />
            </span>
          </div>
        </div>
        <button
          type="button"
          className="dm-btn dm-btn--primary dm-btn--block"
          onClick={() => {
            markReminders(draftReminders);
            setReminders(draftReminders);
            setSheet(null);
            toast.show({
              message:
                remindersLabel(draftReminders) === "On"
                  ? "Reminders on"
                  : "Reminders off",
            });
          }}
        >
          Done
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "theme"}
        onClose={() => setSheet(null)}
        title="Appearance"
      >
        <div className="dm-stack" style={{ gap: 0 }} role="radiogroup">
          {(
            [
              { v: "Light" as const },
              { v: "Dark" as const },
              { v: "System" as const, sub: "Follows your phone" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              className="dm-opt"
              role="radio"
              aria-checked={draftAppearance === opt.v}
              onClick={() => setDraftAppearance(opt.v)}
            >
              <span>
                {opt.v}
                {"sub" in opt && opt.sub ? <small>{opt.sub}</small> : null}
              </span>
              <i aria-hidden />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="dm-btn dm-btn--primary dm-btn--block"
          onClick={() => {
            markAppearance(draftAppearance);
            setAppearance(draftAppearance);
            setSheet(null);
            toast.show({
              message:
                draftAppearance === "Dark"
                  ? "Dark mode on"
                  : `Appearance: ${draftAppearance}`,
            });
          }}
        >
          Done
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "size"}
        onClose={() => setSheet(null)}
        title="Text size"
      >
        <div className="dm-stack" style={{ gap: 0 }} role="radiogroup">
          {(
            [
              { v: "Smaller" as const },
              { v: "Standard" as const },
              { v: "Larger" as const, sub: "Easier to read" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              className="dm-opt"
              role="radio"
              aria-checked={draftSize === opt.v}
              onClick={() => setDraftSize(opt.v)}
            >
              <span>
                {opt.v}
                {"sub" in opt && opt.sub ? <small>{opt.sub}</small> : null}
              </span>
              <i aria-hidden />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="dm-btn dm-btn--primary dm-btn--block"
          onClick={() => {
            markTextSize(draftSize);
            setTextSize(draftSize);
            setSheet(null);
            toast.show({ message: `Text size: ${draftSize}` });
          }}
        >
          Done
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "lang"}
        onClose={() => setSheet(null)}
        title="Language"
      >
        <div
          className="dm-stack"
          style={{ gap: 0 }}
          role="radiogroup"
          aria-label="Language"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              className="dm-opt dm-langrow"
              role="radio"
              aria-checked={draftLanguage === lang.id}
              onClick={() => setDraftLanguage(lang.id)}
            >
              <LangFlag code={lang.code} />
              <span>
                {lang.id}
                {lang.id !== "English" ? <small>{lang.label}</small> : null}
              </span>
              <i aria-hidden />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="dm-btn dm-btn--primary dm-btn--block"
          onClick={() => {
            markLanguage(draftLanguage);
            setLanguage(draftLanguage);
            setSheet(null);
            toast.show({ message: languageToast(draftLanguage) });
          }}
        >
          Done
        </button>
      </BottomSheet>
    </>
  );
}

/** Generic grouped list using DS `.dm-lgroup` + `.dm-li`. */
export type SettingsRow = {
  id: string;
  title: string;
  subtitle?: string;
  value?: string;
  icon?: ReactNode;
  danger?: boolean;
  plain?: boolean;
  switchChecked?: boolean;
  onClick?: () => void;
  onToggle?: (next: boolean) => void;
};

type SettingsListProps = {
  sections: { id: string; title: string; rows: SettingsRow[] }[];
  className?: string;
};

export function SettingsList({ sections, className }: SettingsListProps) {
  return (
    <div className={cn(className)}>
      {sections.map((section) => (
        <section key={section.id}>
          <p className="dm-lgroup">{section.title}</p>
          {section.rows.map((row) => {
            if (row.onToggle !== undefined) {
              return (
                <div key={row.id} className="dm-li">
                  {row.icon ? <span className="ic">{row.icon}</span> : null}
                  <span className="tx">
                    {row.title}
                    {row.subtitle ? <small>{row.subtitle}</small> : null}
                  </span>
                  <span className="rt">
                    <button
                      type="button"
                      className="dm-switch"
                      role="switch"
                      aria-checked={row.switchChecked ?? false}
                      aria-label={row.title}
                      onClick={() =>
                        row.onToggle?.(!(row.switchChecked ?? false))
                      }
                    />
                  </span>
                </div>
              );
            }
            return (
              <button
                key={row.id}
                type="button"
                className={cn(
                  "dm-li",
                  row.danger && "danger",
                  row.plain && "plain",
                  !row.icon && "noic",
                )}
                onClick={row.onClick}
              >
                {row.icon ? <span className="ic">{row.icon}</span> : null}
                <span className="tx">
                  {row.title}
                  {row.subtitle ? <small>{row.subtitle}</small> : null}
                </span>
                <span className="rt">
                  {row.value}
                  {!row.plain ? <Chevron /> : null}
                </span>
              </button>
            );
          })}
        </section>
      ))}
    </div>
  );
}
