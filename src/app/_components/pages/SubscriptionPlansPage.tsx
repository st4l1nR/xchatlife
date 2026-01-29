"use client";

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Check, ShieldCheck, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../atoms/button";
import DialogAuth, { type DialogAuthVariant } from "../organisms/DialogAuth";
import { useApp } from "@/app/_contexts/AppContext";
import { api } from "@/trpc/react";

// Subscription plan type
type SubscriptionPlan = {
  id: string;
  label: string;
  months: number;
  originalPrice: number | null;
  price: number;
  discountPercent: number | null;
  isBestChoice: boolean;
  totalPrice: number;
};

// Default subscription plans
const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "annually",
    label: "12 months",
    months: 12,
    originalPrice: 12.99,
    price: 3.99,
    discountPercent: 70,
    isBestChoice: true,
    totalPrice: 47.88,
  },
  {
    id: "quarterly",
    label: "3 months",
    months: 3,
    originalPrice: 12.99,
    price: 7.99,
    discountPercent: 40,
    isBestChoice: false,
    totalPrice: 23.97,
  },
  {
    id: "monthly",
    label: "1 month",
    months: 1,
    originalPrice: null,
    price: 12.99,
    discountPercent: null,
    isBestChoice: false,
    totalPrice: 12.99,
  },
];

const DEFAULT_PREMIUM_BENEFITS = [
  "Create your own AI Girlfriend(s)",
  "Unlimited text messages",
  "Get 100 FREE tokens / month",
  "Remove image blur",
  "Generate images",
  "Make AI phone calls",
  "Fast response time",
];

type SubscriptionPlansPageProps = {
  className?: string;
  mock?: {
    plans?: SubscriptionPlan[];
    benefits?: string[];
    promotionalText?: {
      title: string;
      subtitle: string;
    };
  };
};

const SubscriptionPlansPage: React.FC<SubscriptionPlansPageProps> = ({
  className,
  mock,
}) => {
  const { isAuthenticated, isAuthLoading } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string>("annually");

  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  // Use mock data or defaults
  const plans = mock?.plans ?? DEFAULT_SUBSCRIPTION_PLANS;
  const benefits = mock?.benefits ?? DEFAULT_PREMIUM_BENEFITS;
  const promotionalText = mock?.promotionalText ?? {
    title: "50 Million Users Sale",
    subtitle: "for New Users",
  };

  // Get the selected plan details for the annual price display
  const annualPlan = plans.find((p) => p.id === "annually");

  // tRPC mutation for crypto subscription checkout
  const createCryptoCheckout =
    api.subscription.createCryptoCheckout.useMutation({
      onSuccess: () => {
        toast.success("Payment link sent to your email!");
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message ?? "Failed to create checkout session");
      },
    });

  const handlePayWithCard = () => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    // Card payments not yet implemented
    toast.error("Card payments coming soon!");
  };

  const handlePayWithCrypto = () => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    // Validate billing cycle
    const validCycles = ["monthly", "quarterly", "annually"] as const;
    type BillingCycle = (typeof validCycles)[number];
    if (!validCycles.includes(selectedPlan as BillingCycle)) {
      toast.error("Invalid plan selected");
      return;
    }

    // Create crypto checkout session
    createCryptoCheckout.mutate({
      billingCycle: selectedPlan as BillingCycle,
    });
  };

  return (
    <div
      className={clsx(
        "bg-background min-h-screen px-4 py-8 md:px-6 lg:px-8",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-8 text-center lg:mb-12">
        <h1 className="text-foreground mb-2 text-2xl font-bold lg:text-3xl">
          Choose your Plan
        </h1>
        <p className="text-muted-foreground text-sm">
          100% anonymous. You can cancel anytime.
        </p>
      </div>

      {/* Main content - 3 column layout on desktop */}
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* Left column - Promotional text & Girl image (hidden on mobile) */}
          <div className="hidden flex-col items-center justify-end lg:flex">
            {/* Promotional text */}
            <div className="mb-6 text-left">
              <h3 className="text-xl leading-tight font-bold xl:text-2xl">
                <span className="text-primary">{promotionalText.title}</span>
                <br />
                <span className="text-foreground">
                  {promotionalText.subtitle}
                </span>
              </h3>
              <p className="mt-2 text-sm">
                <span className="text-foreground">Discount ends soon.</span>{" "}
                <span className="text-destructive font-medium">
                  Don&apos;t miss out!
                </span>
              </p>
            </div>
            {/* Girl image */}
            <div className="relative h-72 w-44 xl:h-80 xl:w-48">
              <Image
                src="/images/buy-tokens/girl-left.webp"
                alt=""
                fill
                className="object-contain object-bottom"
                unoptimized
              />
            </div>
          </div>

          {/* Center column - Plans & Payment */}
          <div className="flex flex-col items-center">
            {/* Subscription plan cards */}
            <div className="mb-6 w-full max-w-sm space-y-3 sm:max-w-md">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={clsx(
                    "relative flex w-full items-center justify-between rounded-xl border-2 px-4 py-4 transition-all",
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted hover:border-primary/50",
                  )}
                >
                  {/* Best choice badge */}
                  {plan.isBestChoice && (
                    <span className="bg-destructive absolute -top-3 left-4 rounded px-2 py-0.5 text-xs font-bold text-white">
                      BEST CHOICE
                    </span>
                  )}

                  {/* Left side - Plan info */}
                  <div className="text-left">
                    <div className="text-foreground font-semibold">
                      {plan.label}
                    </div>
                    {plan.discountPercent && (
                      <div className="text-destructive text-xs font-medium">
                        {plan.discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  {/* Right side - Price */}
                  <div className="flex items-baseline gap-2">
                    {plan.originalPrice && (
                      <span className="text-muted-foreground text-sm line-through">
                        ${plan.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-foreground text-2xl font-bold">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Trust messages */}
            <div className="mb-6 w-full max-w-sm space-y-2 sm:max-w-md">
              <div className="text-primary flex items-center gap-2 text-sm">
                <Check className="size-4 shrink-0" />
                <span>No adult transaction in your bank statement</span>
              </div>
              <div className="text-primary flex items-center gap-2 text-sm">
                <Check className="size-4 shrink-0" />
                <span>No hidden fees • Cancel subscription at any time</span>
              </div>
            </div>

            {/* Payment buttons */}
            <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-md">
              <Button
                color="primary"
                onClick={handlePayWithCard}
                className="w-full items-center! py-3 text-sm font-semibold sm:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="sm:hidden">Pay with Card</span>
                  <span className="hidden sm:inline">
                    Pay with Credit / Debit Card
                  </span>
                  <span className="flex items-center gap-1">
                    <Image
                      src="/images/subscriptions/visa.svg"
                      alt="Visa"
                      width={32}
                      height={20}
                      className="h-4 w-auto rounded sm:h-5"
                      unoptimized
                    />
                    <Image
                      src="/images/subscriptions/mastercard.svg"
                      alt="Mastercard"
                      width={32}
                      height={20}
                      className="h-4 w-auto rounded sm:h-5"
                      unoptimized
                    />
                  </span>
                </span>
              </Button>

              <Button
                outline
                onClick={handlePayWithCrypto}
                loading={createCryptoCheckout.isPending}
                className="w-full items-center! py-3 text-sm font-semibold sm:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  Pay with Crypto
                  <span className="flex items-center gap-1">
                    <Image
                      src="/images/subscriptions/bitcoin.svg"
                      alt="Bitcoin"
                      width={20}
                      height={20}
                      className="size-4 rounded-full sm:size-5"
                      unoptimized
                    />
                    <Image
                      src="/images/subscriptions/ethereum.svg"
                      alt="Ethereum"
                      width={20}
                      height={20}
                      className="size-4 rounded-full sm:size-5"
                      unoptimized
                    />
                    <Image
                      src="/images/subscriptions/litecoin.svg"
                      alt="Litecoin"
                      width={20}
                      height={20}
                      className="size-4 rounded-full sm:size-5"
                      unoptimized
                    />
                  </span>
                </span>
              </Button>
            </div>

            {/* Annual price note */}
            {annualPlan && selectedPlan === "annually" && (
              <p className="text-muted-foreground mt-4 text-center text-xs">
                Annual payment billed as ${annualPlan.totalPrice.toFixed(2)}
              </p>
            )}

            {/* Trust badges */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-muted-foreground size-5" />
                <div className="text-left">
                  <div className="text-foreground text-xs font-medium">
                    Antivirus
                  </div>
                  <div className="text-muted-foreground text-xs">Secured</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="text-muted-foreground size-5" />
                <div className="text-left">
                  <div className="text-foreground text-xs font-medium">
                    Privacy in bank
                  </div>
                  <div className="text-muted-foreground text-xs">statement</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Benefits & Girl image (hidden on mobile) */}
          <div className="hidden flex-col items-center justify-end lg:flex">
            {/* Premium benefits */}
            <div className="mb-6 self-start">
              <h3 className="text-foreground mb-4 text-xl font-bold">
                Premium Benefits
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-primary flex items-center gap-2 text-sm"
                  >
                    <Check className="size-5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Girl image */}
            <div className="relative h-56 w-40 xl:h-64 xl:w-48">
              <Image
                src="/images/buy-tokens/girl-right.webp"
                alt=""
                fill
                className="object-contain object-bottom"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Mobile benefits section */}
        <div className="mt-8 lg:hidden">
          <h3 className="text-foreground mb-4 text-lg font-bold">
            Premium Benefits
          </h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="text-primary flex items-center gap-2 text-sm"
              >
                <Check className="size-4 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Auth dialog */}
      <DialogAuth
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        variant={authVariant}
        onVariantChange={setAuthVariant}
      />
    </div>
  );
};

export default SubscriptionPlansPage;
