import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import DialogCreateUpdateFinancialCategory from "@/app/_components/organisms/DialogCreateUpdateFinancialCategory";
import type { ExistingFinancialCategory } from "@/app/_components/organisms/DialogCreateUpdateFinancialCategory";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCreateUpdateFinancialCategory",
  component: DialogCreateUpdateFinancialCategory,
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
      description:
        "Whether to create a new category or update an existing one",
    },
  },
  args: {
    onSuccess: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof DialogCreateUpdateFinancialCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample existing category data for update mode
const sampleIncomeCategory: ExistingFinancialCategory = {
  id: "cat-1",
  name: "subscription_revenue",
  label: "Subscription Revenue",
  type: "income",
  group: "subscriptions",
  description: "Revenue from user subscriptions",
  sortOrder: 1,
  isActive: true,
};

const sampleExpenseCategory: ExistingFinancialCategory = {
  id: "cat-2",
  name: "runpod_inference",
  label: "RunPod Inference",
  type: "expense",
  group: "ai",
  description: "AI inference costs on RunPod",
  sortOrder: 3,
  isActive: true,
};

const sampleInactiveCategory: ExistingFinancialCategory = {
  id: "cat-3",
  name: "deprecated_category",
  label: "Deprecated Category",
  type: "expense",
  group: "other",
  description: "No longer used",
  sortOrder: 99,
  isActive: false,
};

// ============================================================================
// Create Category (Default)
// ============================================================================
export const CreateCategory: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Create New Category</Button>
        <DialogCreateUpdateFinancialCategory
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
          "Opens a dialog to create a new financial category. Uses tRPC mutation internally to save the category.",
      },
    },
  },
};

// ============================================================================
// Edit Income Category
// ============================================================================
export const EditIncomeCategory: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Income Category</Button>
        <DialogCreateUpdateFinancialCategory
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingCategory={sampleIncomeCategory}
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
    existingCategory: sampleIncomeCategory,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to edit an existing income category. Pre-fills form with existing category data.",
      },
    },
  },
};

// ============================================================================
// Edit Expense Category
// ============================================================================
export const EditExpenseCategory: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Expense Category</Button>
        <DialogCreateUpdateFinancialCategory
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingCategory={sampleExpenseCategory}
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
    existingCategory: sampleExpenseCategory,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to edit an existing expense category (AI Services group).",
      },
    },
  },
};

// ============================================================================
// Edit Inactive Category
// ============================================================================
export const EditInactiveCategory: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Inactive Category</Button>
        <DialogCreateUpdateFinancialCategory
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingCategory={sampleInactiveCategory}
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
    existingCategory: sampleInactiveCategory,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to edit an inactive category. The status switch will be off.",
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
            Create New Category
          </Button>
          <Button
            outline
            onClick={() => {
              setMode("update");
              setIsOpen(true);
            }}
          >
            Edit Existing Category
          </Button>
        </div>

        <DialogCreateUpdateFinancialCategory
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode={mode}
          existingCategory={mode === "update" ? sampleIncomeCategory : undefined}
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
        <DialogCreateUpdateFinancialCategory
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
          "Mobile view of the dialog. The form fields stack and the dialog takes up more screen space.",
      },
    },
  },
};
