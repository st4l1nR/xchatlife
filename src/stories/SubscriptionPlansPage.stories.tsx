import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SubscriptionPlansPage from "@/app/_components/pages/SubscriptionPlansPage";

const meta = {
  title: "Pages/SubscriptionPlansPage",
  component: SubscriptionPlansPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SubscriptionPlansPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default Story
// ============================================================================
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Full subscription plans page with 3-column layout on desktop. Shows promotional section on left, subscription plan cards in center, and premium benefits on right.",
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
          "Mobile view of the subscription plans page. Side columns are hidden, benefits shown below the plan cards.",
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
        story:
          "Tablet view of the subscription plans page. Similar to mobile, side columns are hidden.",
      },
    },
  },
};

// ============================================================================
// With Custom Mock Data
// ============================================================================
export const WithCustomMock: Story = {
  args: {
    mock: {
      plans: [
        {
          id: "yearly",
          label: "Yearly",
          months: 12,
          originalPrice: 19.99,
          price: 4.99,
          discountPercent: 75,
          isBestChoice: true,
          totalPrice: 59.88,
        },
        {
          id: "monthly",
          label: "Monthly",
          months: 1,
          originalPrice: null,
          price: 19.99,
          discountPercent: null,
          isBestChoice: false,
          totalPrice: 19.99,
        },
      ],
      benefits: [
        "Unlimited AI companions",
        "Priority support",
        "Early access to new features",
        "No ads",
      ],
      promotionalText: {
        title: "Limited Time Offer",
        subtitle: "Save Big Today!",
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Subscription plans page with custom mock data showing different plans, benefits, and promotional text.",
      },
    },
  },
};

// ============================================================================
// Black Friday Theme
// ============================================================================
export const BlackFridayPromo: Story = {
  args: {
    mock: {
      plans: [
        {
          id: "annually",
          label: "12 months",
          months: 12,
          originalPrice: 12.99,
          price: 2.99,
          discountPercent: 77,
          isBestChoice: true,
          totalPrice: 35.88,
        },
        {
          id: "quarterly",
          label: "3 months",
          months: 3,
          originalPrice: 12.99,
          price: 5.99,
          discountPercent: 54,
          isBestChoice: false,
          totalPrice: 17.97,
        },
        {
          id: "monthly",
          label: "1 month",
          months: 1,
          originalPrice: 12.99,
          price: 9.99,
          discountPercent: 23,
          isBestChoice: false,
          totalPrice: 9.99,
        },
      ],
      promotionalText: {
        title: "Black Friday Sale",
        subtitle: "Biggest Discount Ever!",
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Special Black Friday promotional variant with enhanced discounts.",
      },
    },
  },
};
