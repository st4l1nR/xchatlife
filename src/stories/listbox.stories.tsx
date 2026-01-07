import {
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
} from "@heroicons/react/16/solid";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Avatar } from "@/app/_components/atoms/avatar";
import { ErrorMessage, Field, Label } from "@/app/_components/atoms/fieldset";
import {
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from "@/app/_components/atoms/listbox";

const meta = {
  title: "Atoms/Listbox",
  component: Listbox,
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
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const statuses = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "delayed", label: "Delayed" },
  { value: "canceled", label: "Canceled" },
];

export const Default: Story = {
  render: (args) => (
    <Field>
      <Label>Project status</Label>
      <Listbox {...args}>
        {statuses.map((status) => (
          <ListboxOption key={status.value} value={status.value}>
            <ListboxLabel>{status.label}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  ),
  args: {
    name: "status",
    defaultValue: "active",
  },
};

export const WithPlaceholder: Story = {
  ...Default,
  args: {
    name: "status",
    placeholder: "Select status…",
  },
};

const users = [
  {
    id: 1,
    name: "Leslie Alexander",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    handle: "lesliealexander",
  },
  {
    id: 2,
    name: "Michael Foster",
    avatarUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    handle: "michaelfoster",
  },
  {
    id: 3,
    name: "Dries Vincent",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    handle: "driesvincent",
  },
];

export const WithAvatars: Story = {
  render: (args) => (
    <Field>
      <Label>Assigned to</Label>
      <Listbox {...args}>
        {users.map((user) => (
          <ListboxOption key={user.id} value={user}>
            <Avatar src={user.avatarUrl} alt="" />
            <ListboxLabel>{user.name}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  ),
  args: {
    name: "user",
    defaultValue: users[0],
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <Field>
      <Label>Alignment</Label>
      <Listbox {...args}>
        <ListboxOption value="left">
          <Bars3BottomLeftIcon />
          <ListboxLabel>Left</ListboxLabel>
        </ListboxOption>
        <ListboxOption value="right">
          <Bars3BottomRightIcon />
          <ListboxLabel>Right</ListboxLabel>
        </ListboxOption>
        <ListboxOption value="justified">
          <Bars3Icon />
          <ListboxLabel>Justified</ListboxLabel>
        </ListboxOption>
      </Listbox>
    </Field>
  ),
  args: {
    name: "alignment",
    defaultValue: "left",
  },
};

export const WithSecondaryText: Story = {
  render: (args) => (
    <Field>
      <Label>User</Label>
      <Listbox {...args}>
        {users.map((user) => (
          <ListboxOption key={user.id} value={user}>
            <ListboxLabel>{user.name}</ListboxLabel>
            <ListboxDescription>@{user.handle}</ListboxDescription>
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  ),
  args: {
    name: "user",
    defaultValue: users[0],
  },
};

export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Invalid: Story = {
  ...Default,
  render: (args) => (
    <Field>
      <Label>Project status</Label>
      <Listbox {...args}>
        {statuses.map((status) => (
          <ListboxOption key={status.value} value={status.value}>
            <ListboxLabel>{status.label}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
      <ErrorMessage>A project status is required.</ErrorMessage>
    </Field>
  ),
  args: {
    ...Default.args,
    invalid: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(statuses[0]?.value);
    return (
      <Field>
        <Label>Project status</Label>
        <Listbox
          {...args}
          value={value}
          onChange={(val) => {
            setValue(val as string);
            args.onChange?.(val);
          }}
        >
          {statuses.map((status) => (
            <ListboxOption key={status.value} value={status.value}>
              <ListboxLabel>{status.label}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
      </Field>
    );
  },
  args: {
    name: "status",
  },
};
