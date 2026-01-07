import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import {
  Description,
  ErrorMessage,
  Field,
  Label,
} from "@/app/_components/atoms/fieldset";
import { Textarea } from "@/app/_components/atoms/textarea";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    resizable: { control: "boolean" },
    rows: { control: "number" },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args) => (
    <Field>
      <Label>Description</Label>
      <Textarea {...args} />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <Field>
      <Label>Description</Label>
      <Description>This will be shown under the product title.</Description>
      <Textarea {...args} />
    </Field>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Field disabled>
      <Label>Description</Label>
      <Textarea {...args} />
    </Field>
  ),
  args: {
    defaultValue: "This textarea is disabled.",
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Field>
      <Label>Description</Label>
      <Textarea {...args} />
      <ErrorMessage>This field is required.</ErrorMessage>
    </Field>
  ),
  args: {
    invalid: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("Initial controlled value");
    return (
      <Field>
        <Label>Description</Label>
        <Textarea
          {...args}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            args.onChange?.(e);
          }}
        />
      </Field>
    );
  },
};
