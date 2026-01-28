"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Crown } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../atoms/button";
import CardTokenPackage from "../molecules/CardTokenPackage";
import DialogAuth, { type DialogAuthVariant } from "../organisms/DialogAuth";
import { useApp } from "@/app/_contexts/AppContext";
import { api } from "@/trpc/react";

// Package IDs must match the backend TOKEN_PACKAGES in coinremitterService.ts
const TOKEN_PACKAGES = [
  { id: "pack_100", tokens: 100, price: 9.99, bonusPercent: null },
  { id: "pack_350", tokens: 350, price: 34.99, bonusPercent: null },
  { id: "pack_550", tokens: 550, price: 49.99, bonusPercent: 10 },
  { id: "pack_1150", tokens: 1150, price: 99.99, bonusPercent: 15 },
  { id: "pack_2400", tokens: 2400, price: 199.99, bonusPercent: 20 },
  { id: "pack_3750", tokens: 3750, price: 299.99, bonusPercent: 25 },
] as const;

const TOKEN_BENEFITS = [
  "Create AI Girlfriend(s)",
  "AI Image generation",
  "Voice messages",
] as const;

const BuyTokensPage: React.FC = () => {
  const { isAuthenticated, isAuthLoading } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<string>("pack_550");

  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  // Get subscription status - only query if authenticated
  const { data: subscriptionData, isLoading: isSubscriptionLoading } =
    api.subscription.getStatus.useQuery(undefined, {
      enabled: isAuthenticated,
    });

  const hasActiveSubscription = subscriptionData?.data?.status === "active";

  // tRPC mutation for crypto checkout
  const createCheckout = api.subscription.createTokenCheckout.useMutation({
    onSuccess: (result) => {
      // Redirect to NOWPayments payment page
      window.location.href = result.data.paymentUrl;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const handlePayWithCard = () => {
    // TODO: Implement card payment flow (Stripe, etc.)
    toast.error("Card payments coming soon!");
  };

  const handlePayWithCrypto = () => {
    // Wait for auth to load
    if (isAuthLoading || isSubscriptionLoading) return;

    // Check auth first
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    // Check subscription status
    if (!hasActiveSubscription) {
      toast.error("You need an active subscription to buy tokens");
      return;
    }

    // Create checkout session
    createCheckout.mutate({ packageId: selectedPackage });
  };

  return (
    <div className="bg-background min-h-screen px-4 py-8 md:px-6 lg:px-8">
      {/* Title - centered on all screens */}
      <h1 className="text-foreground mb-8 text-center text-2xl font-bold lg:mb-12 lg:text-3xl">
        Buy Tokens
      </h1>

      {/* Main content - 3 column layout on desktop */}
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* Left column - Girl image & discount text (hidden on mobile) */}
          <div className="hidden flex-col items-center justify-end lg:flex">
            {/* Promotional text */}
            <div className="mb-6 text-left">
              <h3 className="text-xl leading-tight font-bold xl:text-2xl">
                <span className="text-primary">Get An Exclusive</span>
                <br />
                <span className="text-primary">Package Discount</span>
                <br />
                <span className="text-primary">Only Now!</span>
              </h3>
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

          {/* Center column - Packages & Payment */}
          <div className="flex flex-col items-center">
            {/* Token packages grid - 2x3 */}
            <div className="mb-6 grid w-full max-w-sm grid-cols-2 gap-3 sm:max-w-md sm:gap-4">
              {TOKEN_PACKAGES.map((pkg) => (
                <CardTokenPackage
                  key={pkg.id}
                  tokens={pkg.tokens}
                  price={pkg.price}
                  bonusPercent={pkg.bonusPercent}
                  isSelected={selectedPackage === pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                />
              ))}
            </div>

            {/* Payment buttons */}
            <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-md">
              {/* Show subscription required message if not subscribed */}
              {isAuthenticated &&
                !isSubscriptionLoading &&
                !hasActiveSubscription && (
                  <div className="bg-muted border-border mb-2 rounded-lg border p-4 text-center">
                    <div className="text-muted-foreground mb-2 flex items-center justify-center gap-2 text-sm">
                      <Crown className="text-primary size-5" />
                      <span>Subscription required to buy tokens</span>
                    </div>
                    <Link href="/premium">
                      <Button color="primary" className="w-full">
                        Get Premium
                      </Button>
                    </Link>
                  </div>
                )}

              <Button
                color="primary"
                onClick={handlePayWithCard}
                disabled={isAuthenticated && !hasActiveSubscription}
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
                loading={createCheckout.isPending}
                disabled={isAuthenticated && !hasActiveSubscription}
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
          </div>

          {/* Right column - Benefits & Girl image (hidden on mobile) */}
          <div className="hidden flex-col items-center justify-end lg:flex">
            {/* Token benefits */}
            <div className="mb-6 self-start">
              <h3 className="text-foreground mb-4 text-xl font-bold">
                Token Benefits
              </h3>
              <ul className="space-y-3">
                {TOKEN_BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-primary flex items-center gap-2 text-sm"
                  >
                    <Check className="text-primary size-5 shrink-0" />
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
            Token Benefits
          </h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TOKEN_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="text-primary flex items-center gap-2 text-sm"
              >
                <Check className="text-primary size-4 shrink-0" />
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

export default BuyTokensPage;
