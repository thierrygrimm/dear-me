import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Chivo_Mono, Geist, Host_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/feedback/Toast";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-display-family",
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
  icons: {
    icon: "/logos/app-icon-dark.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hostGrotesk.variable} ${geist.variable} ${chivoMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full"
        style={
          {
            ["--font-display" as string]:
              "var(--font-display-family), system-ui, sans-serif",
          } as CSSProperties
        }
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
