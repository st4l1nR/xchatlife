import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AsideTicketSummary from "@/app/_components/organisms/AsideTicketSummary";

const meta = {
  title: "Organisms/AsideTicketSummary",
  component: AsideTicketSummary,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
  args: {
    ticketId: "clwk123456789abcdefgh",
    status: "open",
    priority: "normal",
    category: "account",
    createdAt: "Jan 15, 2026",
    updatedAt: "Jan 16, 2026",
    description:
      "I am unable to access my account after resetting my password. When I try to log in with the new password, I get an error message saying my credentials are invalid. I have tried resetting the password multiple times but the issue persists.",
    userName: "Jane Customer",
    userEmail: "jane.customer@example.com",
    userAvatarSrc: "https://i.pravatar.cc/150?u=jane",
  },
} satisfies Meta<typeof AsideTicketSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default (Open, Unassigned)
// ============================================================================
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default aside summary for an open, unassigned ticket.",
      },
    },
  },
};

// ============================================================================
// Assigned
// ============================================================================
export const Assigned: Story = {
  args: {
    status: "in_progress",
    assignedToName: "John Admin",
    assignedToEmail: "john.admin@example.com",
    assignedToAvatarSrc: "https://i.pravatar.cc/150?u=john",
  },
  parameters: {
    docs: {
      description: {
        story: "Aside summary for a ticket assigned to a team member.",
      },
    },
  },
};

// ============================================================================
// Resolved
// ============================================================================
export const Resolved: Story = {
  args: {
    status: "resolved",
    resolvedAt: "Jan 17, 2026",
    assignedToName: "Sarah Support",
    assignedToEmail: "sarah.support@example.com",
    assignedToAvatarSrc: "https://i.pravatar.cc/150?u=sarah",
  },
  parameters: {
    docs: {
      description: {
        story: "Aside summary for a resolved ticket showing resolution date.",
      },
    },
  },
};

// ============================================================================
// Closed
// ============================================================================
export const Closed: Story = {
  args: {
    status: "closed",
    resolvedAt: "Jan 17, 2026",
    assignedToName: "Mike Manager",
    assignedToEmail: "mike.manager@example.com",
  },
  parameters: {
    docs: {
      description: {
        story: "Aside summary for a closed ticket.",
      },
    },
  },
};

// ============================================================================
// Urgent Priority
// ============================================================================
export const UrgentPriority: Story = {
  args: {
    priority: "urgent",
    category: "billing",
    description:
      "URGENT: My payment failed but I was still charged! This is the third time this has happened and I need immediate assistance. Please help resolve this billing issue as soon as possible.",
    assignedToName: "Emily Expert",
    assignedToEmail: "emily.expert@example.com",
    assignedToAvatarSrc: "https://i.pravatar.cc/150?u=emily",
  },
  parameters: {
    docs: {
      description: {
        story: "Aside summary with urgent priority and billing category.",
      },
    },
  },
};

// ============================================================================
// Technical Category
// ============================================================================
export const TechnicalCategory: Story = {
  args: {
    priority: "high",
    category: "technical",
    description:
      "The API integration is returning 500 errors after the latest update. Stack trace included below:\n\nError: Connection refused\n  at connect (api.js:123)\n  at main (index.js:45)",
  },
  parameters: {
    docs: {
      description: {
        story: "Aside summary for a technical ticket with code in description.",
      },
    },
  },
};

// ============================================================================
// Without Avatars
// ============================================================================
export const WithoutAvatars: Story = {
  args: {
    userAvatarSrc: undefined,
    assignedToName: "Support Team",
    assignedToEmail: "support@example.com",
    assignedToAvatarSrc: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: "Aside summary when users have no avatars - shows initials.",
      },
    },
  },
};

// ============================================================================
// Long Description
// ============================================================================
export const LongDescription: Story = {
  args: {
    description: `I am experiencing multiple issues with my account:

1. I cannot reset my password - the email never arrives
2. When I finally got access, my subscription was cancelled
3. All my saved data seems to be missing
4. The mobile app crashes when I try to log in
5. Customer support chat is not loading

I have already tried:
- Clearing browser cache
- Trying different browsers
- Uninstalling and reinstalling the app
- Checking my email spam folder

This has been ongoing for 3 days and I really need this resolved urgently as I use this for work.`,
  },
  parameters: {
    docs: {
      description: {
        story: "Aside summary with a very long, detailed description.",
      },
    },
  },
};

// ============================================================================
// Content Category
// ============================================================================
export const ContentCategory: Story = {
  args: {
    category: "content",
    priority: "low",
    description:
      "There is a typo on the pricing page. It says 'anually' instead of 'annually'. Just wanted to let you know!",
  },
  parameters: {
    docs: {
      description: {
        story: "Aside summary for a content-related ticket with low priority.",
      },
    },
  },
};
