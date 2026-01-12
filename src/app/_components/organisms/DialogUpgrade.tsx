"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { X, Check } from "lucide-react";
import * as Headless from "@headlessui/react";
import { Button } from "../atoms/button";

const PRICING_PLANS = [
  {
    id: "annual",
    duration: "12 months",
    discount: "70% OFF",
    originalPrice: 12.99,
    price: 3.99,
    isBestChoice: true,
    totalBilled: 47.88,
  },
  {
    id: "quarterly",
    duration: "3 months",
    discount: "40% OFF",
    originalPrice: 12.99,
    price: 7.99,
    isBestChoice: false,
  },
  {
    id: "monthly",
    duration: "1 month",
    discount: null,
    originalPrice: null,
    price: 12.99,
    isBestChoice: false,
  },
] as const;

const PREMIUM_BENEFITS = [
  "Create your own AI Girlfriend(s)",
  "Unlimited text messages",
  "Get 100 FREE tokens / month",
  "Remove image blur",
  "Generate images",
  "Make AI phone calls",
  "Fast response time",
];

export type DialogUpgradeProps = {
  open: boolean;
  onClose: () => void;
};

const DialogUpgrade: React.FC<DialogUpgradeProps> = ({ open, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("annual");

  const handlePayWithCard = () => {
    // TODO: Implement payment flow
    console.log("Pay with card:", selectedPlan);
  };

  const handlePayWithCrypto = () => {
    // TODO: Implement crypto payment flow
    console.log("Pay with crypto:", selectedPlan);
  };

  return (
    <Headless.Dialog open={open} onClose={onClose}>
      <Headless.DialogBackdrop
        transition
        className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm transition duration-200 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Headless.DialogPanel
            transition
            className="bg-background ring-border relative w-full max-w-6xl rounded-2xl p-6 shadow-2xl ring-1 transition duration-200 data-closed:scale-95 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in lg:p-8"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground absolute top-4 right-4 z-10 transition-colors"
            >
              <X className="size-6" />
            </button>

            {/* Main content - 3 column layout on desktop */}
            <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr]">
              {/* Left column - Girl image & discount text (hidden on mobile) */}
              <div className="hidden flex-col items-center justify-end lg:flex">
                <div className="mb-4 text-center">
                  <h3 className="text-2xl font-bold">
                    <span className="text-primary">Get An Exclusive</span>
                    <br />
                    <span className="text-primary">Discount Only Today!</span>
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Up to{" "}
                    <span className="text-primary font-semibold">70% off</span>{" "}
                    for first subscription
                  </p>
                </div>
                <div className="relative h-80 w-48">
                  <Image
                    src="/images/subscriptions/girl-left.png"
                    alt=""
                    fill
                    className="object-contain object-bottom"
                    unoptimized
                  />
                </div>
              </div>

              {/* Center column - Pricing */}
              <div className="flex flex-col items-center">
                {/* Title */}
                <Headless.DialogTitle className="text-foreground mb-2 text-center text-2xl font-bold lg:text-3xl">
                  Choose your Plan
                </Headless.DialogTitle>
                <p className="text-muted-foreground mb-6 text-center text-sm">
                  100% anonymous. You can cancel anytime.
                </p>

                {/* Pricing cards */}
                <div className="mb-6 flex w-full max-w-md flex-col gap-3">
                  {PRICING_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={clsx(
                        "relative flex items-center justify-between rounded-lg border-2 px-4 py-3 transition-all",
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted hover:border-primary/50",
                      )}
                    >
                      {/* Best choice badge */}
                      {plan.isBestChoice && (
                        <span className="bg-primary text-primary-foreground absolute -top-2.5 left-4 rounded px-2 py-0.5 text-xs font-bold uppercase">
                          Best Choice
                        </span>
                      )}

                      {/* Left side - duration & discount */}
                      <div className="text-left">
                        <span className="text-foreground block text-xs font-semibold sm:text-sm">
                          {plan.duration}
                        </span>
                        {plan.discount && (
                          <span className="text-primary block text-[10px] font-medium sm:text-xs">
                            {plan.discount}
                          </span>
                        )}
                      </div>

                      {/* Right side - price */}
                      <div className="flex items-baseline gap-1 sm:gap-2">
                        {plan.originalPrice && (
                          <span className="text-muted-foreground hidden text-xs line-through sm:inline sm:text-sm">
                            ${plan.originalPrice}
                          </span>
                        )}
                        <span className="text-foreground text-xl font-bold sm:text-2xl">
                          ${plan.price.toFixed(2).split(".")[0]}
                          <span className="text-sm sm:text-base">
                            .{plan.price.toFixed(2).split(".")[1]}
                          </span>
                        </span>
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          /month
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="mb-6 space-y-2 text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Check className="text-primary size-4 shrink-0" />
                    <span>No adult transaction in your bank statement</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Check className="text-primary size-4 shrink-0" />
                    <span>
                      No hidden fees • Cancel subscription at any time
                    </span>
                  </div>
                </div>

                {/* Payment buttons */}
                <div className="flex w-full max-w-md flex-col gap-3">
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
                    className="w-full items-center! py-3 text-sm font-semibold sm:text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Pay with
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

                {/* Annual billing note */}
                {selectedPlan === "annual" && (
                  <p className="text-muted-foreground mt-4 text-center text-sm">
                    Annual payment billed as $47.88
                  </p>
                )}
              </div>

              {/* Right column - Benefits & Girl image (hidden on mobile) */}
              <div className="hidden flex-col items-center justify-between lg:flex">
                {/* Premium benefits */}
                <div className="mb-4">
                  <h3 className="text-foreground mb-4 text-xl font-bold">
                    Premium Benefits
                  </h3>
                  <ul className="space-y-3">
                    {PREMIUM_BENEFITS.map((benefit) => (
                      <li
                        key={benefit}
                        className="text-foreground flex items-center gap-2 text-sm"
                      >
                        <Check className="text-primary size-5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Girl image */}
                <div className="relative h-64 w-48">
                  <Image
                    src="/images/subscriptions/girl-right.png"
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
                {PREMIUM_BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-foreground flex items-center gap-2 text-sm"
                  >
                    <Check className="text-primary size-4 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  );
};

export default DialogUpgrade;
