import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AuthLayout } from "@/app/_components/atoms/auth-layout";
import { Button } from "@/app/_components/atoms/button";
import { Input } from "@/app/_components/atoms/input";
import { Heading } from "@/app/_components/atoms/heading";
import { Text } from "@/app/_components/atoms/text";
import { Field, FieldGroup, Label } from "@/app/_components/atoms/fieldset";

const meta = {
  title: "Atoms/AuthLayout",
  component: AuthLayout,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginForm: Story = {
  args: {
    children: (
      <div className="w-full max-w-sm">
        <Heading level={2} className="mb-6 text-center">
          Sign in to your account
        </Heading>
        <FieldGroup>
          <Field>
            <Label>Email address</Label>
            <Input type="email" name="email" placeholder="Enter your email" />
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </Field>
        </FieldGroup>
        <Button className="mt-6 w-full">Sign in</Button>
        <Text className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="#" className="text-primary hover:underline">
            Sign up
          </a>
        </Text>
      </div>
    ),
  },
};

export const SignUpForm: Story = {
  args: {
    children: (
      <div className="w-full max-w-sm">
        <Heading level={2} className="mb-6 text-center">
          Create your account
        </Heading>
        <FieldGroup>
          <Field>
            <Label>Full name</Label>
            <Input type="text" name="name" placeholder="Enter your full name" />
          </Field>
          <Field>
            <Label>Email address</Label>
            <Input type="email" name="email" placeholder="Enter your email" />
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Create a password"
            />
          </Field>
          <Field>
            <Label>Confirm password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
            />
          </Field>
        </FieldGroup>
        <Button className="mt-6 w-full">Create account</Button>
        <Text className="mt-4 text-center">
          Already have an account?{" "}
          <a href="#" className="text-primary hover:underline">
            Sign in
          </a>
        </Text>
      </div>
    ),
  },
};

export const ForgotPassword: Story = {
  args: {
    children: (
      <div className="w-full max-w-sm">
        <Heading level={2} className="mb-6 text-center">
          Reset your password
        </Heading>
        <Text className="mb-6 text-center">
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>
        <FieldGroup>
          <Field>
            <Label>Email address</Label>
            <Input type="email" name="email" placeholder="Enter your email" />
          </Field>
        </FieldGroup>
        <Button className="mt-6 w-full">Send reset link</Button>
        <Text className="mt-4 text-center">
          Remember your password?{" "}
          <a href="#" className="text-primary hover:underline">
            Sign in
          </a>
        </Text>
      </div>
    ),
  },
};

export const EmptyState: Story = {
  args: {
    children: (
      <div className="text-center">
        <Heading level={2} className="mb-4">
          Authentication Layout
        </Heading>
        <Text>
          This layout provides a centered container for authentication forms. It
          includes responsive styling with a card background on larger screens.
        </Text>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <div className="w-full max-w-md">
        <Heading level={2} className="mb-6 text-center">
          Terms of Service
        </Heading>
        <div className="max-h-96 space-y-4 overflow-y-auto">
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </Text>
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
          <Text>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </Text>
          <Text>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt.
          </Text>
        </div>
        <div className="mt-6 flex gap-4">
          <Button outline className="flex-1">
            Decline
          </Button>
          <Button className="flex-1">Accept</Button>
        </div>
      </div>
    ),
  },
};
