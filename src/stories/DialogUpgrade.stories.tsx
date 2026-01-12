import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import DialogUpgrade from "@/app/_components/organisms/DialogUpgrade";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogUpgrade",
  component: DialogUpgrade,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open",
    },
  },
  args: {
    onClose: () => {},
  },
} satisfies Meta<typeof DialogUpgrade>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - Open
// ============================================================================
export const Default: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Upgrade Dialog</Button>
        <DialogUpgrade
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    open: true,
  },
};

// ============================================================================
// Interactive - Closed by Default
// ============================================================================
export const Interactive: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Click the button to open the upgrade dialog. You can select different
          pricing plans and see the payment options.
        </p>

        <Button color="primary" onClick={() => setIsOpen(true)}>
          Upgrade to Premium
        </Button>

        <DialogUpgrade open={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    );
  },
  args: {
    open: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing how the upgrade dialog would appear when triggered by a premium feature.",
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

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Mobile Dialog</Button>
        <DialogUpgrade
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    open: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view where the side images are hidden and the layout is stacked vertically.",
      },
    },
  },
};

// ============================================================================
// Tablet View (Medium Viewport)
// ============================================================================
export const TabletView: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Tablet Dialog</Button>
        <DialogUpgrade
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    open: true,
  },
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
