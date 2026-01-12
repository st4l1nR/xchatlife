import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Ticket,
  Flame,
  Trophy,
  Mail,
  CreditCard,
  Gift,
  CheckCircle,
} from "lucide-react";

import SnackActivity from "@/app/_components/molecules/SnackActivity";

const meta = {
  title: "Molecules/SnackActivity",
  component: SnackActivity,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    category: {
      control: "select",
      options: [
        "chat",
        "content",
        "media",
        "subscription",
        "support",
        "affiliate",
        "account",
        "milestone",
      ],
      description: "Activity category determines the indicator color",
    },
    title: {
      control: "text",
      description: "Main title of the activity",
    },
    description: {
      control: "text",
      description: "Additional description text",
    },
    timestamp: {
      control: "text",
      description: "When the activity occurred",
    },
    badge: {
      control: "text",
      description: "Optional badge text (e.g., ticket number, streak count)",
    },
    showTimelineLine: {
      control: "boolean",
      description: "Show connecting line to next item",
    },
    onClick: {
      action: "click",
      description: "Callback when activity item is clicked",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SnackActivity>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockAvatar = "/images/girl-poster.webp";
const mockImage = "/images/girl-poster.webp";

// ============================================
// CHAT & MESSAGING (Purple)
// ============================================

export const ChatStarted: Story = {
  name: "Chat - Started New Chat",
  args: {
    category: "chat",
    title: "Started a new chat",
    description: "Began conversation with Luna",
    timestamp: "2 min ago",
    media: [
      {
        type: "avatar",
        src: mockAvatar,
        label: "Marisol",
        sublabel: "Spicy",
      },
    ],
  },
};

export const ChatMilestone: Story = {
  name: "Chat - Sent 50 Messages",
  args: {
    category: "chat",
    title: "Sent 50 messages",
    description: "Daily messaging milestone reached",
    timestamp: "1 hour ago",
  },
};

export const ChatVoiceMessage: Story = {
  name: "Chat - Received Voice Message",
  args: {
    category: "chat",
    title: "Received voice message",
    description: "Luna sent you a 0:45 audio response",
    timestamp: "3 hours ago",
  },
};

// ============================================
// CONTENT CREATION (Green)
// ============================================

export const ContentCreatedCharacter: Story = {
  name: "Content - Created Character",
  args: {
    category: "content",
    title: "Created new character",
    description: "Maya has been added to your characters",
    timestamp: "2 min ago",
    media: [
      {
        type: "avatar",
        src: mockAvatar,
        label: "Maya",
        sublabel: "Spicy",
      },
    ],
  },
};

export const ContentPublishedCharacter: Story = {
  name: "Content - Published Character",
  args: {
    category: "content",
    title: "Published character",
    description: "Luna is now public and visible to others",
    timestamp: "2 min ago",
    media: [
      {
        type: "avatar",
        src: mockAvatar,
        label: "Luna",
        sublabel: "Spicy",
      },
    ],
  },
};

export const ContentVisualNovel: Story = {
  name: "Content - Created Visual Novel",
  args: {
    category: "content",
    title: "Created visual novel",
    description: '"Summer Romance" draft saved 3 scenes.',
    timestamp: "2 Day Ago",
    media: [
      { type: "avatar", src: mockAvatar, label: "Character 1" },
      { type: "avatar", src: mockAvatar, label: "Character 2" },
      { type: "avatar", src: mockAvatar, label: "Character 3" },
    ],
    overflowCount: 3,
  },
};

// ============================================
// MEDIA & COLLECTIONS (Blue)
// ============================================

export const MediaSavedToCollection: Story = {
  name: "Media - Saved to Collection",
  args: {
    category: "media",
    title: "Saved to collection",
    description: "Added 3 images from chat with Luna",
    timestamp: "2 Day Ago",
  },
};

export const MediaUploadedFiles: Story = {
  name: "Media - Uploaded Media",
  args: {
    category: "media",
    title: "Uploaded media",
    description: 'Added 5 files to "Backgrounds" folder',
    timestamp: "2 Day Ago",
  },
};

export const MediaGeneratedImage: Story = {
  name: "Media - Generated Image",
  args: {
    category: "media",
    title: "Generated image",
    description: "AI image created in chat",
    timestamp: "2 Day Ago",
    media: [
      {
        type: "image",
        src: mockImage,
        alt: "Generated AI image",
      },
    ],
  },
};

// ============================================
// SUBSCRIPTION & BILLING (Amber)
// ============================================

export const SubscriptionActivated: Story = {
  name: "Subscription - Activated",
  args: {
    category: "subscription",
    title: "Subscription activated",
    description: "Premium monthly plan is now active",
    timestamp: "1 hour ago",
  },
};

export const SubscriptionPayment: Story = {
  name: "Subscription - Payment Successful",
  args: {
    category: "subscription",
    title: "Payment successful",
    description: "$9.99 charged for Premium Monthly",
    timestamp: "1 hour ago",
    badge: "**** 4242",
    badgeIcon: <CreditCard className="size-3" />,
  },
};

export const SubscriptionUpgraded: Story = {
  name: "Subscription - Plan Upgraded",
  args: {
    category: "subscription",
    title: "Plan upgraded",
    description: "Upgraded from Monthly to Annual plan",
    timestamp: "1 hour ago",
    badge: "Saved 20%",
    badgeIcon: <Gift className="size-3" />,
  },
};

// ============================================
// SUPPORT & TICKETS (Orange)
// ============================================

export const SupportOpenedTicket: Story = {
  name: "Support - Opened Ticket",
  args: {
    category: "support",
    title: "Opened support ticket",
    description: '"Unable to generate images"',
    timestamp: "10 min ago",
    badge: "Ticket #1234 - Technical",
    badgeIcon: <Ticket className="size-3" />,
  },
};

export const SupportTicketReply: Story = {
  name: "Support - Ticket Reply Received",
  args: {
    category: "support",
    title: "Ticket reply received",
    description: "Support team responded to your ticket",
    timestamp: "2 hours ago",
    media: [
      {
        type: "avatar",
        label: "Support Agent",
        sublabel: '"We\'ve identified the issue..."',
      },
    ],
  },
};

export const SupportTicketResolved: Story = {
  name: "Support - Ticket Resolved",
  args: {
    category: "support",
    title: "Ticket resolved",
    description: '"Login issues on mobile" has been closed',
    timestamp: "1 day ago",
    badge: "Ticket #1230 - Resolved",
    badgeIcon: <CheckCircle className="size-3" />,
  },
};

// ============================================
// AFFILIATE & REFERRALS (Pink)
// ============================================

export const AffiliateNewReferral: Story = {
  name: "Affiliate - New Referral",
  args: {
    category: "affiliate",
    title: "New referral signed up",
    description: "Someone joined using your referral code",
    timestamp: "1 hour ago",
    media: [
      {
        type: "avatar",
        label: "New User",
      },
    ],
  },
};

export const AffiliateCommissionEarned: Story = {
  name: "Affiliate - Commission Earned",
  args: {
    category: "affiliate",
    title: "Commission earned",
    description: "Earned $4.99 from referral conversion",
    timestamp: "3 days ago",
    badge: "Total earned: $24.95",
  },
};

export const AffiliateReferralConverted: Story = {
  name: "Affiliate - Referral Converted",
  args: {
    category: "affiliate",
    title: "Referral converted",
    description: "Your referral purchased a subscription",
    timestamp: "1 week ago",
    badge: "+$4.99 commission pending",
  },
};

// ============================================
// ACCOUNT & SECURITY (Slate)
// ============================================

export const AccountPasswordChanged: Story = {
  name: "Account - Password Changed",
  args: {
    category: "account",
    title: "Password changed",
    description: "Your password was successfully updated",
    timestamp: "5 min ago",
  },
};

export const AccountNewDeviceLogin: Story = {
  name: "Account - New Device Login",
  args: {
    category: "account",
    title: "New device login",
    description: "Logged in from Chrome on Windows",
    timestamp: "1 day ago",
    badge: "New York, USA",
  },
};

export const AccountEmailVerified: Story = {
  name: "Account - Email Verified",
  args: {
    category: "account",
    title: "Email verified",
    description: "john.doe@example.com is now verified",
    timestamp: "2 weeks ago",
    badge: "Email confirmed",
    badgeIcon: <Mail className="size-3" />,
  },
};

// ============================================
// MILESTONES & ACHIEVEMENTS (Yellow)
// ============================================

export const MilestoneMessages: Story = {
  name: "Milestone - 1000 Messages",
  args: {
    category: "milestone",
    title: "Reached 1,000 messages",
    description: "You've sent 1,000 messages total!",
    timestamp: "Just now",
    badge: "Chat Enthusiast",
    badgeIcon: <Trophy className="size-3" />,
  },
};

export const MilestoneStreak: Story = {
  name: "Milestone - 30-Day Streak",
  args: {
    category: "milestone",
    title: "30-day streak",
    description: "Logged in for 30 consecutive days",
    timestamp: "2 days ago",
    badge: "30 days",
    badgeIcon: <Flame className="size-3" />,
  },
};

export const MilestoneFirstPublish: Story = {
  name: "Milestone - First Visual Novel Published",
  args: {
    category: "milestone",
    title: "First visual novel published",
    description: "Congratulations on your first publication!",
    timestamp: "1 week ago",
    badge: '"Summer Romance"',
  },
};

// ============================================
// COMBINED VIEWS
// ============================================

export const AllCategoryColors: Story = {
  name: "All Category Colors",
  args: {
    category: "chat",
    title: "Activity title",
    description: "Activity description",
    timestamp: "2 min ago",
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <SnackActivity
        category="chat"
        title="Chat & Messaging"
        description="Purple indicator"
        timestamp="Now"
      />
      <SnackActivity
        category="content"
        title="Content Creation"
        description="Green indicator"
        timestamp="Now"
      />
      <SnackActivity
        category="media"
        title="Media & Collections"
        description="Blue indicator"
        timestamp="Now"
      />
      <SnackActivity
        category="subscription"
        title="Subscription & Billing"
        description="Amber indicator"
        timestamp="Now"
      />
      <SnackActivity
        category="support"
        title="Support & Tickets"
        description="Orange indicator"
        timestamp="Now"
      />
      <SnackActivity
        category="affiliate"
        title="Affiliate & Referrals"
        description="Pink indicator"
        timestamp="Now"
      />
      <SnackActivity
        category="account"
        title="Account & Security"
        description="Slate indicator"
        timestamp="Now"
      />
      <SnackActivity
        category="milestone"
        title="Milestones & Achievements"
        description="Yellow indicator"
        timestamp="Now"
      />
    </div>
  ),
};

export const ActivityTimeline: Story = {
  name: "Activity Timeline (Full Example)",
  args: {
    category: "chat",
    title: "Activity title",
    description: "Activity description",
    timestamp: "2 min ago",
  },
  render: () => (
    <div className="flex flex-col">
      <SnackActivity
        category="chat"
        title="Started a new chat"
        description="Began conversation with Luna"
        timestamp="2 min ago"
        showTimelineLine
        media={[
          {
            type: "avatar",
            src: mockAvatar,
            label: "Marisol",
            sublabel: "Spicy",
          },
        ]}
      />
      <SnackActivity
        category="chat"
        title="Sent 50 messages"
        description="Daily messaging milestone reached"
        timestamp="1 hour ago"
        showTimelineLine
      />
      <SnackActivity
        category="chat"
        title="Received voice message"
        description="Luna sent you a 0:45 audio response"
        timestamp="3 hours ago"
        showTimelineLine
      />
      <SnackActivity
        category="content"
        title="Created new character"
        description="Maya has been added to your characters"
        timestamp="2 min ago"
        showTimelineLine
        media={[
          {
            type: "avatar",
            src: mockAvatar,
            label: "Maya",
            sublabel: "Spicy",
          },
        ]}
      />
      <SnackActivity
        category="content"
        title="Published character"
        description="Luna is now public and visible to others"
        timestamp="2 min ago"
        showTimelineLine
        media={[
          {
            type: "avatar",
            src: mockAvatar,
            label: "Luna",
            sublabel: "Spicy",
          },
        ]}
      />
      <SnackActivity
        category="content"
        title="Created visual novel"
        description='"Summer Romance" draft saved 3 scenes.'
        timestamp="2 Day Ago"
        showTimelineLine
        media={[
          { type: "avatar", src: mockAvatar, label: "Character 1" },
          { type: "avatar", src: mockAvatar, label: "Character 2" },
          { type: "avatar", src: mockAvatar, label: "Character 3" },
        ]}
        overflowCount={3}
      />
      <SnackActivity
        category="media"
        title="Saved to collection"
        description="Added 3 images from chat with Luna"
        timestamp="2 Day Ago"
        showTimelineLine
      />
      <SnackActivity
        category="media"
        title="Uploaded media"
        description='Added 5 files to "Backgrounds" folder'
        timestamp="2 Day Ago"
        showTimelineLine
      />
      <SnackActivity
        category="media"
        title="Generated image"
        description="AI image created in chat"
        timestamp="2 Day Ago"
        showTimelineLine
        media={[
          {
            type: "image",
            src: mockImage,
            alt: "Generated AI image",
          },
        ]}
      />
      <SnackActivity
        category="subscription"
        title="Subscription activated"
        description="Premium monthly plan is now active"
        timestamp="1 hour ago"
        showTimelineLine
      />
      <SnackActivity
        category="subscription"
        title="Payment successful"
        description="$9.99 charged for Premium Monthly"
        timestamp="1 hour ago"
        showTimelineLine
      />
      <SnackActivity
        category="subscription"
        title="Plan upgraded"
        description="Upgraded from Monthly to Annual plan"
        timestamp="1 hour ago"
      />
    </div>
  ),
};

export const WithMediaVariants: Story = {
  name: "Media Variants",
  args: {
    category: "content",
    title: "Activity with media",
    timestamp: "Now",
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Single Avatar</p>
        <SnackActivity
          category="content"
          title="Created new character"
          description="Maya has been added to your characters"
          timestamp="2 min ago"
          media={[
            {
              type: "avatar",
              src: mockAvatar,
              label: "Maya",
              sublabel: "Spicy",
            },
          ]}
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Multiple Avatars</p>
        <SnackActivity
          category="content"
          title="Created visual novel"
          description='"Summer Romance" draft saved'
          timestamp="2 Day Ago"
          media={[
            { type: "avatar", src: mockAvatar, label: "Character 1" },
            { type: "avatar", src: mockAvatar, label: "Character 2" },
            { type: "avatar", src: mockAvatar, label: "Character 3" },
          ]}
          overflowCount={3}
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Single Image</p>
        <SnackActivity
          category="media"
          title="Generated image"
          description="AI image created in chat"
          timestamp="30 min ago"
          media={[
            {
              type: "image",
              src: mockImage,
              alt: "Generated image",
            },
          ]}
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">
          Multiple Images with Overflow
        </p>
        <SnackActivity
          category="media"
          title="Saved to collection"
          description="Added images from chat"
          timestamp="5 min ago"
          media={[
            { type: "image", src: mockImage, alt: "Image 1" },
            { type: "image", src: mockImage, alt: "Image 2" },
            { type: "image", src: mockImage, alt: "Image 3" },
          ]}
          overflowCount={5}
        />
      </div>
    </div>
  ),
};
