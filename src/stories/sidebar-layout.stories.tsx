import {
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from "@heroicons/react/20/solid";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar } from "@/app/_components/atoms/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/app/_components/atoms/dropdown";
import { Navbar, NavbarItem } from "@/app/_components/atoms/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/app/_components/atoms/sidebar";
import { SidebarLayout } from "@/app/_components/atoms/sidebar-layout";

const meta = {
  title: "Atoms/SidebarLayout",
  component: SidebarLayout,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SidebarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navbar: (
      <Navbar>
        <NavbarItem href="/search" aria-label="Search">
          <MagnifyingGlassIcon />
        </NavbarItem>
        <NavbarItem href="/inbox" aria-label="Inbox">
          <InboxIcon />
        </NavbarItem>
      </Navbar>
    ),
    sidebar: (
      <Sidebar>
        <SidebarHeader>
          <Dropdown>
            <DropdownButton as={SidebarItem}>
              <Avatar
                src="https://tailwindcss.com/_next/static/media/tailwind-ui-logo-on-dark.622b628a.svg"
                alt="Tailwind Labs"
              />
              <SidebarLabel>Tailwind Labs</SidebarLabel>
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem href="#">
                <DropdownLabel>My Profile</DropdownLabel>
              </DropdownItem>
              <DropdownItem href="#">
                <DropdownLabel>Settings</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarItem href="#">
              <HomeIcon />
              <SidebarLabel>Home</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#">
              <Square2StackIcon />
              <SidebarLabel>Events</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#">
              <TicketIcon />
              <SidebarLabel>Orders</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#">
              <MegaphoneIcon />
              <SidebarLabel>Broadcasts</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#">
              <Cog6ToothIcon />
              <SidebarLabel>Settings</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
          <SidebarSpacer />
          <SidebarSection>
            <SidebarItem href="#">
              <QuestionMarkCircleIcon />
              <SidebarLabel>Support</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#">
              <SparklesIcon />
              <SidebarLabel>Changelog</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarBody>
      </Sidebar>
    ),
  },
  render: (args) => (
    <SidebarLayout {...args}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p>This is where the main content of the page would go.</p>
      </div>
    </SidebarLayout>
  ),
};
