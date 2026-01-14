"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Handshake } from "lucide-react";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Field, Label, ErrorMessage } from "@/app/_components/atoms/fieldset";
import { Input } from "@/app/_components/atoms/input";
import { Textarea } from "@/app/_components/atoms/textarea";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "@/app/_components/atoms/listbox";
import { api } from "@/trpc/react";

export type DialogRequestAffiliationProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const AFFILIATE_TYPES = [
  { id: "influencer", label: "Influencer" },
  { id: "blogger", label: "Blogger" },
  { id: "youtuber", label: "YouTuber" },
  { id: "social_media", label: "Social Media" },
  { id: "website_owner", label: "Website Owner" },
  { id: "email_marketing", label: "Email Marketing" },
  { id: "other", label: "Other" },
] as const;

const affiliationRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  websiteUrl: z.string().min(1, "Website URL is required").url("Invalid URL"),
  telegram: z.string().optional(),
  type: z.string().min(1, "Please select a type"),
  introduction: z.string().optional(),
  promotionalMethods: z.string().optional(),
});

type AffiliationRequestSchemaType = z.infer<typeof affiliationRequestSchema>;

const DialogRequestAffiliation: React.FC<DialogRequestAffiliationProps> = ({
  className,
  open,
  onClose,
  onSuccess,
}) => {
  const defaultValues = {
    firstName: "",
    websiteUrl: "",
    telegram: "",
    type: "",
    introduction: "",
    promotionalMethods: "",
  };

  const submitApplication = api.affiliate.submitApplication.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error.message ?? "Failed to submit application. Please try again.",
      );
    },
  });

  const loading = submitApplication.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AffiliationRequestSchemaType>({
    resolver: zodResolver(affiliationRequestSchema),
    defaultValues,
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset]);

  const onFormSubmit = (data: AffiliationRequestSchemaType) => {
    submitApplication.mutate({
      firstName: data.firstName,
      websiteUrl: data.websiteUrl,
      telegram: data.telegram ?? undefined,
      type: data.type as
        | "influencer"
        | "blogger"
        | "youtuber"
        | "social_media"
        | "website_owner"
        | "email_marketing"
        | "other",
      introduction: data.introduction ?? undefined,
      promotionalMethods: data.promotionalMethods ?? undefined,
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      className={clsx("", className)}
      open={open}
      onClose={handleClose}
      size="2xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Header with icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 rounded-xl p-4">
            <Handshake className="text-primary h-10 w-10" />
          </div>
        </div>

        <DialogTitle className="text-center">Affiliate Program</DialogTitle>

        <DialogDescription className="space-y-2 text-center">
          <p>Welcome to the Affiliate Program Application!</p>
          <p>We appreciate your interest in partnering with us.</p>
        </DialogDescription>

        <DialogBody className="space-y-4">
          {/* Benefits Section */}
          <div className="bg-muted space-y-2 rounded-lg p-4">
            <p className="text-sm">
              <span className="mr-2">🌟</span>
              Earn <strong>40% commission</strong> on <strong>recurring</strong>{" "}
              subscriptions and token purchases.
            </p>
            <p className="text-muted-foreground text-sm">
              We will review the application and send you a confirmation email
              with the next steps within 24h!
            </p>
          </div>

          {/* First Name Field */}
          <Field>
            <Label>First Name</Label>
            <Input
              type="text"
              placeholder="Enter your first name"
              {...register("firstName")}
              data-invalid={errors.firstName ? true : undefined}
              disabled={loading}
            />
            {errors.firstName && (
              <ErrorMessage>{errors.firstName.message}</ErrorMessage>
            )}
          </Field>

          {/* Website URL Field */}
          <Field>
            <Label>Website or Traffic source URL</Label>
            <Input
              type="url"
              placeholder="https://example.com"
              {...register("websiteUrl")}
              data-invalid={errors.websiteUrl ? true : undefined}
              disabled={loading}
            />
            {errors.websiteUrl && (
              <ErrorMessage>{errors.websiteUrl.message}</ErrorMessage>
            )}
          </Field>

          {/* Telegram Field */}
          <Field>
            <Label>Telegram (optional)</Label>
            <Input
              type="text"
              placeholder="@username"
              {...register("telegram")}
              disabled={loading}
            />
          </Field>

          {/* Type Dropdown */}
          <Field>
            <Label>Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                  placeholder="Select from dropdown"
                >
                  {AFFILIATE_TYPES.map((type) => (
                    <ListboxOption key={type.id} value={type.id}>
                      <ListboxLabel>{type.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
          </Field>

          {/* Introduction Textarea */}
          <Field>
            <Label>Briefly introduce yourself (optional)</Label>
            <Textarea
              rows={3}
              placeholder="Explain why you are interested in joining..."
              {...register("introduction")}
              disabled={loading}
            />
          </Field>

          {/* Promotional Methods Textarea */}
          <Field>
            <Label>How do you plan to promote? (optional)</Label>
            <Textarea
              rows={3}
              placeholder="Describe your promotional methods or strategies..."
              {...register("promotionalMethods")}
              disabled={loading}
            />
          </Field>

          {/* Disclaimer */}
          <p className="text-muted-foreground text-center text-xs">
            Never share sensitive information through this form.
          </p>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Submit Application
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogRequestAffiliation;
