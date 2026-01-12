"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mail, Lock, Shield } from "lucide-react";
import toast from "react-hot-toast";

import { Dialog } from "@/app/_components/atoms/dialog";
import { Button } from "@/app/_components/atoms/button";
import { Input, InputGroup } from "@/app/_components/atoms/input";
import { Field, Label, ErrorMessage } from "@/app/_components/atoms/fieldset";
import { authClient } from "@/server/better-auth/client";
import { useApp } from "@/app/_contexts/AppContext";
import { api } from "@/trpc/react";

// ============================================================================
// Types
// ============================================================================

export type DialogAuthVariant = "sign-in" | "sign-up" | "reset-password";

export type InvitationData = {
  token: string;
  email: string;
  role: string;
};

export type DialogAuthProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  variant: DialogAuthVariant;
  onVariantChange?: (variant: DialogAuthVariant) => void;
  backgroundImage?: string;
  invitation?: InvitationData;
  onSuccessRedirect?: string;
};

// ============================================================================
// Schemas
// ============================================================================

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// Social Icons
// ============================================================================

const GoogleIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const DiscordIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const XIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ============================================================================
// Helper Functions
// ============================================================================

const formatRole = (role: string) => {
  if (role === "superadmin") return "Super Admin";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

// ============================================================================
// Form Components
// ============================================================================

type SignInFormProps = {
  onSubmit: (data: SignInFormData) => Promise<void>;
  onForgotPassword: () => void;
  isLoading: boolean;
};

const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  onForgotPassword,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <Label>E-mail</Label>
        <InputGroup>
          <Mail data-slot="icon" />
          <Input
            type="email"
            placeholder="E-mail"
            {...register("email")}
            data-invalid={errors.email ? true : undefined}
          />
        </InputGroup>
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </Field>

      <Field>
        <Label>Password</Label>
        <InputGroup>
          <Lock data-slot="icon" />
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            data-invalid={errors.password ? true : undefined}
          />
        </InputGroup>
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </Field>

      <button
        type="button"
        onClick={onForgotPassword}
        className="text-muted-foreground hover:text-foreground text-sm underline transition-colors"
      >
        Forgot password?
      </button>

      <Button type="submit" className="w-full" loading={isLoading}>
        Sign in
      </Button>
    </form>
  );
};

type SignUpFormProps = {
  onSubmit: (data: SignUpFormData) => Promise<void>;
  isLoading: boolean;
  initialEmail?: string;
  emailReadOnly?: boolean;
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  isLoading,
  initialEmail,
  emailReadOnly,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: initialEmail ?? "",
    },
  });

  // Update email if initialEmail changes
  useEffect(() => {
    if (initialEmail) {
      setValue("email", initialEmail);
    }
  }, [initialEmail, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <Label>E-mail</Label>
        <InputGroup>
          <Mail data-slot="icon" />
          <Input
            type="email"
            placeholder="E-mail"
            {...register("email")}
            data-invalid={errors.email ? true : undefined}
            readOnly={emailReadOnly}
            className={emailReadOnly ? "bg-muted cursor-not-allowed" : ""}
          />
        </InputGroup>
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </Field>

      <Field>
        <Label>Password</Label>
        <InputGroup>
          <Lock data-slot="icon" />
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            data-invalid={errors.password ? true : undefined}
          />
        </InputGroup>
        <p className="text-muted-foreground mt-1 text-sm">
          Minimum 6 characters
        </p>
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </Field>

      <Button type="submit" className="w-full" loading={isLoading}>
        Create Free Account
      </Button>
    </form>
  );
};

type ResetPasswordFormProps = {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  isLoading: boolean;
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <Label>E-mail</Label>
        <InputGroup>
          <Mail data-slot="icon" />
          <Input
            type="email"
            placeholder="E-mail"
            {...register("email")}
            data-invalid={errors.email ? true : undefined}
          />
        </InputGroup>
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </Field>

      <Button type="submit" className="w-full" loading={isLoading}>
        Send Reset Link
      </Button>
    </form>
  );
};

// ============================================================================
// Invitation Banner
// ============================================================================

type InvitationBannerProps = {
  email: string;
  role: string;
};

const InvitationBanner: React.FC<InvitationBannerProps> = ({ email, role }) => {
  return (
    <div className="bg-primary/10 border-primary/20 mb-6 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <Shield className="text-primary mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-foreground text-sm font-medium">
            You&apos;ve been invited!
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Create your account for <strong>{email}</strong> with{" "}
            <strong>{formatRole(role)}</strong> privileges.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Social Login Buttons
// ============================================================================

type SocialButtonsProps = {
  mode: "sign-in" | "sign-up";
  onSocialLogin: (provider: "google" | "discord" | "twitter") => Promise<void>;
  isLoading: boolean;
};

const SocialButtons: React.FC<SocialButtonsProps> = ({
  mode,
  onSocialLogin,
  isLoading,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-sm">
          or {mode === "sign-in" ? "sign in" : "continue"} with
        </span>
        <div className="bg-border h-px flex-1" />
      </div>

      <Button
        type="button"
        outline
        className="w-full"
        onClick={() => onSocialLogin("google")}
        disabled={isLoading}
      >
        <GoogleIcon />
        Google
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          className="bg-[#5865F2] hover:bg-[#4752C4]"
          onClick={() => onSocialLogin("discord")}
          disabled={isLoading}
        >
          <DiscordIcon />
          Discord
        </Button>

        <Button
          type="button"
          className="bg-black text-white hover:bg-zinc-800"
          onClick={() => onSocialLogin("twitter")}
          disabled={isLoading}
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const DialogAuth: React.FC<DialogAuthProps> = ({
  className,
  open,
  onClose,
  variant,
  onVariantChange,
  backgroundImage = "/images/girl-poster.webp",
  invitation,
  onSuccessRedirect,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { refetchSession } = useApp();

  const markInvitationUsed = api.invitation.markUsed.useMutation();
  const checkAndApplyRole = api.invitation.checkAndApplyRole.useMutation();

  const handleSuccessfulAuth = async (userId?: string) => {
    await refetchSession();

    // If this is an invitation signup, mark the invitation as used
    if (invitation && userId) {
      try {
        await markInvitationUsed.mutateAsync({
          token: invitation.token,
          userId,
        });
        toast.success(
          `Account created with ${formatRole(invitation.role)} privileges!`,
        );
      } catch {
        // Role assignment failed but user was created
        toast.success("Account created successfully!");
      }
    } else {
      toast.success(
        variant === "sign-in"
          ? "Signed in successfully!"
          : "Account created successfully!",
      );
    }

    onClose();

    // Redirect after successful auth
    if (onSuccessRedirect) {
      router.push(onSuccessRedirect);
    } else if (invitation) {
      // Invited users go to dashboard
      router.push("/dashboard");
    }
  };

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Sign in failed");
      } else {
        await handleSuccessfulAuth();
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.email.split("@")[0] ?? "User",
      });
      if (result.error) {
        toast.error(result.error.message ?? "Sign up failed");
      } else {
        // Get the user ID from the result
        const userId = result.data?.user?.id;
        await handleSuccessfulAuth(userId);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      // Note: better-auth requires email verification plugin for password reset
      // For now, show a placeholder message. Configure the plugin when needed.
      toast.success(`Reset instructions would be sent to ${data.email}`);
      onVariantChange?.("sign-in");
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "discord" | "twitter",
  ) => {
    setIsLoading(true);
    try {
      // Store invitation token in sessionStorage for OAuth callback
      if (invitation) {
        sessionStorage.setItem("pendingInviteToken", invitation.token);
      }

      const callbackURL = invitation
        ? `/auth/callback?invite=${invitation.token}`
        : (onSuccessRedirect ?? "/");

      await authClient.signIn.social({
        provider,
        callbackURL,
      });
    } catch {
      toast.error("Social login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const titles: Record<DialogAuthVariant, string> = {
    "sign-in": "Sign in",
    "sign-up": invitation ? "Accept Invitation" : "Create Account",
    "reset-password": "Reset Password",
  };

  return (
    <Dialog
      className={clsx("overflow-hidden p-0!", className)}
      open={open}
      onClose={onClose}
      size="3xl"
    >
      <div className="flex min-h-125">
        {/* Left side - Background image */}
        <div
          className="relative hidden w-1/2 md:block"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Right side - Form content */}
        <div className="relative flex w-full flex-col p-8 md:w-1/2">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground absolute top-4 right-4 transition-colors"
          >
            <X className="size-6" />
          </button>

          {/* Title */}
          <h2 className="text-foreground mb-6 text-center text-2xl font-bold">
            {titles[variant]}
          </h2>

          {/* Invitation Banner */}
          {invitation && variant === "sign-up" && (
            <InvitationBanner email={invitation.email} role={invitation.role} />
          )}

          {/* Form */}
          <div className="flex-1">
            {variant === "sign-in" && (
              <>
                <SignInForm
                  onSubmit={handleSignIn}
                  onForgotPassword={() => onVariantChange?.("reset-password")}
                  isLoading={isLoading}
                />
                <div className="mt-6">
                  <SocialButtons
                    mode="sign-in"
                    onSocialLogin={handleSocialLogin}
                    isLoading={isLoading}
                  />
                </div>
              </>
            )}

            {variant === "sign-up" && (
              <>
                <SignUpForm
                  onSubmit={handleSignUp}
                  isLoading={isLoading}
                  initialEmail={invitation?.email}
                  emailReadOnly={!!invitation}
                />
                <div className="mt-6">
                  <SocialButtons
                    mode="sign-up"
                    onSocialLogin={handleSocialLogin}
                    isLoading={isLoading}
                  />
                </div>
                <p className="text-muted-foreground mt-4 text-center text-xs">
                  By signing up, you agree to{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </>
            )}

            {variant === "reset-password" && (
              <ResetPasswordForm
                onSubmit={handleResetPassword}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center">
            {variant === "sign-in" && (
              <p className="text-muted-foreground text-sm">
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => onVariantChange?.("sign-up")}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}

            {variant === "sign-up" && !invitation && (
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onVariantChange?.("sign-in")}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}

            {variant === "reset-password" && (
              <button
                type="button"
                onClick={() => onVariantChange?.("sign-in")}
                className="text-primary text-sm hover:underline"
              >
                Back to Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogAuth;
