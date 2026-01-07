import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/app/_components/atoms/description-list";
import { Subheading } from "@/app/_components/atoms/heading";

const meta = {
  title: "Atoms/DescriptionList",
  component: DescriptionList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DescriptionList>
      <DescriptionTerm>Customer</DescriptionTerm>
      <DescriptionDetails>Michael Foster</DescriptionDetails>

      <DescriptionTerm>Event</DescriptionTerm>
      <DescriptionDetails>Bear Hug: Live in Concert</DescriptionDetails>

      <DescriptionTerm>Amount</DescriptionTerm>
      <DescriptionDetails>$150.00 USD</DescriptionDetails>

      <DescriptionTerm>Amount after exchange rate</DescriptionTerm>
      <DescriptionDetails>US$150.00 &rarr; CA$199.79</DescriptionDetails>

      <DescriptionTerm>Fee</DescriptionTerm>
      <DescriptionDetails>$4.79 USD</DescriptionDetails>

      <DescriptionTerm>Net</DescriptionTerm>
      <DescriptionDetails>$1,955.00</DescriptionDetails>
    </DescriptionList>
  ),
};

export const WithHeading: Story = {
  render: () => (
    <>
      <Subheading>Order #1011</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>Customer</DescriptionTerm>
        <DescriptionDetails>Michael Foster</DescriptionDetails>

        <DescriptionTerm>Event</DescriptionTerm>
        <DescriptionDetails>Bear Hug: Live in Concert</DescriptionDetails>

        <DescriptionTerm>Amount</DescriptionTerm>
        <DescriptionDetails>$150.00 USD</DescriptionDetails>

        <DescriptionTerm>Amount after exchange rate</DescriptionTerm>
        <DescriptionDetails>US$150.00 &rarr; CA$199.79</DescriptionDetails>

        <DescriptionTerm>Fee</DescriptionTerm>
        <DescriptionDetails>$4.79 USD</DescriptionDetails>

        <DescriptionTerm>Net</DescriptionTerm>
        <DescriptionDetails>$1,955.00</DescriptionDetails>
      </DescriptionList>
    </>
  ),
};
