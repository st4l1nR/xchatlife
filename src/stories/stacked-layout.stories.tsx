import {
  ChevronDownIcon,
  Cog8ToothIcon,
  PlusIcon,
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
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "@/app/_components/atoms/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/app/_components/atoms/sidebar";
import { StackedLayout } from "@/app/_components/atoms/stacked-layout";

const meta = {
  title: "Atoms/StackedLayout",
  component: StackedLayout,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof StackedLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems = [
  { label: "Home", url: "/" },
  { label: "Events", url: "/events" },
  { label: "Orders", url: "/orders" },
  { label: "Broadcasts", url: "/broadcasts" },
  { label: "Settings", url: "/settings" },
];

function TeamDropdownMenu() {
  return (
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownItem href="/teams/1/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/1">
        <Avatar
          slot="icon"
          src="https://tailwindcss.com/_next/static/media/tailwind-ui-logo-on-dark.622b628a.svg"
        />
        <DropdownLabel>Tailwind Labs</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/teams/2">
        <Avatar
          slot="icon"
          initials="WC"
          className="bg-purple-500 text-white"
        />
        <DropdownLabel>Workcation</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/create">
        <PlusIcon />
        <DropdownLabel>New team&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export const Default: Story = {
  args: {
    navbar: (
      <Navbar>
        <Dropdown>
          <DropdownButton as={NavbarItem} className="max-lg:hidden">
            <Avatar src="https://tailwindcss.com/favicon.ico" />
            <NavbarLabel>Tailwind Labs</NavbarLabel>
            <ChevronDownIcon />
          </DropdownButton>
          <TeamDropdownMenu />
        </Dropdown>
        <NavbarDivider className="max-lg:hidden" />
        <NavbarSection className="max-lg:hidden">
          {navItems.map(({ label, url }) => (
            <NavbarItem key={label} href={url}>
              {label}
            </NavbarItem>
          ))}
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <NavbarItem href="/search" aria-label="Search">
            <MagnifyingGlassIcon />
          </NavbarItem>
          <NavbarItem href="/inbox" aria-label="Inbox">
            <InboxIcon />
          </NavbarItem>
        </NavbarSection>
      </Navbar>
    ),
    sidebar: (
      <Sidebar>
        <SidebarHeader>
          <Dropdown>
            <DropdownButton as={SidebarItem} className="lg:mb-2.5">
              <Avatar src="https://tailwindcss.com/_next/static/media/tailwind-ui-logo-on-dark.622b628a.svg" />
              <SidebarLabel>Tailwind Labs</SidebarLabel>
              <ChevronDownIcon />
            </DropdownButton>
            <TeamDropdownMenu />
          </Dropdown>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            {navItems.map(({ label, url }) => (
              <SidebarItem key={label} href={url}>
                {label}
              </SidebarItem>
            ))}
          </SidebarSection>
        </SidebarBody>
      </Sidebar>
    ),
  },
  render: (args) => (
    <StackedLayout {...args}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p>This is where the main content of the page would go.</p>
      </div>
    </StackedLayout>
  ),
};
