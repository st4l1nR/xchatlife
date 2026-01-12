import "@/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "@/trpc/react";
import ProviderTheme from "./_components/organisms/ProviderTheme";
import SkeletonTheme from "./_components/organisms/SkeletonTheme";
import TemplateAppConditional from "./_components/templates/TemplateAppConditional";
import { AppContextProvider } from "./_contexts/AppContext";

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
              <AppContextProvider>
                <TemplateAppConditional>{children}</TemplateAppConditional>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "var(--popover)",
                      color: "var(--popover-foreground)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      padding: "12px 16px",
                      fontSize: "14px",
                    },
                    success: {
                      iconTheme: {
                        primary: "var(--primary)",
                        secondary: "var(--primary-foreground)",
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "var(--destructive)",
                        secondary: "var(--destructive-foreground)",
                      },
                    },
                  }}
                />
              </AppContextProvider>
            </TRPCReactProvider>
          </SkeletonTheme>
        </ProviderTheme>
      </body>
    </html>
  );
}
