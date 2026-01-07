import {
  Cog6ToothIcon,
  HomeIcon,
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
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/app/_components/atoms/sidebar";
import { SidebarLayout } from "@/app/_components/atoms/sidebar-layout";
const meta = {
  title: "Atoms/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <SidebarLayout
      sidebar={
        <Sidebar {...args}>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="#">
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#" current>
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
          </SidebarBody>
        </Sidebar>
      }
      navbar={<div>Navbar</div>}
    >
      {" "}
      Page
    </SidebarLayout>
  ),
};

export const WithHeader: Story = {
  render: (args) => (
    <Sidebar {...args}>
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
          <SidebarItem href="#" current>
            <Square2StackIcon />
            <SidebarLabel>Events</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
    </Sidebar>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <Sidebar {...args}>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="#">
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="#" current>
            <Square2StackIcon />
            <SidebarLabel>Events</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <Avatar
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Erica"
            />
            <SidebarLabel>Erica</SidebarLabel>
          </DropdownButton>
          <DropdownMenu>
            <DropdownItem href="#">
              <DropdownLabel>My Profile</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="#">
              <DropdownLabel>Sign Out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  ),
};

export const WithHeadingsAndSpacers: Story = {
  render: (args) => (
    <Sidebar {...args}>
      <SidebarBody>
        <SidebarSection>
          <SidebarHeading>Main</SidebarHeading>
          <SidebarItem href="#">
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="#" current>
            <Square2StackIcon />
            <SidebarLabel>Events</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection>
          <SidebarHeading>Resources</SidebarHeading>
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
};
