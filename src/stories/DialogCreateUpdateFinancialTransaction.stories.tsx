import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import DialogCreateUpdateFinancialTransaction from "@/app/_components/organisms/DialogCreateUpdateFinancialTransaction";
import type { ExistingTransaction } from "@/app/_components/organisms/DialogCreateUpdateFinancialTransaction";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCreateUpdateFinancialTransaction",
  component: DialogCreateUpdateFinancialTransaction,
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
        "Whether to create a new transaction or update an existing one",
    },
  },
  args: {
    onSuccess: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof DialogCreateUpdateFinancialTransaction>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample existing transaction data for update mode
const sampleIncomeTransaction: ExistingTransaction = {
  id: "txn-1",
  categoryId: "cat-subscription",
  amount: "99.99",
  currency: "USD",
  description: "Monthly subscription revenue",
  provider: "stripe",
  unitType: null,
  unitCount: null,
  notes: "Regular monthly billing cycle",
  periodStart: "2024-01-01T00:00:00.000Z",
  periodEnd: "2024-01-31T23:59:59.000Z",
};

const sampleExpenseTransaction: ExistingTransaction = {
  id: "txn-2",
  categoryId: "cat-ai-inference",
  amount: "45.50",
  currency: "USD",
  description: "AI inference costs for January",
  provider: "runpod",
  unitType: "message",
  unitCount: 15000,
  notes: "Higher usage due to new feature launch",
  periodStart: "2024-01-01T00:00:00.000Z",
  periodEnd: "2024-01-31T23:59:59.000Z",
};

const sampleSimpleTransaction: ExistingTransaction = {
  id: "txn-3",
  categoryId: "cat-misc",
  amount: "25.00",
  currency: "USD",
  description: "Office supplies",
  provider: null,
  unitType: null,
  unitCount: null,
  notes: null,
  periodStart: null,
  periodEnd: null,
};

// ============================================================================
// Create Transaction (Default)
// ============================================================================
export const CreateTransaction: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Create New Transaction</Button>
        <DialogCreateUpdateFinancialTransaction
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
          "Opens a dialog to create a new financial transaction. Categories are fetched via tRPC and grouped by their group property.",
      },
    },
  },
};

// ============================================================================
// Edit Income Transaction
// ============================================================================
export const EditIncomeTransaction: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Income Transaction</Button>
        <DialogCreateUpdateFinancialTransaction
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingTransaction={sampleIncomeTransaction}
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
    existingTransaction: sampleIncomeTransaction,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to edit an existing income transaction with subscription revenue data.",
      },
    },
  },
};

// ============================================================================
// Edit Expense Transaction with Units
// ============================================================================
export const EditExpenseWithUnits: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit AI Expense</Button>
        <DialogCreateUpdateFinancialTransaction
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingTransaction={sampleExpenseTransaction}
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
    existingTransaction: sampleExpenseTransaction,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to edit an expense transaction that includes unit tracking (messages, images, etc.).",
      },
    },
  },
};

// ============================================================================
// Edit Simple Transaction
// ============================================================================
export const EditSimpleTransaction: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Simple Transaction</Button>
        <DialogCreateUpdateFinancialTransaction
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          existingTransaction={sampleSimpleTransaction}
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
    existingTransaction: sampleSimpleTransaction,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to edit a simple transaction without optional fields filled in.",
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
            Create New Transaction
          </Button>
          <Button
            outline
            onClick={() => {
              setMode("update");
              setIsOpen(true);
            }}
          >
            Edit Existing Transaction
          </Button>
        </div>

        <DialogCreateUpdateFinancialTransaction
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode={mode}
          existingTransaction={mode === "update" ? sampleExpenseTransaction : undefined}
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
        <DialogCreateUpdateFinancialTransaction
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
          "Mobile view of the dialog. The form fields stack vertically for better mobile usability.",
      },
    },
  },
};
