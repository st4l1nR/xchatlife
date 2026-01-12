import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import TableCharacter from "@/app/_components/organisms/TableCharacter";
import type { TableCharacterItem } from "@/app/_components/organisms/TableCharacter";

const characterNames = [
  "Jordan Stevenson",
  "Richard Payne",
  "Jennifer Summers",
  "Mr. Justin Richardson",
  "Nicholas Tanner",
  "Crystal Mays",
  "Mary Garcia",
  "Megan Roberts",
  "Joseph Oliver",
  "Sarah Mitchell",
];

const usernames = [
  "jordan.stevenson",
  "richard247",
  "summers.45",
  "jr.3734",
  "nicholas.t",
  "mays.754",
  "mary.garcia",
  "roberts.3456",
  "joseph.87",
  "sarah.m",
];

const sampleAvatars = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

const likesData = [13, 100, 1000, 3500, 1, 20, 30, 60, 80, 150];
const chatsData = [12, 1000, 3000, 4000, 5000, 6000, 2000, 3000, 3000, 500];

const createMockCharacter = (id: number): TableCharacterItem => ({
  id: `char-${id}`,
  name: characterNames[id % characterNames.length]!,
  username: usernames[id % usernames.length]!,
  avatarSrc: sampleAvatars[id % sampleAvatars.length],
  style: id % 2 === 0 ? "anime" : "realistic",
  likes: likesData[id % likesData.length]!,
  chats: chatsData[id % chatsData.length]!,
  status: id % 3 === 0 ? "draft" : "published",
});

const mockCharacters = Array.from({ length: 10 }, (_, i) =>
  createMockCharacter(i),
);

const manyCharacters = Array.from({ length: 50 }, (_, i) =>
  createMockCharacter(i),
);

const meta = {
  title: "Organisms/TableCharacter",
  component: TableCharacter,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Show loading skeleton state",
    },
    totalDocs: {
      control: "number",
      description: "Total number of documents for display logic",
    },
    onDelete: {
      action: "delete",
      description: "Callback when delete button is clicked",
    },
    onView: {
      action: "view",
      description: "Callback when view button is clicked",
    },
    onMore: {
      action: "more",
      description: "Callback when more options is clicked",
    },
  },
  args: {
    onDelete: fn(),
    onView: fn(),
    onMore: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-6xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableCharacter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
    totalDocs: mockCharacters.length,
    data: mockCharacters,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    totalDocs: 0,
    data: [],
  },
};

export const Empty: Story = {
  args: {
    loading: false,
    totalDocs: 0,
    data: [],
  },
};

export const ManyRows: Story = {
  args: {
    loading: false,
    totalDocs: manyCharacters.length,
    data: manyCharacters,
    pagination: {
      page: 1,
      total: 50,
      totalPage: 5,
      size: 10,
    },
  },
};

export const AllPublished: Story = {
  args: {
    loading: false,
    totalDocs: 10,
    data: mockCharacters.map((char) => ({
      ...char,
      status: "published" as const,
    })),
  },
};

export const AllDraft: Story = {
  args: {
    loading: false,
    totalDocs: 10,
    data: mockCharacters.map((char) => ({ ...char, status: "draft" as const })),
  },
};

export const WithInteractivePagination: Story = {
  render: function Render(args) {
    const [page, setPage] = React.useState(1);
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = manyCharacters.slice(
      startIndex,
      startIndex + pageSize,
    );

    return (
      <TableCharacter
        {...args}
        data={paginatedData}
        pagination={{
          page,
          total: manyCharacters.length,
          totalPage: Math.ceil(manyCharacters.length / pageSize),
          size: pageSize,
        }}
        onPageChange={setPage}
      />
    );
  },
  args: {
    loading: false,
    totalDocs: 50,
  },
};
