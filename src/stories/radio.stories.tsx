import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import {
  Description,
  Fieldset,
  Label,
  Legend,
} from "@/app/_components/atoms/fieldset";
import { Radio, RadioField, RadioGroup } from "@/app/_components/atoms/radio";
import { Text } from "@/app/_components/atoms/text";

const meta = {
  title: "Atoms/Radio",
  component: RadioGroup,
  subcomponents: { Radio, RadioField },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  {
    value: "permit",
    label: "Allow tickets to be resold",
    description:
      "Customers can resell or transfer their tickets if they can't make it to the event.",
  },
  {
    value: "forbid",
    label: `Don't allow tickets to be resold`,
    description: "Tickets cannot be resold or transferred to another person.",
  },
];

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {options.map((option) => (
        <RadioField key={option.value}>
          <Radio value={option.value} />
          <Label>{option.label}</Label>
        </RadioField>
      ))}
    </RadioGroup>
  ),
  args: {
    name: "resale",
    defaultValue: "permit",
    "aria-label": "Resale and transfers",
  },
};

export const WithDescription: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {options.map((option) => (
        <RadioField key={option.value}>
          <Radio value={option.value} />
          <Label>{option.label}</Label>
          <Description>{option.description}</Description>
        </RadioField>
      ))}
    </RadioGroup>
  ),
  args: {
    ...Default.args,
  },
};

export const WithFieldset: Story = {
  render: (args) => (
    <Fieldset>
      <Legend>Resale and transfers</Legend>
      <Text>Decide if people buy tickets from you or from scalpers.</Text>
      <RadioGroup {...args}>
        {options.map((option) => (
          <RadioField key={option.value}>
            <Radio value={option.value} />
            <Label>{option.label}</Label>
            <Description>{option.description}</Description>
          </RadioField>
        ))}
      </RadioGroup>
    </Fieldset>
  ),
  args: {
    name: "resale",
    defaultValue: "permit",
  },
};

export const Disabled: Story = {
  ...WithFieldset,
  args: {
    ...WithFieldset.args,
    disabled: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(options[0]?.value);
    return (
      <RadioGroup
        {...args}
        value={value}
        onChange={(val) => {
          setValue(val);
          args.onChange?.(val);
        }}
      >
        {options.map((option) => (
          <RadioField key={option.value}>
            <Radio value={option.value} />
            <Label>{option.label}</Label>
          </RadioField>
        ))}
      </RadioGroup>
    );
  },
  args: {
    name: "resale",
    "aria-label": "Resale and transfers",
  },
};
