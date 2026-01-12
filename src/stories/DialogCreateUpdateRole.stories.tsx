import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import DialogCreateUpdateRole from "@/app/_components/organisms/DialogCreateUpdateRole";
import type { ExistingRole } from "@/app/_components/organisms/DialogCreateUpdateRole";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCreateUpdateRole",
  component: DialogCreateUpdateRole,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { table: { disable: true } },
    onClose: { table: { disable: true } },
    mode: {
      control: "select",
      options: ["create", "update"],
      description: "Whether to create a new role or update an existing one",
    },
  },
  args: {
    onSuccess: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof DialogCreateUpdateRole>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample existing role data for update mode (CRUD order)
const sampleExistingRole: ExistingRole = {
  id: "role-1",
  name: "Editor",
  permissions: {
    user: { create: false, read: true, update: false, delete: false },
    character: { create: true, read: true, update: true, delete: false },
    chat: { create: false, read: true, update: false, delete: false },
    media: { create: true, read: true, update: true, delete: false },
    content: { create: true, read: true, update: true, delete: false },
    visual_novel: { create: false, read: true, update: true, delete: false },
    ticket: { create: false, read: true, update: false, delete: false },
    subscription: { create: false, read: false, update: false, delete: false },
    affiliate: { create: false, read: false, update: false, delete: false },
    auth: { create: false, read: false, update: false, delete: false },
  },
};

// ============================================================================
// Create Role (Default)
// ============================================================================
export const CreateRole: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Create New Role</Button>
        <DialogCreateUpdateRole
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          onSuccess={() => {
            args.onSuccess?.();
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to create a new role. Uses tRPC mutation internally to save the role.",
      },
    },
  },
};

// ============================================================================
// Edit Role (Update Mode)
// ============================================================================
export const EditRole: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Role</Button>
        <DialogCreateUpdateRole
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingRole={sampleExistingRole}
          onSuccess={() => {
            args.onSuccess?.();
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "update",
    existingRole: sampleExistingRole,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to edit an existing role. Pre-fills form with existing role data.",
      },
    },
  },
};

// ============================================================================
// Interactive Demo
// ============================================================================
export const Interactive: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "update">("create");

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Click a button to open the dialog in create or update mode.
        </p>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setMode("create");
              setIsOpen(true);
            }}
          >
            Create New Role
          </Button>
          <Button
            outline
            onClick={() => {
              setMode("update");
              setIsOpen(true);
            }}
          >
            Edit Existing Role
          </Button>
        </div>

        <DialogCreateUpdateRole
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode={mode}
          existingRole={mode === "update" ? sampleExistingRole : undefined}
          onSuccess={() => setIsOpen(false)}
        />
      </div>
    );
  },
  args: {
    open: false,
    mode: "create",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing both create and update modes. Uses tRPC mutations for form submission.",
      },
    },
  },
};

// ============================================================================
// Mobile View
// ============================================================================
export const MobileView: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Mobile Dialog</Button>
        <DialogCreateUpdateRole
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view of the dialog. The permission checkboxes stack and the dialog takes up more screen space.",
      },
    },
  },
};

// ============================================================================
// Administrator Role (All Permissions)
// ============================================================================
export const AdministratorRole: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    const adminRole: ExistingRole = {
      id: "admin-role",
      name: "Administrator",
      permissions: {
        user: { create: true, read: true, update: true, delete: true },
        character: { create: true, read: true, update: true, delete: true },
        chat: { create: true, read: true, update: true, delete: true },
        media: { create: true, read: true, update: true, delete: true },
        content: { create: true, read: true, update: true, delete: true },
        visual_novel: { create: true, read: true, update: true, delete: true },
        ticket: { create: true, read: true, update: true, delete: true },
        subscription: { create: true, read: true, update: true, delete: true },
        affiliate: { create: true, read: true, update: true, delete: true },
        auth: { create: true, read: true, update: true, delete: true },
      },
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>View Administrator Role</Button>
        <DialogCreateUpdateRole
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingRole={adminRole}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "update",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows an Administrator role with all permissions enabled. The Select All checkbox should be fully checked.",
      },
    },
  },
};
