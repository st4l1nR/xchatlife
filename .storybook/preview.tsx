import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { TRPCReactProvider } from "../src/trpc/react";
import SkeletonTheme from "../src/app/_components/organisms/SkeletonTheme";
import { AppContextProvider } from "../src/app/_contexts/AppContext";
import { ChatContextProvider } from "../src/app/_contexts/ChatContext";
import ProviderTheme from "../src/app/_components/organisms/ProviderTheme";

// Mock session for Storybook
const mockSession = {
  user: {
    id: "mock-user-id",
    name: "John Doe",
    email: "john.doe@example.com",
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "oklch(0.9582 0.0152 90.2357)",
        },
        {
          name: "dark",
          value: "oklch(0 0 0)",
        },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    nextauth: {
      session: mockSession,
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        query: {},
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
      parentSelector: "html",
    }),
    // Providers wrapper (TRPCReactProvider + AppContextProvider + ChatContextProvider + SkeletonTheme + ProviderTheme)
    (Story) => {
      return (
        <TRPCReactProvider>
          <ProviderTheme>
            <AppContextProvider>
              <ChatContextProvider>
                <SkeletonTheme>
                  <Story />
                </SkeletonTheme>
              </ChatContextProvider>
            </AppContextProvider>
          </ProviderTheme>
        </TRPCReactProvider>
      );
    },
  ],
};

export default preview;
