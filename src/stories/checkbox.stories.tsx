import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from "@/app/_components/atoms/checkbox";
import {
  Description,
  Fieldset,
  Label,
  Legend,
} from "@/app/_components/atoms/fieldset";
import { Text } from "@/app/_components/atoms/text";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "cosmos-dark",
      values: [
        {
          name: "cosmos-dark",
          value: "rgb(13 13 13)",
        },
        {
          name: "cosmos-light",
          value: "rgb(245 244 242)",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
    indeterminate: {
      control: "boolean",
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: "dark/zinc",
  },
  render: (args) => (
    <CheckboxField>
      <Checkbox {...args} />
      <Label className="text-primary">Accept terms and conditions</Label>
    </CheckboxField>
  ),
};

export const WithLabelAndDescription: Story = {
  name: "With Label & Description",
  render: () => (
    <Fieldset>
      <Legend className="text-primary mb-2 text-xl font-semibold">
        Discoverability
      </Legend>
      <Text className="text-secondary mb-6 text-sm leading-relaxed">
        Decide where your events can be found across the web.
      </Text>
      <CheckboxGroup className="space-y-4">
        <CheckboxField>
          <Checkbox
            name="discoverability"
            value="show_on_events_page"
            defaultChecked
            color="dark/zinc"
          />
          <Label className="text-primary font-medium">
            Show on events page
          </Label>
          <Description className="text-secondary text-sm">
            Make this event visible on your profile.
          </Description>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            name="discoverability"
            value="allow_embedding"
            color="dark/zinc"
          />
          <Label className="text-primary font-medium">Allow embedding</Label>
          <Description className="text-secondary text-sm">
            Allow others to embed your event details on their own site.
          </Description>
        </CheckboxField>
      </CheckboxGroup>
    </Fieldset>
  ),
};

export const Disabled: Story = {
  name: "Disabled State",
  render: () => (
    <Fieldset>
      <Legend className="text-primary mb-2 text-xl font-semibold">
        Discoverability
      </Legend>
      <Text className="text-secondary mb-6 text-sm leading-relaxed">
        Decide where your events can be found across the web.
      </Text>
      <CheckboxGroup className="space-y-4">
        <CheckboxField>
          <Checkbox
            name="discoverability"
            value="show_on_events_page"
            color="dark/zinc"
          />
          <Label className="text-primary font-medium">
            Show on events page
          </Label>
          <Description className="text-secondary text-sm">
            Make this event visible on your profile.
          </Description>
        </CheckboxField>
        <CheckboxField disabled>
          <Checkbox
            name="discoverability"
            value="allow_embedding"
            color="dark/zinc"
          />
          <Label className="text-primary font-medium opacity-50">
            Allow embedding
          </Label>
          <Description className="text-secondary text-sm opacity-50">
            Allow others to embed your event details on their own site.
          </Description>
        </CheckboxField>
      </CheckboxGroup>
    </Fieldset>
  ),
};

export const Indeterminate: Story = {
  name: "Indeterminate State",
  render: () => {
    const options = [
      "Show on events page",
      "Allow embedding",
      "Public listing",
    ];
    const [selected, setSelected] = useState(["Show on events page"]);

    return (
      <div>
        <h3 className="text-primary mb-4 text-xl font-semibold">
          Bulk Selection
        </h3>
        <Text className="text-secondary mb-6 text-sm leading-relaxed">
          Use the "Select all" checkbox to manage multiple options at once.
        </Text>
        <CheckboxGroup
          role="group"
          aria-label="Discoverability"
          className="space-y-4"
        >
          <CheckboxField className="border-primary/20 border-b pb-4">
            <Checkbox
              checked={selected.length > 0}
              indeterminate={selected.length !== options.length}
              onChange={(checked) => setSelected(checked ? options : [])}
              color="dark/zinc"
            />
            <Label className="text-primary font-semibold">Select all</Label>
          </CheckboxField>

          {options.map((option) => (
            <CheckboxField key={option}>
              <Checkbox
                name={option}
                checked={selected.includes(option)}
                onChange={(checked) => {
                  return setSelected((pending) => {
                    return checked
                      ? [...pending, option]
                      : pending.filter((item) => item !== option);
                  });
                }}
                color="dark/zinc"
              />
              <Label className="text-primary font-medium">{option}</Label>
            </CheckboxField>
          ))}
        </CheckboxGroup>
      </div>
    );
  },
};

export const InteractiveStates: Story = {
  name: "Interactive States",
  render: () => (
    <div className="">
      <h3 className="text-primary mb-6 text-xl font-semibold">
        Interactive Examples
      </h3>
      <CheckboxGroup className="space-y-4">
        <CheckboxField>
          <Checkbox
            name="hover-example"
            color="dark/zinc"
            className="duration-normal transition-all hover:scale-105"
          />
          <Label className="text-primary font-medium">
            Hover to see scale effect
          </Label>
        </CheckboxField>

        <CheckboxField>
          <Checkbox
            name="focus-example"
            color="dark/zinc"
            className="focus:ring-offset-secondary focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
          <Label className="text-primary font-medium">
            Focus for ring effect
          </Label>
        </CheckboxField>

        <CheckboxField>
          <Checkbox name="checked-example" color="dark/zinc" defaultChecked />
          <Label className="text-primary font-medium">Pre-checked state</Label>
        </CheckboxField>
      </CheckboxGroup>
    </div>
  ),
};
