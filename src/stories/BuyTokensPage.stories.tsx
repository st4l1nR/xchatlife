import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import BuyTokensPage from "@/app/_components/pages/BuyTokensPage";

const meta = {
  title: "Pages/BuyTokensPage",
  component: BuyTokensPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BuyTokensPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - Desktop View
// ============================================================================
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Full Buy Tokens page with 3-column layout showing promotional images, token packages, and benefits.",
      },
    },
  },
};

// ============================================================================
// Mobile View
// ============================================================================
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view where side images are hidden and the layout is optimized for smaller screens.",
      },
    },
  },
};

// ============================================================================
// Tablet View
// ============================================================================
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Tablet view showing the responsive behavior at medium widths.",
      },
    },
  },
};

// ============================================================================
// Large Desktop View
// ============================================================================
export const LargeDesktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
    docs: {
      description: {
        story:
          "Large desktop view with full 3-column layout including decorative images.",
      },
    },
  },
};
