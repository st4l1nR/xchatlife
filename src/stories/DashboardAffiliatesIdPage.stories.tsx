import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import DashboardAffiliatesIdPage from "@/app/_components/pages/DashboardAffiliatesIdPage";

const meta = {
  title: "Pages/DashboardAffiliatesIdPage",
  component: DashboardAffiliatesIdPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DashboardAffiliatesIdPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mock: {
      // Header props
      name: "John Doe",
      avatarSrc:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Influencer",
      joinedDate: "January 15, 2024",
      // Aside props
      email: "john.doe@example.com",
      type: "influencer",
      status: "approved",
      websiteUrl: "https://johndoe.com",
      telegram: "@johndoe",
      introduction:
        "I'm a content creator with over 500k followers across multiple platforms. I specialize in tech reviews and AI-related content.",
      promotionalMethods:
        "I create YouTube videos, Instagram posts, and TikTok content. I also have a weekly newsletter with 50k subscribers.",
      referralCode: "JOHN2024",
      commissionRate: 0.4,
      totalEarned: 1250.5,
      isActive: true,
      appliedAt: "Jan 15, 2024",
      approvedAt: "Jan 20, 2024",
    },
  },
};

export const PendingAffiliate: Story = {
  name: "Pending Affiliate",
  args: {
    mock: {
      name: "Jane Smith",
      avatarSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Blogger",
      joinedDate: "March 10, 2024",
      email: "jane.smith@example.com",
      type: "blogger",
      status: "pending",
      websiteUrl: "https://janeblog.com",
      telegram: "@janesmith",
      introduction:
        "I run a popular lifestyle blog with 50k monthly visitors. I focus on wellness, productivity, and technology topics.",
      promotionalMethods:
        "Blog posts with affiliate links, Pinterest pins, and Instagram stories. I also collaborate with other bloggers for cross-promotion.",
      appliedAt: "Mar 10, 2024",
    },
  },
};

export const RejectedAffiliate: Story = {
  name: "Rejected Affiliate",
  args: {
    mock: {
      name: "Mike Wilson",
      role: "YouTuber",
      joinedDate: "February 5, 2024",
      email: "mike@example.com",
      type: "youtuber",
      status: "rejected",
      websiteUrl: "https://youtube.com/@mikewilson",
      introduction: "I create tech review videos on YouTube.",
      promotionalMethods: "YouTube videos and community posts.",
      rejectionReason:
        "Unfortunately, your current audience size does not meet our minimum requirements. Please reapply when you have at least 10,000 subscribers.",
      appliedAt: "Feb 5, 2024",
    },
  },
};

export const HighEarningAffiliate: Story = {
  name: "High Earning Affiliate",
  args: {
    mock: {
      name: "Top Performer",
      avatarSrc:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Website Owner",
      joinedDate: "June 1, 2023",
      email: "top@affiliate.com",
      type: "website_owner",
      status: "approved",
      websiteUrl: "https://bestdeals.com",
      telegram: "@topaffiliate",
      introduction:
        "I own a deals website with over 500k monthly unique visitors. We specialize in AI and tech products, helping users find the best tools for their needs.",
      promotionalMethods:
        "Dedicated landing pages, email campaigns to 100k subscribers, banner ads, and comparison articles. We also run seasonal promotions and exclusive deals.",
      referralCode: "TOP2024",
      commissionRate: 0.5,
      totalEarned: 15750.25,
      isActive: true,
      appliedAt: "Jun 1, 2023",
      approvedAt: "Jun 3, 2023",
    },
  },
};

export const InactiveAffiliate: Story = {
  name: "Inactive Affiliate",
  args: {
    mock: {
      name: "Inactive User",
      avatarSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Social Media",
      joinedDate: "December 1, 2023",
      email: "inactive@example.com",
      type: "social_media",
      status: "approved",
      websiteUrl: "https://twitter.com/inactive",
      referralCode: "INACTIVE",
      commissionRate: 0.35,
      totalEarned: 0,
      isActive: false,
      appliedAt: "Dec 1, 2023",
      approvedAt: "Dec 5, 2023",
    },
  },
};

export const NoApplicationDetails: Story = {
  name: "No Application Details",
  args: {
    mock: {
      name: "Minimal Affiliate",
      role: "Other",
      joinedDate: "April 1, 2024",
      email: "minimal@example.com",
      type: "other",
      status: "pending",
      websiteUrl: "https://example.com",
      appliedAt: "Apr 1, 2024",
    },
  },
};

export const WithoutAvatar: Story = {
  name: "Without Avatar",
  args: {
    mock: {
      name: "No Avatar User",
      role: "Email Marketing",
      joinedDate: "May 15, 2024",
      email: "noavatar@example.com",
      type: "email_marketing",
      status: "approved",
      websiteUrl: "https://newsletter.pro",
      telegram: "@emailpro",
      introduction:
        "I run multiple tech newsletters with combined 200k subscribers.",
      promotionalMethods:
        "Dedicated email blasts and sponsored newsletter sections.",
      referralCode: "EMAIL24",
      commissionRate: 0.45,
      totalEarned: 3200.0,
      isActive: true,
      appliedAt: "May 15, 2024",
      approvedAt: "May 18, 2024",
    },
  },
};
