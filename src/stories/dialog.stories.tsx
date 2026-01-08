import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Field, Label } from "@/app/_components/atoms/fieldset";
import { Input } from "@/app/_components/atoms/input";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/app/_components/atoms/dropdown";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

const meta = {
  title: "Atoms/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Disable controls for props that are managed by the story's render function
    open: { table: { disable: true } },
    onClose: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof Dialog>;

export const BasicExample: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setIsOpen(true)}>
          Refund payment
        </Button>
        <Dialog {...args} open={isOpen} onClose={setIsOpen}>
          <DialogTitle>Refund payment</DialogTitle>
          <DialogDescription>
            The refund will be reflected in the customer's bank account 2 to 3
            business days after processing.
          </DialogDescription>
          <DialogBody>
            <Field>
              <Label>Amount</Label>
              <Input name="amount" placeholder="$0.00" />
            </Field>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Refund</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

export const DialogWidth: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setIsOpen(true)}>
          Refund payment
        </Button>
        <Dialog {...args} open={isOpen} onClose={setIsOpen}>
          <DialogTitle>Refund payment</DialogTitle>
          <DialogDescription>
            The refund will be reflected in the customer's bank account 2 to 3
            business days after processing.
          </DialogDescription>
          <DialogBody>
            <Field>
              <Label>Amount</Label>
              <Input name="amount" placeholder="$0.00" />
            </Field>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Refund</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
  args: {
    size: "xl",
  },
};

export const OpeningFromDropdown: Story = {
  render: function Render() {
    let [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Dropdown>
          <DropdownButton outline>
            Options
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu>
            <DropdownItem onClick={() => setIsOpen(true)}>Refund</DropdownItem>
            <DropdownItem href="#" disabled>
              Download
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dialog open={isOpen} onClose={setIsOpen}>
          <DialogTitle>Refund payment</DialogTitle>
          <DialogDescription>
            The refund will be reflected in the customer's bank account 2 to 3
            business days after processing.
          </DialogDescription>
          <DialogBody>
            <Field>
              <Label>Amount</Label>
              <Input name="amount" placeholder="$0.00" />
            </Field>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Refund</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

export const AutoFocusingElements: Story = {
  name: "Auto-Focusing Elements",
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setIsOpen(true)}>
          Refund payment
        </Button>
        <Dialog {...args} open={isOpen} onClose={setIsOpen}>
          <DialogTitle>Refund payment</DialogTitle>
          <DialogDescription>
            The refund will be reflected in the customer's bank account 2 to 3
            business days after processing.
          </DialogDescription>
          <DialogBody>
            <Field>
              <Label>Amount</Label>
              <Input name="amount" placeholder="$0.00" autoFocus />
            </Field>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Refund</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

export const WithScrollingContent: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setIsOpen(true)}>
          Agree to terms
        </Button>
        <Dialog {...args} open={isOpen} onClose={setIsOpen}>
          <DialogTitle>Terms and conditions</DialogTitle>
          <DialogDescription>
            Please agree to the following terms and conditions to continue.
          </DialogDescription>
          <DialogBody className="text-text-primary text-sm/6">
            <p className="mt-4">
              By accessing and using our services, you are agreeing to these
              terms, which have been meticulously tailored for our benefit and
              your compliance.
            </p>
            <h3 className="mt-6 font-bold">
              Comprehensive Acceptance of Terms
            </h3>
            <p className="mt-4">
              Your engagement with our application signifies your irrevocable
              acceptance of these terms, which are binding regardless of your
              awareness or understanding of them. Your continued use acts as a
              silent nod of agreement to any and all stipulations outlined
              herein.
            </p>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>I agree</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
  args: {
    size: "xl",
  },
};
