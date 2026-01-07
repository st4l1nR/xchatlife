import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { InboxIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar } from "@/app/_components/atoms/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/app/_components/atoms/dropdown";
import { Link } from "@/app/_components/atoms/link";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "@/app/_components/atoms/navbar";

const meta = {
  title: "Atoms/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems = [
  { label: "Home", href: "#" },
  { label: "Events", href: "#" },
  { label: "Orders", href: "#" },
];

export const Basic: Story = {
  render: (args) => (
    <Navbar {...args}>
      <NavbarSection>
        {navItems.map((item) => (
          <NavbarItem key={item.label} href={item.href}>
            {item.label}
          </NavbarItem>
        ))}
      </NavbarSection>
    </Navbar>
  ),
};

export const WithActiveState: Story = {
  render: (args) => (
    <Navbar {...args}>
      <NavbarSection>
        <NavbarItem href="#" current>
          Home
        </NavbarItem>
        <NavbarItem href="#">Events</NavbarItem>
        <NavbarItem href="#">Orders</NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

export const WithIconsAndSpacer: Story = {
  render: (args) => (
    <Navbar {...args}>
      <Link href="#" aria-label="Home">
        <Avatar src="https://tailwindcss.com/favicon.ico" className="size-8" />
      </Link>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="#" aria-label="Search">
          <MagnifyingGlassIcon />
        </NavbarItem>
        <NavbarItem href="#" aria-label="Inbox">
          <InboxIcon />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

export const WithDivider: Story = {
  render: (args) => (
    <Navbar {...args}>
      <Link href="#" aria-label="Home">
        <Avatar src="https://tailwindcss.com/favicon.ico" className="size-8" />
      </Link>
      <NavbarDivider />
      <NavbarSection>
        <NavbarItem href="#" current>
          Home
        </NavbarItem>
        <NavbarItem href="#">Events</NavbarItem>
        <NavbarItem href="#">Orders</NavbarItem>
      </NavbarSection>
    </Navbar>
  ),
};

export const FullExample: Story = {
  name: "Full Example (with Dropdowns and Avatars)",
  render: (args) => (
    <Navbar {...args}>
      <Dropdown>
        <DropdownButton as={NavbarItem}>
          <Avatar src="https://tailwindcss.com/favicon.ico" />
          <NavbarLabel>Tailwind Labs</NavbarLabel>
          <ChevronDownIcon />
        </DropdownButton>
        <DropdownMenu className="min-w-64" anchor="bottom start">
          <DropdownItem href="#">
            <Cog8ToothIcon />
            <DropdownLabel>Settings</DropdownLabel>
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem href="#">
            <Avatar slot="icon" src="https://tailwindcss.com/favicon.ico" />
            <DropdownLabel>Tailwind Labs</DropdownLabel>
          </DropdownItem>
          <DropdownItem href="#">
            <Avatar
              slot="icon"
              initials="WC"
              className="bg-purple-500 text-white"
            />
            <DropdownLabel>Workcation</DropdownLabel>
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem href="#">
            <PlusIcon />
            <DropdownLabel>New team&hellip;</DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <NavbarDivider className="max-lg:hidden" />

      <NavbarSection className="max-lg:hidden">
        <NavbarItem href="#" current>
          Home
        </NavbarItem>
        <NavbarItem href="#">Events</NavbarItem>
        <NavbarItem href="#">Orders</NavbarItem>
      </NavbarSection>

      <NavbarSpacer />

      <NavbarSection>
        <NavbarItem href="#" aria-label="Search">
          <MagnifyingGlassIcon />
        </NavbarItem>
        <NavbarItem href="#" aria-label="Inbox">
          <InboxIcon />
        </NavbarItem>
        <Dropdown>
          <DropdownButton as={NavbarItem}>
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              square
            />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom end">
            <DropdownItem href="#">
              <UserIcon />
              <DropdownLabel>My profile</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="#">
              <Cog8ToothIcon />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="#">
              <ShieldCheckIcon />
              <DropdownLabel>Privacy policy</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="#">
              <LightBulbIcon />
              <DropdownLabel>Share feedback</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="#">
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarSection>
    </Navbar>
  ),
};
