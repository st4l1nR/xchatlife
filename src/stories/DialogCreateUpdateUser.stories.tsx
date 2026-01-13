import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import DialogCreateUpdateUser from "@/app/_components/organisms/DialogCreateUpdateUser";
import type { ExistingUser } from "@/app/_components/organisms/DialogCreateUpdateUser";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCreateUpdateUser",
  component: DialogCreateUpdateUser,
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
      description: "Whether to create a new user or update an existing one",
    },
  },
  args: {
    onSuccess: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof DialogCreateUpdateUser>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample existing user data for update mode
const sampleExistingUser: ExistingUser = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  roleId: "role-admin-123",
  roleName: "Admin",
};

// ============================================================================
// Create User (Invite Mode)
// ============================================================================
export const InviteUser: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Invite New User</Button>
        <DialogCreateUpdateUser
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          onSuccess={() => setIsOpen(false)}
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
          "Invite mode - sends an invitation email to the user with the specified role. Note: In Storybook, the tRPC mutation won't actually run.",
      },
    },
  },
};

// ============================================================================
// Edit User (Update Mode)
// ============================================================================
export const EditUser: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit User</Button>
        <DialogCreateUpdateUser
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingUser={sampleExistingUser}
          onSuccess={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "update",
    existingUser: sampleExistingUser,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit mode - allows updating the role of an existing user. Email is read-only in this mode.",
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
          Click a button to open the dialog in invite or edit mode.
        </p>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setMode("create");
              setIsOpen(true);
            }}
          >
            Invite New User
          </Button>
          <Button
            outline
            onClick={() => {
              setMode("update");
              setIsOpen(true);
            }}
          >
            Edit Existing User
          </Button>
        </div>

        <DialogCreateUpdateUser
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode={mode}
          existingUser={mode === "update" ? sampleExistingUser : undefined}
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
          "Interactive demo showing both invite and edit modes. Note: tRPC mutations won't run in Storybook.",
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
        <DialogCreateUpdateUser
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
          "Mobile view of the dialog. The form fields stack and the dialog adapts to smaller screen sizes.",
      },
    },
  },
};

// ============================================================================
// Super Admin User
// ============================================================================
export const SuperAdminUser: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    const superAdminUser: ExistingUser = {
      id: "superadmin-1",
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@example.com",
      roleId: "role-superadmin-123",
      roleName: "Superadmin",
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>View Super Admin User</Button>
        <DialogCreateUpdateUser
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingUser={superAdminUser}
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
          "Shows a Super Admin user in edit mode with the superadmin role selected.",
      },
    },
  },
};
