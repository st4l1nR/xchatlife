import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import CardMediaUpload from "@/app/_components/molecules/CardMediaUpload";

const sampleImage =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";

const sampleVideo =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const meta = {
  title: "Molecules/CardMediaUpload",
  component: CardMediaUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed above the upload zone",
    },
    defaultMedia: {
      control: "text",
      description: "URL of the default/existing media (image or video)",
    },
    defaultMediaType: {
      control: "select",
      options: ["image", "video"],
      description: "Type of the default media (auto-detected if not provided)",
    },
    aspectRatio: {
      control: "select",
      options: ["16:9", "4:3", "1:1", "3:4", "9:16"],
      description: "Aspect ratio of the upload zone (default: 1:1)",
    },
    maxSize: {
      control: "number",
      description: "Maximum file size in bytes (default: 50MB)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the upload zone is disabled",
    },
    error: {
      control: "text",
      description: "Error message to display below the upload zone",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  args: {
    onChange: fn(),
    onRemove: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardMediaUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Product Media",
  },
};

export const AspectRatio16x9: Story = {
  name: "Aspect Ratio 16:9",
  args: {
    label: "Video Thumbnail (16:9)",
    aspectRatio: "16:9",
  },
};

export const AspectRatio4x3: Story = {
  name: "Aspect Ratio 4:3",
  args: {
    label: "Photo (4:3)",
    aspectRatio: "4:3",
  },
};

export const AspectRatio1x1: Story = {
  name: "Aspect Ratio 1:1 (Default)",
  args: {
    label: "Profile Picture (1:1)",
    aspectRatio: "1:1",
  },
};

export const AspectRatio3x4: Story = {
  name: "Aspect Ratio 3:4",
  args: {
    label: "Portrait (3:4)",
    aspectRatio: "3:4",
  },
};

export const AspectRatio9x16: Story = {
  name: "Aspect Ratio 9:16",
  args: {
    label: "Vertical Video (9:16)",
    aspectRatio: "9:16",
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const WithDefaultImage: Story = {
  args: {
    label: "Product Image",
    defaultMedia: sampleImage,
  },
};

export const WithDefaultVideo: Story = {
  args: {
    label: "Product Video",
    defaultMedia: sampleVideo,
    defaultMediaType: "video",
    aspectRatio: "16:9",
  },
};

export const ImageOnly: Story = {
  args: {
    label: "Images Only",
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
  },
};

export const VideoOnly: Story = {
  args: {
    label: "Videos Only",
    accept: { "video/*": [".mp4", ".webm", ".mov"] },
    aspectRatio: "16:9",
  },
};

export const WithError: Story = {
  args: {
    label: "Product Media",
    error: "File size exceeds the maximum limit of 50MB",
  },
};

export const Disabled: Story = {
  args: {
    label: "Product Media",
    disabled: true,
  },
};

export const DisabledWithImage: Story = {
  args: {
    label: "Product Image",
    defaultMedia: sampleImage,
    disabled: true,
  },
};

export const DisabledWithVideo: Story = {
  args: {
    label: "Product Video",
    defaultMedia: sampleVideo,
    defaultMediaType: "video",
    aspectRatio: "16:9",
    disabled: true,
  },
};

export const NoLabel: Story = {
  args: {},
};

export const AllAspectRatios: Story = {
  name: "All Aspect Ratios",
  decorators: [
    () => (
      <div className="flex flex-wrap items-start gap-6 p-4">
        <div className="w-48">
          <h3 className="text-foreground mb-2 text-sm font-semibold">16:9</h3>
          <CardMediaUpload label="Video" aspectRatio="16:9" onChange={fn()} />
        </div>
        <div className="w-48">
          <h3 className="text-foreground mb-2 text-sm font-semibold">4:3</h3>
          <CardMediaUpload label="Photo" aspectRatio="4:3" onChange={fn()} />
        </div>
        <div className="w-48">
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            1:1 (Default)
          </h3>
          <CardMediaUpload label="Square" aspectRatio="1:1" onChange={fn()} />
        </div>
        <div className="w-48">
          <h3 className="text-foreground mb-2 text-sm font-semibold">3:4</h3>
          <CardMediaUpload label="Portrait" aspectRatio="3:4" onChange={fn()} />
        </div>
        <div className="w-32">
          <h3 className="text-foreground mb-2 text-sm font-semibold">9:16</h3>
          <CardMediaUpload
            label="Vertical"
            aspectRatio="9:16"
            onChange={fn()}
          />
        </div>
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  name: "All Variants Grid",
  decorators: [
    () => (
      <div className="grid grid-cols-2 gap-6 p-4" style={{ width: "900px" }}>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            Default (Empty)
          </h3>
          <CardMediaUpload label="Product Media" onChange={fn()} />
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            With Default Image
          </h3>
          <CardMediaUpload
            label="Product Image"
            defaultMedia={sampleImage}
            onChange={fn()}
          />
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            With Default Video (16:9)
          </h3>
          <CardMediaUpload
            label="Product Video"
            defaultMedia={sampleVideo}
            defaultMediaType="video"
            aspectRatio="16:9"
            onChange={fn()}
          />
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            With Error
          </h3>
          <CardMediaUpload
            label="Product Media"
            error="File size exceeds the maximum limit"
            onChange={fn()}
          />
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            Disabled
          </h3>
          <CardMediaUpload label="Product Media" disabled onChange={fn()} />
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            Portrait (3:4)
          </h3>
          <CardMediaUpload
            label="Portrait Image"
            aspectRatio="3:4"
            onChange={fn()}
          />
        </div>
      </div>
    ),
  ],
};
