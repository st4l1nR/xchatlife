import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Avatar } from "@/app/_components/atoms/avatar";
import {
  Combobox,
  ComboboxDescription,
  ComboboxLabel,
  ComboboxOption,
} from "@/app/_components/atoms/combobox";
import {
  Description,
  ErrorMessage,
  Field,
  Label,
} from "@/app/_components/atoms/fieldset";

const people = [
  {
    id: 1,
    name: "Tom Cook",
    handle: "tomcook",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Wade Cooper",
    handle: "wadecooper",
    avatar:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 3,
    name: "Arlene Mccoy",
    handle: "arlenemccoy",
    avatar:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 4,
    name: "Devon Webb",
    handle: "devonwebb",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 5,
    name: "Tanya Fox",
    handle: "tanyafox",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const meta = {
  title: "Atoms/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof Combobox<(typeof people)[0]>>;

const defaultArgs = {
  options: people,
  displayValue: (person: (typeof people)[0] | null) => person?.name,
  children: (person: (typeof people)[0]) => (
    <ComboboxOption value={person}>
      <ComboboxLabel>{person.name}</ComboboxLabel>
    </ComboboxOption>
  ),
};

export const Default: Story = {
  render: (args) => (
    <Field>
      <Label>Assigned to</Label>
      <Combobox {...args} />
    </Field>
  ),
  args: {
    ...defaultArgs,
    defaultValue: people[0],
  },
};

export const WithDescription: Story = {
  render: (args) => (
    <Field>
      <Label>Assigned to</Label>
      <Description>This user will have full access to the project.</Description>
      <Combobox {...args} />
    </Field>
  ),
  args: {
    ...defaultArgs,
    defaultValue: people[0],
  },
};

export const WithPlaceholder: Story = {
  render: (args) => (
    <Field>
      <Label>Assigned to</Label>
      <Combobox {...args} />
    </Field>
  ),
  args: {
    ...defaultArgs,
    placeholder: "Select a user...",
  },
};

export const WithAvatarsAndSecondaryText: Story = {
  render: (args) => (
    <Field>
      <Label>Assigned to</Label>
      <Combobox {...args} />
    </Field>
  ),
  args: {
    ...defaultArgs,
    defaultValue: people[0],
    children: (person) => (
      <ComboboxOption value={person}>
        <Avatar src={person.avatar} />
        <ComboboxLabel>{person.name}</ComboboxLabel>
        <ComboboxDescription>@{person.handle}</ComboboxDescription>
      </ComboboxOption>
    ),
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Field disabled>
      <Label>Assigned to</Label>
      <Combobox {...args} />
    </Field>
  ),
  args: {
    ...defaultArgs,
    defaultValue: people[0],
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Field>
      <Label>Assigned to</Label>
      <Combobox {...args} />
      <ErrorMessage>A user is required.</ErrorMessage>
    </Field>
  ),
  args: {
    ...defaultArgs,
    placeholder: "Select a user...",
    invalid: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(people[1]);
    return (
      <Field>
        <Label>Assigned to</Label>
        <Combobox
          {...args}
          value={value}
          onChange={(val) => {
            if (val) setValue(val);
            if (args.onChange) {
              args.onChange(val);
            }
          }}
        />
      </Field>
    );
  },
  args: {
    ...defaultArgs,
  },
};
