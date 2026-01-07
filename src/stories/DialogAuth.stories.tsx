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
  },
  args: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
