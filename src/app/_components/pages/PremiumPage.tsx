"use client";

import React, { useState, useEffect } from "react";
import { Crown, Check, AlertTriangle, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../atoms/dialog";
import DialogAuth, { type DialogAuthVariant } from "../organisms/DialogAuth";
import DialogUpgrade from "../organisms/DialogUpgrade";
import { useApp } from "@/app/_contexts/AppContext";
import { api } from "@/trpc/react";

const BILLING_CYCLE_LABELS = {
  monthly: { label: "Monthly", months: 1, price: 12.99, pricePerMonth: 12.99 },
  quarterly: {
    label: "Quarterly (3 months)",
    months: 3,
    price: 23.97,
    pricePerMonth: 7.99,
  },
  annually: {
    label: "Annual (12 months)",
    months: 12,
    price: 47.88,
    pricePerMonth: 3.99,
  },
} as const;

const PREMIUM_BENEFITS = [
  "100 FREE tokens/month",
  "Unlimited text messages",
  "Generate images",
  "Make AI phone calls",
  "Fast response time",
] as const;

const STATUS_BADGES = {
  active: { color: "green" as const, label: "Active" },
  cancelled: { color: "yellow" as const, label: "Cancelled" },
  pending: { color: "blue" as const, label: "Pending" },
  expired: { color: "red" as const, label: "Expired" },
} as const;

const PremiumPage: React.FC = () => {
  const { isAuthenticated, isAuthLoading, hasActiveSubscription } = useApp();

  // Dialog states
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch subscription data
  const {
    data: subscriptionData,
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscription,
  } = api.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Cancel mutation
  const cancelMutation = api.subscription.cancel.useMutation({
    onSuccess: () => {
      toast.success(
        "Subscription cancelled. You can continue using premium until the end of your billing period.",
      );
      setCancelDialogOpen(false);
      void refetchSubscription();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel subscription");
    },
  });

  const subscription = subscriptionData?.data;

  // Show appropriate dialog based on auth/subscription state
  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      setUpgradeDialogOpen(false);
    } else if (!hasActiveSubscription && !subscription) {
      setAuthDialogOpen(false);
      setUpgradeDialogOpen(true);
    } else {
      setAuthDialogOpen(false);
      setUpgradeDialogOpen(false);
    }
  }, [isAuthenticated, isAuthLoading, hasActiveSubscription, subscription]);

  const handleCancelSubscription = () => {
    cancelMutation.mutate();
  };

  // Format date helper
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (isAuthLoading || (isAuthenticated && isSubscriptionLoading)) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Get billing cycle info
  const billingCycle = subscription?.billingCycle as
    | keyof typeof BILLING_CYCLE_LABELS
    | undefined;
  const billingInfo = billingCycle ? BILLING_CYCLE_LABELS[billingCycle] : null;
  const statusInfo = subscription?.status
    ? STATUS_BADGES[subscription.status as keyof typeof STATUS_BADGES]
    : null;

  return (
    <div className="bg-background min-h-screen px-4 py-8 md:px-6 lg:px-8">
      {/* Title */}
      <h1 className="text-foreground mb-8 text-center text-2xl font-bold lg:text-3xl">
        My Subscription
      </h1>

      {/* Subscription card - only show if user has subscription */}
      {subscription && (
        <div className="mx-auto max-w-lg">
          <div className="bg-muted rounded-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Crown className="text-primary size-6" />
                </div>
                <h2 className="text-foreground text-xl font-bold">
                  Premium Plan
                </h2>
              </div>
              {statusInfo && (
                <Badge color={statusInfo.color}>{statusInfo.label}</Badge>
              )}
            </div>

            {/* Plan details */}
            {billingInfo && (
              <div className="mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-foreground font-medium">
                    {billingInfo.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="text-foreground font-medium">
                    ${billingInfo.pricePerMonth.toFixed(2)}/month
                    {billingInfo.months > 1 && (
                      <span className="text-muted-foreground text-sm">
                        {" "}
                        (${billingInfo.price.toFixed(2)} total)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-border mb-6 border-t" />

            {/* Dates */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground size-4" />
                <span className="text-muted-foreground text-sm">Started</span>
                <span className="text-foreground ml-auto text-sm font-medium">
                  {formatDate(subscription.currentPeriodStart)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground size-4" />
                <span className="text-muted-foreground text-sm">
                  {subscription.status === "cancelled" ? "Expires" : "Renews"}
                </span>
                <span className="text-foreground ml-auto text-sm font-medium">
                  {formatDate(subscription.currentPeriodEnd)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-muted-foreground size-4" />
                <span className="text-muted-foreground text-sm">
                  Days remaining
                </span>
                <span className="text-foreground ml-auto text-sm font-medium">
                  {subscription.daysRemaining}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-border mb-6 border-t" />

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-foreground mb-3 text-sm font-semibold">
                Benefits included
              </h3>
              <ul className="space-y-2">
                {PREMIUM_BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-muted-foreground flex items-center gap-2 text-sm"
                  >
                    <Check className="text-primary size-4 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancelled notice */}
            {subscription.status === "cancelled" && (
              <div className="mb-6 rounded-lg bg-yellow-500/10 p-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Your subscription has been cancelled. You can continue using
                  premium features until{" "}
                  {formatDate(subscription.currentPeriodEnd)}.
                </p>
              </div>
            )}

            {/* Pending notice */}
            {subscription.status === "pending" && (
              <div className="mb-6 rounded-lg bg-blue-500/10 p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Your payment is being processed. This may take a few minutes.
                </p>
              </div>
            )}

            {/* Cancel button - only show for active subscriptions */}
            {subscription.status === "active" && (
              <Button
                outline
                onClick={() => setCancelDialogOpen(true)}
                className="w-full text-red-500 hover:text-red-600"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Auth dialog */}
      <DialogAuth
        open={authDialogOpen}
        onClose={() => {
          // Don't allow closing if not authenticated
          if (isAuthenticated) {
            setAuthDialogOpen(false);
          }
        }}
        variant={authVariant}
        onVariantChange={setAuthVariant}
      />

      {/* Upgrade dialog */}
      <DialogUpgrade
        open={upgradeDialogOpen}
        onClose={() => {
          // Don't allow closing if user doesn't have subscription
          if (hasActiveSubscription || subscription) {
            setUpgradeDialogOpen(false);
          }
        }}
      />

      {/* Cancel confirmation dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="text-destructive size-5" />
          Cancel Subscription
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel your subscription? You will continue
          to have access to premium features until the end of your current
          billing period.
        </DialogDescription>
        <DialogBody />
        <DialogActions>
          <Button
            plain
            onClick={() => setCancelDialogOpen(false)}
            disabled={cancelMutation.isPending}
          >
            Keep Subscription
          </Button>
          <Button
            color="red"
            onClick={handleCancelSubscription}
            loading={cancelMutation.isPending}
          >
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PremiumPage;
