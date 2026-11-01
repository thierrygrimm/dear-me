import type { Metadata } from "next";
import { Chivo_Mono, Geist, Host_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/feedback/Toast";
import {
  LocaleGate,
  LocaleProvider,
} from "@/components/locale/LocaleProvider";
import "./globals.css";

/**
 * Design system fonts (README → In Next.js):
 * Display Host Grotesk, text Geist, mono Chivo Mono —
 * exposed as --font-display / --font-text / --font-mono.
 */
const hostGrotesk = Host_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-text",
  subsets: ["latin"],
});

const chivoMono = Chivo_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "dear me",
  description: "A planner for life's big moments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hostGrotesk.variable} ${geist.variable} ${chivoMono.variable} h-full`}
    >
      <body className="h-full min-h-full">
        <LocaleProvider>
          <ToastProvider>
            <LocaleGate>{children}</LocaleGate>
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
