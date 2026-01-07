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
