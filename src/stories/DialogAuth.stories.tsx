import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import DialogAuth from "@/app/_components/organisms/DialogAuth";
import type { DialogAuthVariant } from "@/app/_components/organisms/DialogAuth";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogAuth",
  component: DialogAuth,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["sign-in", "sign-up", "reset-password"],
      description: "The current authentication variant to display",
    },
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open",
    },
    backgroundImage: {
      control: "text",
      description: "URL for the left-side background image",
    },
    inviteMode: {
      control: "boolean",
      description:
        "When true, shows simplified invitation UI with no social buttons or navigation links",
    },
    isValidating: {
      control: "boolean",
      description:
        "When true, shows loading skeleton while validating invitation token",
    },
    invitation: {
      control: "object",
      description: "Invitation data containing token, email, and role",
    },
  },
  args: {
    onClose: () => {},
    onVariantChange: () => {},
  },
} satisfies Meta<typeof DialogAuth>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Sign In Variant
// ============================================================================
export const SignIn: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-in");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Sign In Dialog</Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
        />
      </>
    );
  },
  args: {
    variant: "sign-in",
    open: true,
    backgroundImage: "/images/girl-poster.webp",
  },
};

// ============================================================================
// Sign Up Variant
// ============================================================================
export const SignUp: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-up");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Sign Up Dialog</Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
        />
      </>
    );
  },
  args: {
    variant: "sign-up",
    open: true,
    backgroundImage: "/images/girl-poster.webp",
  },
};

// ============================================================================
// Reset Password Variant
// ============================================================================
export const ResetPassword: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("reset-password");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Reset Password Dialog
        </Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
        />
      </>
    );
  },
  args: {
    variant: "reset-password",
    open: true,
    backgroundImage: "/images/girl-poster.webp",
  },
};

// ============================================================================
// Custom Background Image
// ============================================================================
export const CustomBackground: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-in");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Dialog with Custom Background
        </Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
        />
      </>
    );
  },
  args: {
    variant: "sign-in",
    open: true,
    backgroundImage: "/images/girl-poster.webp",
  },
};

// ============================================================================
// Interactive - Full Flow Demo
// ============================================================================
export const Interactive: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-in");

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Click a button to open the dialog with a specific variant. You can
          switch between variants using the links inside the dialog.
        </p>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setVariant("sign-in");
              setIsOpen(true);
            }}
          >
            Sign In
          </Button>
          <Button
            onClick={() => {
              setVariant("sign-up");
              setIsOpen(true);
            }}
          >
            Sign Up
          </Button>
          <Button
            outline
            onClick={() => {
              setVariant("reset-password");
              setIsOpen(true);
            }}
          >
            Reset Password
          </Button>
        </div>

        <DialogAuth
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
          backgroundImage="/images/banner-1.jpg"
        />
      </div>
    );
  },
  args: {
    variant: "sign-in",
    open: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing the full authentication flow. Click buttons to open different variants and use the in-dialog links to switch between them.",
      },
    },
  },
};

// ============================================================================
// Mobile View (Narrow Viewport)
// ============================================================================
export const MobileView: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-in");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Mobile Dialog</Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
        />
      </>
    );
  },
  args: {
    variant: "sign-in",
    open: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view where the background image is hidden and only the form is displayed.",
      },
    },
  },
};

// ============================================================================
// Accept Invitation - Validating State
// ============================================================================
export const AcceptInviteValidating: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-up");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Accept Invite (Validating)
        </Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
          inviteMode
          isValidating
        />
      </>
    );
  },
  args: {
    variant: "sign-up",
    open: true,
    backgroundImage: "/images/girl-poster.webp",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the loading skeleton state while validating an invitation token. This appears briefly before the invitation form is displayed.",
      },
    },
  },
};

// ============================================================================
// Accept Invitation - Admin Role
// ============================================================================
export const AcceptInviteAdmin: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-up");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Accept Invite (Admin)
        </Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
          inviteMode
          invitation={{
            token: "mock-token-admin",
            email: "admin@example.com",
            role: "admin",
          }}
        />
      </>
    );
  },
  args: {
    variant: "sign-up",
    open: true,
    backgroundImage: "/images/girl-poster.webp",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Accept invitation flow for an Admin role. Shows simplified UI with email pre-filled and role badge displayed in the invitation banner.",
      },
    },
  },
};

// ============================================================================
// Accept Invitation - Super Admin Role
// ============================================================================
export const AcceptInviteSuperAdmin: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-up");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Accept Invite (Super Admin)
        </Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
          inviteMode
          invitation={{
            token: "mock-token-superadmin",
            email: "superadmin@example.com",
            role: "superadmin",
          }}
        />
      </>
    );
  },
  args: {
    variant: "sign-up",
    open: true,
    backgroundImage: "/images/girl-poster.webp",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Accept invitation flow for a Super Admin role. The role name is formatted as 'Super Admin' in the invitation banner.",
      },
    },
  },
};

// ============================================================================
// Accept Invitation - Customer Role
// ============================================================================
export const AcceptInviteCustomer: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-up");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Accept Invite (Customer)
        </Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
          inviteMode
          invitation={{
            token: "mock-token-customer",
            email: "customer@example.com",
            role: "customer",
          }}
        />
      </>
    );
  },
  args: {
    variant: "sign-up",
    open: true,
    backgroundImage: "/images/girl-poster.webp",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Accept invitation flow for a Customer role. This is the typical flow for invited users.",
      },
    },
  },
};

// ============================================================================
// Accept Invitation - Mobile View
// ============================================================================
export const AcceptInviteMobile: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    const [variant, setVariant] = useState<DialogAuthVariant>("sign-up");

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Accept Invite (Mobile)
        </Button>
        <DialogAuth
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          variant={variant}
          onVariantChange={setVariant}
          inviteMode
          invitation={{
            token: "mock-token-mobile",
            email: "mobile@example.com",
            role: "admin",
          }}
        />
      </>
    );
  },
  args: {
    variant: "sign-up",
    open: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Accept invitation flow on mobile devices. The background image is hidden and only the form is displayed.",
      },
    },
  },
};
