import {
  Home,
  Compass,
  MessageCircle,
  FolderHeart,
  ImagePlus,
  UserPlus,
  Heart,
  Crown,
  Sparkles,
  Gift,
  Coins,
} from "lucide-react";

export type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

export const mainNavigation: NavigationItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageCircle,
  },
  {
    name: "Collection",
    href: "/collection",
    icon: FolderHeart,
  },
  {
    name: "Generate Image",
    href: "/generate-image",
    icon: ImagePlus,
  },
  {
    name: "Create Character",
    href: "/create-character",
    icon: UserPlus,
  },
  {
    name: "My AI",
    href: "/my-ai",
    icon: Heart,
  },
];

export const accountNavigation: NavigationItem[] = [
  {
    name: "Premium",
    href: "/premium",
    icon: Crown,
    badge: "70% OFF",
  },
];

export const mobileNavigation: NavigationItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    name: "Create",
    href: "/create-character",
    icon: Sparkles,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageCircle,
  },
  {
    name: "Premium",
    href: "/premium",
    icon: Crown,
  },
];

// Token Economics
export type TokenPricingItem = {
  label: string;
  cost: string | number;
  color: "green" | "blue" | "purple" | "orange" | "red" | "yellow";
};

export const tokenPricing: TokenPricingItem[] = [
  { label: "Voice cost", cost: "0.2", color: "green" },
  { label: "Image cost V1", cost: 2, color: "blue" },
  { label: "Image cost V2", cost: 4, color: "purple" },
  { label: "Call cost", cost: "3/min", color: "orange" },
];

// Token navigation (shown when user has active subscription)
export const tokenNavigation: NavigationItem[] = [
  {
    name: "Earn 200 tokens",
    href: "/earn-tokens",
    icon: Gift,
  },
  {
    name: "Buy Tokens",
    href: "/buy-tokens",
    icon: Coins,
  },
];
