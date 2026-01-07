import "@/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import ProviderTheme from "./_components/organisms/ProviderTheme";
import SkeletonTheme from "./_components/organisms/SkeletonTheme";
import TemplateDashboard from "./_components/templates/TemplateDashboard";

export const metadata: Metadata = {
  title: "Xchatlife",
  description: "Xchatlife - Chat application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={plusJakartaSans.className}
      suppressHydrationWarning
    >
      <body>
        <ProviderTheme>
          <SkeletonTheme>
            <TRPCReactProvider>
              <TemplateDashboard>{children}</TemplateDashboard>
            </TRPCReactProvider>
          </SkeletonTheme>
        </ProviderTheme>
      </body>
    </html>
  );
}
