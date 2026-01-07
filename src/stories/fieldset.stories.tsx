import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Description,
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/app/_components/atoms/fieldset";
import { Input } from "@/app/_components/atoms/input";
import { Select } from "@/app/_components/atoms/select";
import { Text } from "@/app/_components/atoms/text";
import { Textarea } from "@/app/_components/atoms/textarea";

const meta = {
  title: "Atoms/Fieldset",
  component: Fieldset,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof Fieldset>;

const renderFieldset = (args: { disabled?: boolean }) => (
  <Fieldset {...args}>
    <Legend>Shipping details</Legend>
    <Text>Without this your odds of getting your order are low.</Text>
    <FieldGroup>
      <Field>
        <Label>Street address</Label>
        <Input name="street_address" />
      </Field>
      <Field>
        <Label>Country</Label>
        <Select name="country">
          <option>Canada</option>
          <option>Mexico</option>
          <option>United States</option>
        </Select>
        <Description>We currently only ship to North America.</Description>
      </Field>
      <Field>
        <Label>Delivery notes</Label>
        <Textarea name="notes" />
        <Description>
          If you have a tiger, we'd like to know about it.
        </Description>
      </Field>
    </FieldGroup>
  </Fieldset>
);

export const Default: Story = {
  render: () => renderFieldset({}),
};

export const Disabled: Story = {
  render: () => renderFieldset({ disabled: true }),
  args: {
    disabled: true,
  },
};
