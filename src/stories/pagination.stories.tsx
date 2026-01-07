import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/app/_components/atoms/pagination";

const meta = {
  title: "Atoms/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationPrevious href="#" />
      <PaginationList>
        <PaginationPage href="#">1</PaginationPage>
        <PaginationPage href="#">2</PaginationPage>
        <PaginationPage href="#" current>
          3
        </PaginationPage>
        <PaginationPage href="#">4</PaginationPage>
        <PaginationGap />
        <PaginationPage href="#">10</PaginationPage>
      </PaginationList>
      <PaginationNext href="#" />
    </Pagination>
  ),
};

export const DisabledButtons: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationPrevious />
      <PaginationList>
        <PaginationPage href="#" current>
          1
        </PaginationPage>
        <PaginationPage href="#">2</PaginationPage>
        <PaginationPage href="#">3</PaginationPage>
        <PaginationPage href="#">4</PaginationPage>
        <PaginationGap />
        <PaginationPage href="#">10</PaginationPage>
      </PaginationList>
      <PaginationNext href="#" />
    </Pagination>
  ),
};

export const OnlyPreviousAndNext: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationPrevious href="#" />
      <PaginationNext href="#" />
    </Pagination>
  ),
};
