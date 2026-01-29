import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import DialogCreateVisualNovel from "@/app/_components/organisms/DialogCreateVisualNovel";
import { Button } from "@/app/_components/atoms/button";

const meta: Meta<typeof DialogCreateVisualNovel> = {
  title: "Organisms/DialogCreateVisualNovel",
  component: DialogCreateVisualNovel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSubmit: { action: "submit" },
    onClose: { action: "close" },
  },
};

export default meta;
type Story = StoryObj<typeof DialogCreateVisualNovel>;

// ============================================================================
// Default - Open dialog
// ============================================================================
export const Default: Story = {
  args: {
    open: true,
    loading: false,
  },
};

// ============================================================================
// Loading - Submitting state
// ============================================================================
export const Loading: Story = {
  args: {
    open: true,
    loading: true,
  },
};

// ============================================================================
// Interactive - With trigger button
// ============================================================================
export const Interactive: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (data: { title: string; description?: string }) => {
      setLoading(true);
      console.log("Submitted:", data);

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
        alert(`Created: ${data.title}`);
      }, 1500);
    };

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Create Visual Novel</Button>
        <DialogCreateVisualNovel
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    );
  },
};

// ============================================================================
// MobileView - Mobile viewport
// ============================================================================
export const MobileView: Story = {
  args: {
    open: true,
    loading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// ============================================================================
// TabletView - Tablet viewport
// ============================================================================
export const TabletView: Story = {
  args: {
    open: true,
    loading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
