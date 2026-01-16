import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "@/app/_components/atoms/button";
import DialogCommandPalette from "@/app/_components/organisms/DialogCommandPalette";

const meta = {
  title: "Organisms/DialogCommandPalette",
  component: DialogCommandPalette,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    open: false,
    onClose: () => {},
  },
} satisfies Meta<typeof DialogCommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive wrapper component for the command palette
 */
const CommandPaletteWrapper = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-sm">
        Press the button below or use{" "}
        <kbd className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
          Ctrl+K
        </kbd>{" "}
        /{" "}
        <kbd className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
          Cmd+K
        </kbd>
      </p>
      <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
      <DialogCommandPalette open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const Default: Story = {
  args: {
    open: false,
    onClose: () => {},
  },
  render: () => <CommandPaletteWrapper />,
};

export const OpenByDefault: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
};
