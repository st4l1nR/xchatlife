import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import DiscoverPage, {
  defaultMockData,
} from "@/app/_components/pages/DiscoverPage";
import DialogAuth from "@/app/_components/organisms/DialogAuth";
import type { DialogAuthVariant } from "@/app/_components/organisms/DialogAuth";

const meta = {
  title: "Pages/DiscoverPage",
  component: DiscoverPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/discover",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DiscoverPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default - logged in user
export const Default: Story = {
  args: {
    mock: defaultMockData,
  },
};

// Mobile view
export const Mobile: Story = {
  args: {
    mock: defaultMockData,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// Not logged in - with auth dialog
const NotLoggedInTemplate = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  return (
    <>
      <DiscoverPage
        mock={defaultMockData}
        onAuthRequired={() => setAuthOpen(true)}
      />
      <DialogAuth
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        variant={authVariant}
        onVariantChange={setAuthVariant}
      />
    </>
  );
};

export const NotLoggedIn: Story = {
  args: {
    mock: defaultMockData,
  },
  render: () => <NotLoggedInTemplate />,
};

// Empty state
export const Empty: Story = {
  args: {
    mock: { reels: [] },
  },
};
