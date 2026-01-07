import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { Avatar } from "@/app/_components/atoms/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSection,
  DropdownDescription,
  DropdownShortcut,
} from "@/app/_components/atoms/dropdown";

const meta = {
  title: "Atoms/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicExample: Story = {
  name: "Basic Example",
  render: () => (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href="/users/1">View</DropdownItem>
        <DropdownItem href="/users/1/edit">Edit</DropdownItem>
        <DropdownItem onClick={fn()}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const ButtonStyle: Story = {
  name: "Button Style",
  render: () => (
    <Dropdown>
      <DropdownButton>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href="#">View</DropdownItem>
        <DropdownItem href="#">Edit</DropdownItem>
        <DropdownItem href="#">Export as CSV&hellip;</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithDisabledItems: Story = {
  name: "With Disabled Items",
  render: () => (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href="/users/1">View</DropdownItem>
        <DropdownItem href="/users/1/edit" disabled>
          Edit
        </DropdownItem>
        <DropdownItem onClick={fn()}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithSections: Story = {
  name: "With Sections",
  render: () => (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownSection>
          <DropdownItem onClick={fn()}>Edit</DropdownItem>
          <DropdownItem onClick={fn()}>Archive</DropdownItem>
        </DropdownSection>
        <DropdownDivider />
        <DropdownSection>
          <DropdownItem onClick={fn()}>Permissions</DropdownItem>
          <DropdownItem onClick={fn()}>Assign</DropdownItem>
        </DropdownSection>
        <DropdownDivider />
        <DropdownItem onClick={fn()}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithDescriptions: Story = {
  name: "With Descriptions",
  render: () => (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem>
          <DropdownLabel>View</DropdownLabel>
          <DropdownDescription>Read-only access</DropdownDescription>
        </DropdownItem>
        <DropdownItem>
          <DropdownLabel>Edit</DropdownLabel>
          <DropdownDescription>Full access</DropdownDescription>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithIcons: Story = {
  name: "With Icons",
  render: () => (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem onClick={fn()}>
          <PencilSquareIcon />
          <DropdownLabel>Edit</DropdownLabel>
        </DropdownItem>
        <DropdownItem onClick={fn()}>
          <ArchiveBoxXMarkIcon />
          <DropdownLabel>Archive</DropdownLabel>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={fn()}>
          <TrashIcon />
          <DropdownLabel>Delete</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithKeyboardShortcuts: Story = {
  name: "With Keyboard Shortcuts",
  render: () => (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem onClick={fn()}>
          <DropdownLabel>Edit</DropdownLabel>
          <DropdownShortcut keys="E" />
        </DropdownItem>
        <DropdownItem onClick={fn()}>
          <DropdownLabel>Archive</DropdownLabel>
          <DropdownShortcut keys={["⌘", "A"]} />
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={fn()}>
          <DropdownLabel>Delete</DropdownLabel>
          <DropdownShortcut keys={["⌘", "D"]} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithHeader: Story = {
  name: "With Header",
  render: () => (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownHeader>
          <div className="pr-6">
            <div className="text-text-secondary text-xs">
              Signed in as Tom Cook
            </div>
            <div className="text-text-primary text-sm/7 font-semibold">
              tom@example.com
            </div>
          </div>
        </DropdownHeader>
        <DropdownDivider />
        <DropdownItem href="/my-profile">My profile</DropdownItem>
        <DropdownItem href="/notifications">Notifications</DropdownItem>
        <DropdownItem href="/security">Security</DropdownItem>
        <DropdownItem href="/billing">Billing</DropdownItem>
        <DropdownItem onClick={() => fn()}>Sign out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithDisabledButton: Story = {
  name: "With Disabled Button",
  render: () => (
    <Dropdown>
      <DropdownButton outline disabled>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href="/users/1">View</DropdownItem>
        <DropdownItem href="/users/1/edit">Edit</DropdownItem>
        <DropdownItem onClick={fn()}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithIconTrigger: Story = {
  name: "With Icon Trigger",
  render: () => (
    <Dropdown>
      <DropdownButton plain aria-label="More options">
        <EllipsisHorizontalIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem>
          <PencilSquareIcon />
          <DropdownLabel>Edit</DropdownLabel>
        </DropdownItem>
        <DropdownItem>
          <TrashIcon />
          <DropdownLabel>Delete</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithAvatarTrigger: Story = {
  name: "With Avatar Trigger",
  render: () => (
    <Dropdown>
      <DropdownButton
        className="size-8"
        as={Avatar}
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      />
      <DropdownMenu>
        <DropdownItem>My Profile</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Sign Out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithCustomMenuWidth: Story = {
  name: "With Custom Menu Width",
  render: () => (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu className="min-w-48">
        <DropdownItem href="/account">Account</DropdownItem>
        <DropdownItem href="/notifications">Notifications</DropdownItem>
        <DropdownItem href="/billing">Billing</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};
