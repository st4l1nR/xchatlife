import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import {
  Description,
  Fieldset,
  Label,
  Legend,
} from "@/app/_components/atoms/fieldset";
import {
  Switch,
  SwitchField,
  SwitchGroup,
} from "@/app/_components/atoms/switch";
import { Text } from "@/app/_components/atoms/text";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Allow embedding",
  },
};

export const PrimaryColor: Story = {
  args: {
    "aria-label": "Allow embedding",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <SwitchField>
      <Label>Allow embedding</Label>
      <Switch {...args} />
    </SwitchField>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <SwitchField>
      <Label>Allow embedding</Label>
      <Description>
        Allow others to embed your event details on their own site.
      </Description>
      <Switch {...args} />
    </SwitchField>
  ),
};

export const WithFieldset: Story = {
  render: (args) => (
    <Fieldset>
      <Legend>Discoverability</Legend>
      <Text>Decide where your events can be found across the web.</Text>
      <SwitchGroup>
        <SwitchField>
          <Label>Show on events page</Label>
          <Description>Make this event visible on your profile.</Description>
          <Switch {...args} name="show_on_events_page" defaultChecked />
        </SwitchField>
        <SwitchField>
          <Label>Allow embedding</Label>
          <Description>
            Allow others to embed your event details on their own site.
          </Description>
          <Switch {...args} name="allow_embedding" />
        </SwitchField>
      </SwitchGroup>
    </Fieldset>
  ),
};

export const WithColors: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Switch {...args} color="dark/zinc" defaultChecked />
      <Switch {...args} color="red" defaultChecked />
      <Switch {...args} color="orange" defaultChecked />
      <Switch {...args} color="amber" defaultChecked />
      <Switch {...args} color="yellow" defaultChecked />
      <Switch {...args} color="lime" defaultChecked />
      <Switch {...args} color="green" defaultChecked />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Disabled: Story = {
  render: (args) => (
    <SwitchField disabled>
      <Label>Allow embedding</Label>
      <Description>
        Allow others to embed your event details on their own site.
      </Description>
      <Switch {...args} />
    </SwitchField>
  ),
};
