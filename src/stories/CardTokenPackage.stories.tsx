import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import CardTokenPackage from "@/app/_components/molecules/CardTokenPackage";

const meta = {
  title: "Molecules/CardTokenPackage",
  component: CardTokenPackage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    tokens: {
      control: "number",
      description: "Number of tokens in the package",
    },
    price: {
      control: "number",
      description: "Price of the package in USD",
    },
    bonusPercent: {
      control: "number",
      description: "Bonus percentage (shows badge if provided)",
    },
    isSelected: {
      control: "boolean",
      description: "Whether the package is selected",
    },
    onClick: {
      action: "clicked",
      description: "Click handler for selection",
    },
  },
} satisfies Meta<typeof CardTokenPackage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default - Basic Package
// ============================================================================
export const Default: Story = {
  args: {
    tokens: 100,
    price: 9.99,
  },
};

// ============================================================================
// With Bonus Badge
// ============================================================================
export const WithBonus: Story = {
  args: {
    tokens: 550,
    price: 49.99,
    bonusPercent: 10,
  },
};

// ============================================================================
// Selected State
// ============================================================================
export const Selected: Story = {
  args: {
    tokens: 1150,
    price: 99.99,
    bonusPercent: 15,
    isSelected: true,
  },
};

// ============================================================================
// Large Package
// ============================================================================
export const LargePackage: Story = {
  args: {
    tokens: 3750,
    price: 299.99,
    bonusPercent: 25,
  },
};

// ============================================================================
// All Variants Grid
// ============================================================================
export const AllVariants: Story = {
  args: {
    tokens: 100,
    price: 9.99,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <CardTokenPackage tokens={100} price={9.99} />
      <CardTokenPackage tokens={350} price={34.99} />
      <CardTokenPackage tokens={550} price={49.99} bonusPercent={10} />
      <CardTokenPackage
        tokens={1150}
        price={99.99}
        bonusPercent={15}
        isSelected
      />
      <CardTokenPackage tokens={2400} price={199.99} bonusPercent={20} />
      <CardTokenPackage tokens={3750} price={299.99} bonusPercent={25} />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "All token packages displayed in a grid, as they appear on the Buy Tokens page.",
      },
    },
  },
};

// ============================================================================
// Interactive Selection
// ============================================================================
export const InteractiveSelection: Story = {
  args: {
    tokens: 100,
    price: 9.99,
  },
  render: function Render() {
    const packages = [
      { id: "pkg-100", tokens: 100, price: 9.99, bonusPercent: null },
      { id: "pkg-350", tokens: 350, price: 34.99, bonusPercent: null },
      { id: "pkg-550", tokens: 550, price: 49.99, bonusPercent: 10 },
      { id: "pkg-1150", tokens: 1150, price: 99.99, bonusPercent: 15 },
      { id: "pkg-2400", tokens: 2400, price: 199.99, bonusPercent: 20 },
      { id: "pkg-3750", tokens: 3750, price: 299.99, bonusPercent: 25 },
    ];
    const [selected, setSelected] = React.useState("pkg-550");

    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {packages.map((pkg) => (
          <CardTokenPackage
            key={pkg.id}
            tokens={pkg.tokens}
            price={pkg.price}
            bonusPercent={pkg.bonusPercent}
            isSelected={selected === pkg.id}
            onClick={() => setSelected(pkg.id)}
          />
        ))}
      </div>
    );
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Interactive demo showing package selection behavior.",
      },
    },
  },
};

import React from "react";
