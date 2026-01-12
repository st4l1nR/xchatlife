import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarDashboard } from "@/app/_components/organisms/SidebarDashboard";

const meta = {
  title: "Organisms/SidebarDashboard",
  component: SidebarDashboard,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/dashboard",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRolesExpanded: Story = {
  args: {
    defaultExpandedSections: ["Roles"],
  },
};

export const RolesActive: Story = {
  args: {
    defaultExpandedSections: ["Roles"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/roles",
      },
    },
  },
};

export const UsersActive: Story = {
  args: {
    defaultExpandedSections: ["Users"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/users",
      },
    },
  },
};

export const CharactersExpanded: Story = {
  args: {
    defaultExpandedSections: ["Characters"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/characters",
      },
    },
  },
};

export const CharactersKinksActive: Story = {
  args: {
    defaultExpandedSections: ["Characters"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/characters/kinks",
      },
    },
  },
};

export const VisualNovelsActive: Story = {
  args: {
    defaultExpandedSections: ["Visual Novels"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/visual-novels",
      },
    },
  },
};

export const TransactionsActive: Story = {
  args: {
    defaultExpandedSections: ["Transactions"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/transactions",
      },
    },
  },
};

export const AffiliatesActive: Story = {
  args: {
    defaultExpandedSections: ["Affiliates"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/affiliates",
      },
    },
  },
};

export const SupportTicketsActive: Story = {
  args: {
    defaultExpandedSections: ["Support tickets"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/support-tickets",
      },
    },
  },
};

export const SupportTicketsOpenActive: Story = {
  args: {
    defaultExpandedSections: ["Support tickets"],
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/dashboard/support-tickets/open",
      },
    },
  },
};

export const MultipleSectionsExpanded: Story = {
  args: {
    defaultExpandedSections: ["Roles", "Users", "Characters"],
  },
};
