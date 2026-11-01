"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { useToast } from "@/components/feedback/Toast";
import {
  flagCodeFor,
  LangFlag,
  LANGUAGES,
} from "@/components/home/LanguageFlags";
import { useLocale } from "@/components/locale/LocaleProvider";
import { cn } from "@/lib/cn";
import { getPersona, readPersonaId, type Persona } from "@/lib/personas";
import {
  applyAppearance,
  languageToast,
  markAppearance,
  markReminders,
  markTextSize,
  readAppearance,
  readReminders,
  readTextSize,
  remindersOn,
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

function meProfile(
  p: Persona,
  planningWith: (partner: string) => string,
  planningAlone: string,
): { name: string; line: string; initial: string } {
  if (p.id === "lena") {
    return {
      name: "Lena Meier",
      line: planningWith("Marco"),
      initial: "L",
    };
  }
  if (p.id === "noah") {
    return {
      name: "Noah",
      line: planningAlone,
      initial: "N",
    };
  }
  if (p.id === "sandra") {
    return {
      name: "Sandra",
      line: planningAlone,
      initial: "S",
    };
  }
  return {
    name: "Ruth",
    line: planningWith("Peter"),
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
  const { language, setLanguage, copy } = useLocale();
  const t = copy.settings;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [persona, setPersona] = useState<Persona>(() => getPersona("lena"));
  const [appearance, setAppearance] = useState<Appearance>("System");
  const [textSize, setTextSize] = useState<TextSize>("Standard");
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
    const r = readReminders();
    setAppearance(a);
    setTextSize(s);
    setReminders(r);
    setDraftLanguage(language);
    applyAppearance(a);
  }, [language]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.style.setProperty("zoom", textSizeZoom(textSize));
  }, [textSize]);

  const profile = meProfile(persona, t.planningWith, t.planningAlone);
  const remLabel = remindersOn(reminders) ? t.remLabelOn : t.remLabelOff;
  const appearanceLabel =
    appearance === "Light"
      ? t.appearanceLight
      : appearance === "Dark"
        ? t.appearanceDark
        : t.appearanceSystem;
  const textSizeLabel =
    textSize === "Smaller"
      ? t.sizeSmaller
      : textSize === "Larger"
        ? t.sizeLarger
        : t.sizeStandard;
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

      <p className="dm-lgroup">{t.groupUse}</p>
      <Li
        title={t.whatWeKnow}
        subtitle={t.factsCount(18)}
        icon={
          <Icon>
            <path d="M12 3l9 9-9 9-9-9z" />
          </Icon>
        }
        onClick={() => router.push("/me/know")}
      />
      <Li
        title={t.documents}
        subtitle={t.papersCount(4)}
        icon={
          <Icon>
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v4h4" />
          </Icon>
        }
        onClick={() => router.push("/me/docs")}
      />
      <Li
        title={t.connected}
        subtitle="myPax"
        icon={
          <Icon>
            <path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" />
          </Icon>
        }
        onClick={() => toast.show({ message: t.mypaxConnected })}
      />

      <p className="dm-lgroup">{t.groupPeople}</p>
      {showPartner ? (
        <Li
          title={partnerName}
          subtitle={t.sharesPlans}
          icon={
            <Icon>
              <circle cx="9" cy="8" r="3.5" />
              <circle cx="17" cy="9" r="2.5" />
              <path d="M3 20c1-3.5 3.5-5 6-5s5 1.5 6 5M15 15c2.5 0 4.5 1.5 5.5 4" />
            </Icon>
          }
          onClick={() =>
            toast.show({
              message: t.partnerSees(partnerName),
            })
          }
        />
      ) : null}
      <Li
        title={t.yourAdvisor}
        subtitle={t.advisorMeta}
        icon={
          <Icon>
            <path d="M4 5h16v11H9l-5 4z" />
          </Icon>
        }
        onClick={() => router.push("/me/book")}
      />

      <p className="dm-lgroup">{t.groupApp}</p>
      <Li
        title={t.reminders}
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
        title={t.appearance}
        value={appearanceLabel}
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
        title={t.textSize}
        value={textSizeLabel}
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
        title={t.language}
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

      <p className="dm-lgroup">{t.groupPrivacy}</p>
      <Li
        title={t.privacy}
        subtitle={t.privacySub}
        icon={
          <Icon>
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </Icon>
        }
        onClick={() => router.push("/me/privacy")}
      />

      <p className="dm-lgroup">{t.groupMore}</p>
      <Li
        title={t.help}
        icon={
          <Icon>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" />
          </Icon>
        }
        onClick={() => toast.show({ message: t.helpToast })}
      />
      <Li
        title={t.logOut}
        plain
        icon={
          <Icon>
            <path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10" />
          </Icon>
        }
        onClick={() => {
          toast.show({ message: t.logOutToast });
          router.push("/signup");
        }}
      />

    </div>

      <BottomSheet
        open={sheet === "rem"}
        onClose={() => setSheet(null)}
        title={t.reminders}
      >
        <div className="dm-stack" style={{ gap: 0 }}>
          <div className="dm-li">
            <span className="ic">
              <Icon>
                <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" />
              </Icon>
            </span>
            <span className="tx">
              {t.remDeadlines}
              <small>{t.remDeadlinesSub}</small>
            </span>
            <span className="rt">
              <button
                type="button"
                className="dm-switch"
                role="switch"
                aria-checked={draftReminders.deadlines}
                aria-label={t.remDeadlines}
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
              {t.remWeekly}
              <small>{t.remWeeklySub}</small>
            </span>
            <span className="rt">
              <button
                type="button"
                className="dm-switch"
                role="switch"
                aria-checked={draftReminders.weekly}
                aria-label={t.remWeekly}
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
              message: remindersOn(draftReminders) ? t.remOn : t.remOff,
            });
          }}
        >
          {t.done}
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "theme"}
        onClose={() => setSheet(null)}
        title={t.appearance}
      >
        <div className="dm-stack" style={{ gap: 0 }} role="radiogroup">
          {(
            [
              { v: "Light" as const, label: t.appearanceLight },
              { v: "Dark" as const, label: t.appearanceDark },
              {
                v: "System" as const,
                label: t.appearanceSystem,
                sub: t.appearanceSystemSub,
              },
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
                {opt.label}
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
            const label =
              draftAppearance === "Light"
                ? t.appearanceLight
                : draftAppearance === "Dark"
                  ? t.appearanceDark
                  : t.appearanceSystem;
            toast.show({
              message:
                draftAppearance === "Dark"
                  ? t.appearanceDarkOn
                  : t.appearanceToast(label),
            });
          }}
        >
          {t.done}
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "size"}
        onClose={() => setSheet(null)}
        title={t.textSize}
      >
        <div className="dm-stack" style={{ gap: 0 }} role="radiogroup">
          {(
            [
              { v: "Smaller" as const, label: t.sizeSmaller },
              { v: "Standard" as const, label: t.sizeStandard },
              {
                v: "Larger" as const,
                label: t.sizeLarger,
                sub: t.sizeLargerSub,
              },
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
                {opt.label}
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
            const label =
              draftSize === "Smaller"
                ? t.sizeSmaller
                : draftSize === "Larger"
                  ? t.sizeLarger
                  : t.sizeStandard;
            toast.show({ message: t.sizeToast(label) });
          }}
        >
          {t.done}
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "lang"}
        onClose={() => setSheet(null)}
        title={t.language}
      >
        <div
          className="dm-stack"
          style={{ gap: 0 }}
          role="radiogroup"
          aria-label={t.language}
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
            setLanguage(draftLanguage);
            setSheet(null);
            toast.show({ message: languageToast(draftLanguage) });
          }}
        >
          {t.done}
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
