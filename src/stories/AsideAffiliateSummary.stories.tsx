import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import AsideAffiliateSummary from "@/app/_components/organisms/AsideAffiliateSummary";

const meta = {
  title: "Organisms/AsideAffiliateSummary",
  component: AsideAffiliateSummary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Affiliate's name",
    },
    email: {
      control: "text",
      description: "Affiliate's email address",
    },
    type: {
      control: "select",
      options: [
        "influencer",
        "blogger",
        "youtuber",
        "social_media",
        "website_owner",
        "email_marketing",
        "other",
      ],
      description: "Type of affiliate",
    },
    status: {
      control: "select",
      options: ["pending", "approved", "rejected"],
      description: "Application status",
    },
    websiteUrl: {
      control: "text",
      description: "Affiliate's website URL",
    },
    telegram: {
      control: "text",
      description: "Affiliate's Telegram handle",
    },
    introduction: {
      control: "text",
      description: "Affiliate's introduction text",
    },
    promotionalMethods: {
      control: "text",
      description: "Promotional methods description",
    },
    rejectionReason: {
      control: "text",
      description: "Reason for rejection (if rejected)",
    },
    referralCode: {
      control: "text",
      description: "Referral code (if approved)",
    },
    commissionRate: {
      control: "number",
      description: "Commission rate (0-1)",
    },
    totalEarned: {
      control: "number",
      description: "Total earnings",
    },
    isActive: {
      control: "boolean",
      description: "Whether affiliate is active",
    },
    appliedAt: {
      control: "text",
      description: "Application date",
    },
    approvedAt: {
      control: "text",
      description: "Approval date (if approved)",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AsideAffiliateSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// STORIES
// ============================================

export const Default: Story = {
  args: {
    name: "John Doe",
    email: "john.doe@example.com",
    type: "influencer",
    status: "approved",
    websiteUrl: "https://johndoe.com",
    telegram: "@johndoe",
    introduction: "I'm a content creator with 500k followers on Instagram.",
    promotionalMethods:
      "Social media posts, YouTube videos, and email newsletters.",
    referralCode: "JOHN2024",
    commissionRate: 0.4,
    totalEarned: 1250.5,
    isActive: true,
    appliedAt: "Jan 15, 2024",
    approvedAt: "Jan 20, 2024",
  },
};

export const PendingApplication: Story = {
  args: {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    type: "blogger",
    status: "pending",
    websiteUrl: "https://janeblog.com",
    telegram: "@janesmith",
    introduction: "I run a popular lifestyle blog with 50k monthly visitors.",
    promotionalMethods: "Blog posts, Pinterest, and affiliate links.",
    appliedAt: "Mar 10, 2024",
  },
};

export const RejectedApplication: Story = {
  args: {
    name: "Mike Wilson",
    email: "mike@example.com",
    type: "youtuber",
    status: "rejected",
    websiteUrl: "https://youtube.com/@mikewilson",
    introduction: "I create tech review videos.",
    promotionalMethods: "YouTube videos and community posts.",
    rejectionReason:
      "Insufficient audience size. Please reapply when you have at least 10,000 subscribers.",
    appliedAt: "Feb 5, 2024",
  },
};

export const ApprovedInactive: Story = {
  name: "Approved but Inactive",
  args: {
    name: "Sarah Connor",
    email: "sarah@example.com",
    type: "social_media",
    status: "approved",
    websiteUrl: "https://twitter.com/sarah",
    telegram: "@sarahconnor",
    referralCode: "SARAH123",
    commissionRate: 0.35,
    totalEarned: 0,
    isActive: false,
    appliedAt: "Dec 1, 2023",
    approvedAt: "Dec 5, 2023",
  },
};

export const HighEarner: Story = {
  name: "High Earning Affiliate",
  args: {
    name: "Top Affiliate",
    email: "top@affiliate.com",
    type: "website_owner",
    status: "approved",
    websiteUrl: "https://bestdeals.com",
    telegram: "@topaffiliate",
    introduction:
      "I own a deals website with over 500k monthly unique visitors. We specialize in AI and tech products.",
    promotionalMethods:
      "Dedicated landing pages, email campaigns to 100k subscribers, and banner ads.",
    referralCode: "TOP2024",
    commissionRate: 0.5,
    totalEarned: 15750.25,
    isActive: true,
    appliedAt: "Jun 1, 2023",
    approvedAt: "Jun 3, 2023",
  },
};

export const EmailMarketer: Story = {
  name: "Email Marketing Affiliate",
  args: {
    name: "Email Pro",
    email: "pro@emailmarketing.com",
    type: "email_marketing",
    status: "approved",
    websiteUrl: "https://newsletter.pro",
    introduction:
      "I run multiple tech newsletters with combined 200k subscribers.",
    promotionalMethods:
      "Dedicated email blasts and sponsored newsletter sections.",
    referralCode: "EMAIL24",
    commissionRate: 0.45,
    totalEarned: 3200.0,
    isActive: true,
    appliedAt: "Sep 15, 2023",
    approvedAt: "Sep 18, 2023",
  },
};

export const AboutOnly: Story = {
  name: "About Section Only",
  args: {
    name: "New Applicant",
    email: "new@example.com",
    type: "other",
    status: "pending",
    websiteUrl: "https://example.com",
  },
};

export const StatsOnly: Story = {
  name: "Stats Section Only",
  args: {
    referralCode: "TEST123",
    commissionRate: 0.4,
    totalEarned: 500.0,
    isActive: true,
    appliedAt: "Jan 1, 2024",
    approvedAt: "Jan 5, 2024",
  },
};

export const MinimalData: Story = {
  args: {
    name: "Minimal User",
    status: "pending",
  },
};
