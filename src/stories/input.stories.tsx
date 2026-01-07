import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import {
  Description,
  ErrorMessage,
  Field,
  Label,
} from "@/app/_components/atoms/fieldset";
import { Input, InputGroup } from "@/app/_components/atoms/input";

const meta = {
  title: "Atoms/Input",
  component: Input,
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
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "url",
        "number",
        "search",
        "tel",
        "date",
        "datetime-local",
        "month",
        "time",
        "week",
      ],
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args) => (
    <Field>
      <Label>Full name</Label>
      <Input {...args} />
    </Field>
  ),
};
export const Rounded: Story = {
  render: (args) => (
    <Field>
      <Label>Full name</Label>
      <Input {...args} />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <Field>
      <Label>Product name</Label>
      <Description>
        Use the name you'd like people to see in their cart.
      </Description>
      <Input {...args} />
    </Field>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <InputGroup>
      <MagnifyingGlassIcon />
      <Input {...args} />
    </InputGroup>
  ),
  args: {
    name: "search",
    placeholder: "Search…",
    "aria-label": "Search",
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Field disabled>
      <Label>Full name</Label>
      <Input {...args} />
    </Field>
  ),
  args: {
    defaultValue: "This input is disabled.",
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Field>
      <Label>Full name</Label>
      <Input {...args} />
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
        <Label>Full name</Label>
        <Input
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
