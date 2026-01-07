import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import React from "react";
import "../src/styles/globals.css";
import { TRPCReactProvider } from "../src/trpc/react";

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
          value: "oklch(0.2747 0.0139 57.6523)",
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
    // Providers wrapper (SessionProvider + TRPCReactProvider)
    (Story, context) => {
      const session = context.parameters.nextauth?.session ?? mockSession;
      return (
        <TRPCReactProvider>
          <Story />
        </TRPCReactProvider>
      );
    },
  ],
};

export default preview;
