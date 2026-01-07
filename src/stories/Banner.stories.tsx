import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Banner from "@/app/_components/organisms/Banner";
import type { BannerSlide } from "@/app/_components/organisms/Banner";

const defaultSlides: BannerSlide[] = [
  {
    id: "1",
    imageSrc: "/images/banner-1.jpg",
    alt: "New Year's Sale 70% Off",
    href: "/signup",
  },
  {
    id: "2",
    imageSrc: "/images/banner-2.jpg",
    alt: "Live Action - Take control now",
    href: "/live-action",
  },
  {
    id: "3",
    imageSrc: "/images/banner-3.jpg",
    alt: "Create your own AI Girlfriend",
    href: "/create",
  },
];

const slidesWithoutLinks: BannerSlide[] = [
  {
    id: "1",
    imageSrc: "/images/banner-1.jpg",
    alt: "New Year's Sale 70% Off",
  },
  {
    id: "2",
    imageSrc: "/images/banner-2.jpg",
    alt: "Live Action - Take control now",
  },
  {
    id: "3",
    imageSrc: "/images/banner-3.jpg",
    alt: "Create your own AI Girlfriend",
  },
];

const meta = {
  title: "Organisms/Banner",
  component: Banner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    slides: {
      control: "object",
      description: "Array of banner slide objects",
    },
    autoplayDelay: {
      control: { type: "number", min: 0, max: 20000, step: 1000 },
      description: "Autoplay delay in milliseconds (0 to disable)",
    },
    showNavigation: {
      control: "boolean",
      description: "Show prev/next navigation arrows",
    },
    showPagination: {
      control: "boolean",
      description: "Show pagination dots",
    },
    loop: {
      control: "boolean",
      description: "Enable infinite loop",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default - Basic banner with all 3 slides, clickable links, 5s autoplay
export const Default: Story = {
  args: {
    slides: defaultSlides,
    autoplayDelay: 5000,
    showNavigation: true,
    showPagination: true,
    loop: true,
  },
};

// 2. WithoutLinks - Display-only banners (no click navigation)
export const WithoutLinks: Story = {
  args: {
    slides: slidesWithoutLinks,
    autoplayDelay: 5000,
    showNavigation: true,
    showPagination: true,
    loop: true,
  },
};

// 3. WithoutAutoplay - Manual navigation only (autoplay disabled)
export const WithoutAutoplay: Story = {
  args: {
    slides: defaultSlides,
    autoplayDelay: 0,
    showNavigation: true,
    showPagination: true,
    loop: true,
  },
};

// 4. SlowAutoplay - 10 second autoplay delay
export const SlowAutoplay: Story = {
  args: {
    slides: defaultSlides,
    autoplayDelay: 10000,
    showNavigation: true,
    showPagination: true,
    loop: true,
  },
};

// 5. FastAutoplay - 3 second autoplay delay
export const FastAutoplay: Story = {
  args: {
    slides: defaultSlides,
    autoplayDelay: 3000,
    showNavigation: true,
    showPagination: true,
    loop: true,
  },
};

// 6. SingleSlide - Single banner (no navigation needed)
export const SingleSlide: Story = {
  args: {
    slides: [defaultSlides[0]!],
    autoplayDelay: 0,
    showNavigation: true,
    showPagination: true,
    loop: false,
  },
};

// 7. WithoutNavigation - Hides prev/next buttons, pagination only
export const WithoutNavigation: Story = {
  args: {
    slides: defaultSlides,
    autoplayDelay: 5000,
    showNavigation: false,
    showPagination: true,
    loop: true,
  },
};

// 8. WithoutPagination - Hides dots, navigation arrows only
export const WithoutPagination: Story = {
  args: {
    slides: defaultSlides,
    autoplayDelay: 5000,
    showNavigation: true,
    showPagination: false,
    loop: true,
  },
};

// 9. FullScreen - Full viewport width variant
export const FullScreen: Story = {
  args: {
    slides: defaultSlides,
    autoplayDelay: 5000,
    showNavigation: true,
    showPagination: true,
    loop: true,
    className: "rounded-none",
  },
  parameters: {
    layout: "fullscreen",
  },
};
