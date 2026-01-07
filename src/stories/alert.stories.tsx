import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { fn } from "storybook/test";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertBody,
  AlertActions,
} from "@/app/_components/atoms/alert";
import { Button } from "@/app/_components/atoms/button";

// Wrapper component to manage alert state
const AlertWithTrigger = ({
  children,
  ...props
}: React.ComponentProps<typeof Alert>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Alert</Button>
      <Alert {...props} open={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </Alert>
    </>
  );
};

const meta = {
  title: "Atoms/Alert",
  component: AlertWithTrigger,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof AlertWithTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: <p>This is a basic alert message.</p>,
  },
};

export const WithTitle: Story = {
  args: {
    size: "md",
    children: (
      <>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>
          This is an alert with a title and description.
        </AlertDescription>
      </>
    ),
  },
};

export const WithActions: Story = {
  args: {
    size: "md",
    children: (
      <>
        <AlertTitle>Confirm Action</AlertTitle>
        <AlertDescription>
          Are you sure you want to perform this action?
        </AlertDescription>
        <AlertActions>
          <Button outline onClick={fn()}>
            Cancel
          </Button>
          <Button onClick={fn()}>Confirm</Button>
        </AlertActions>
      </>
    ),
  },
};

export const WithBody: Story = {
  args: {
    size: "lg",
    children: (
      <>
        <AlertTitle>Complex Alert</AlertTitle>
        <AlertDescription>
          This alert contains additional body content.
        </AlertDescription>
        <AlertBody>
          <p>
            This is additional content in the alert body. You can include any
            custom content here.
          </p>
        </AlertBody>
        <AlertActions>
          <Button onClick={fn()}>Close</Button>
          <Button onClick={fn()}>Save</Button>
        </AlertActions>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: (
      <>
        <AlertTitle>Small Alert</AlertTitle>
        <AlertDescription>This is a small-sized alert.</AlertDescription>
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: "xl",
    children: (
      <>
        <AlertTitle>Large Alert</AlertTitle>
        <AlertDescription>
          This is a large-sized alert with more space.
        </AlertDescription>
        <AlertBody>
          <p>
            Large alerts can contain more content and provide better readability
            for complex messages.
          </p>
        </AlertBody>
      </>
    ),
  },
};
