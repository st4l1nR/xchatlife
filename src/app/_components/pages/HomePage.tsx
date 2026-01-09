"use client";

import React from "react";
import clsx from "clsx";
import Banner from "../organisms/Banner";
import ListBubbleStory from "../organisms/ListBubbleStory";
import ListCardCharacter from "../organisms/ListCardCharacter";
import type { BannerSlide } from "../organisms/Banner";
import type { StoryProfile } from "../organisms/ListCardStory";
import type { CardCharacterProps } from "../molecules/CardCharacter";
import { api } from "@/trpc/react";

export type HomePageMockData = {
  bannerSlides: BannerSlide[];
  stories: StoryProfile[];
  liveCharacters: CardCharacterProps[];
  aiCharacters: CardCharacterProps[];
};

export type HomePageProps = {
  className?: string;
  /**
   * Character style filter
   */
  style?: "realistic" | "anime";
  /**
   * Character gender filter
   */
  gender?: "girl" | "men" | "trans";
  /**
   * Optional mock data for Storybook and development
   * When provided, uses mock data instead of fetching from API
   */
  mock?: HomePageMockData;
};

// Default mock data for development and Storybook
export const defaultMockData: HomePageMockData = {
  bannerSlides: [
    {
      id: "1",
      imageSrc: "/images/banner-1.jpg",
      alt: "New Year's Sale 70% Off",
      href: "/premium",
    },
    {
      id: "2",
      imageSrc: "/images/banner-2.jpg",
      alt: "Live Action - Available on Luna",
      href: "/live-action",
    },
    {
      id: "3",
      imageSrc: "/images/banner-3.jpg",
      alt: "Create your own AI Girlfriend",
      href: "/create",
    },
  ],
  stories: [
    {
      id: "olivia",
      name: "Olivia",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "2 hours ago",
      media: [
        {
          id: "olivia-1",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 3,
        },
        { id: "olivia-2", type: "video", src: "/videos/girl-video.mp4" },
      ],
    },
    {
      id: "katarina",
      name: "Katarina",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "5 hours ago",
      media: [
        {
          id: "katarina-1",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 3,
        },
      ],
    },
    {
      id: "luna",
      name: "Luna",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "8 hours ago",
      media: [
        { id: "luna-1", type: "video", src: "/videos/girl-video.mp4" },
        {
          id: "luna-2",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 3,
        },
      ],
    },
    {
      id: "luna-2",
      name: "Luna",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "12 hours ago",
      media: [
        {
          id: "luna-2-1",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 3,
        },
      ],
    },
    {
      id: "chiara",
      name: "Chiara",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "1 day ago",
      media: [{ id: "chiara-1", type: "video", src: "/videos/girl-video.mp4" }],
    },
    {
      id: "hanna",
      name: "Hanna",
      avatarSrc: "/images/girl-poster.webp",
      timestamp: "2 days ago",
      media: [
        {
          id: "hanna-1",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 3,
        },
        {
          id: "hanna-2",
          type: "image",
          src: "/images/girl-poster.webp",
          duration: 3,
        },
        { id: "hanna-3", type: "video", src: "/videos/girl-video.mp4" },
      ],
    },
  ],
  liveCharacters: [
    {
      name: "Olivia",
      age: 28,
      href: "/chat/olivia",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      isLive: true,
      playWithMeHref: "/play/olivia",
    },
    {
      name: "Katarina",
      age: 23,
      href: "/chat/katarina",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      isLive: true,
      playWithMeHref: "/play/katarina",
    },
    {
      name: "Luna",
      age: 23,
      href: "/chat/luna",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      isLive: true,
      playWithMeHref: "/play/luna",
    },
    {
      name: "Luna",
      age: 23,
      href: "/chat/luna-2",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      isLive: true,
      playWithMeHref: "/play/luna-2",
    },
    {
      name: "Mia",
      age: 25,
      href: "/chat/mia-live",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      isLive: true,
      playWithMeHref: "/play/mia",
    },
  ],
  aiCharacters: [
    {
      name: "Lina",
      age: 22,
      href: "/chat/lina",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "This is why I left Hawaii! I won't bother right. I hope to have fun but this is a...",
      isNew: true,
    },
    {
      name: "Amelia",
      age: 25,
      href: "/chat/amelia",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Moved from Atlanta to Jersey, getting with her husband, she repeatedly...",
    },
    {
      name: "Diana",
      age: 27,
      href: "/chat/diana",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Your flight has been cancelled, I have a new job for you in Seattle this private flight by...",
    },
    {
      name: "Amber",
      age: 35,
      href: "/chat/amber",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "That awkward girl next door - someone who's funny with you like an woman...",
    },
    {
      name: "Lexi",
      age: 24,
      href: "/chat/lexi",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "You're a bounty hunter who's trying to find the guy who stole stuff from her...",
    },
    {
      name: "Harriet",
      age: 30,
      href: "/chat/harriet",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "That friend from yesterday. She lives down the street and keeps asking me...",
    },
    {
      name: "Sofia",
      age: 26,
      href: "/chat/sofia",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "A mysterious artist who paints portraits of strangers she meets...",
    },
    {
      name: "Emma",
      age: 21,
      href: "/chat/emma",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "College student by day, aspiring DJ by night. Living her best life...",
      isNew: true,
    },
    {
      name: "Mia",
      age: 28,
      href: "/chat/mia",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Professional photographer with a passion for capturing urban landscapes...",
    },
    {
      name: "Ava",
      age: 24,
      href: "/chat/ava",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Yoga instructor who believes in the power of mindfulness and connection...",
    },
    {
      name: "Isabella",
      age: 29,
      href: "/chat/isabella",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Chef at a high-end restaurant, always experimenting with new flavors...",
    },
    {
      name: "Charlotte",
      age: 23,
      href: "/chat/charlotte",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Bookworm who runs a cozy little bookshop in the heart of the city...",
      isNew: true,
    },
    {
      name: "Harper",
      age: 27,
      href: "/chat/harper",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Travel blogger documenting her adventures around the world...",
    },
    {
      name: "Evelyn",
      age: 31,
      href: "/chat/evelyn",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Architect with a vision for sustainable and beautiful spaces...",
    },
    {
      name: "Aria",
      age: 22,
      href: "/chat/aria",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Music student who plays three instruments and dreams of performing...",
    },
    {
      name: "Chloe",
      age: 26,
      href: "/chat/chloe",
      imageSrc: "/images/girl-poster.webp",
      videoSrc: "/videos/girl-video.mp4",
      description:
        "Fashion designer creating bold and unique pieces for modern women...",
    },
  ],
};

const HomePage: React.FC<HomePageProps> = ({
  className,
  style,
  gender,
  mock,
}) => {
  // Fetch AI characters with infinite scroll pagination
  const {
    data: aiCharactersData,
    isLoading: isLoadingAi,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.character.getInfinite.useInfiniteQuery(
    { limit: 16, style, gender },
    {
      enabled: !mock,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { data: liveCharacters, isLoading: isLoadingLive } =
    api.character.getLive.useQuery(
      { style, gender },
      {
        enabled: !mock,
      },
    );

  const { data: stories, isLoading: isLoadingStories } =
    api.story.getAll.useQuery(
      { style, gender },
      {
        enabled: !mock,
      },
    );

  // Flatten paginated AI characters into single array
  const aiCharacters =
    aiCharactersData?.pages.flatMap((page) => page.items) ?? [];

  // Use mock data if provided, otherwise use API data with fallback to empty arrays
  const data: HomePageMockData = mock ?? {
    bannerSlides: defaultMockData.bannerSlides, // Banner slides are static for now
    stories: stories ?? [],
    liveCharacters: liveCharacters ?? [],
    aiCharacters: aiCharacters,
  };

  return (
    <div className={clsx("space-y-8 pb-10", className)}>
      {/* Banner Carousel - no padding, no rounded corners */}
      <Banner slides={data.bannerSlides} className="mt-4 rounded-none" />

      {/* Stories Section */}
      <div className="px-4 md:px-6">
        <ListBubbleStory
          layout="swiper"
          profiles={data.stories}
          loading={isLoadingStories && !mock}
        />
      </div>

      {/* Jump into Live Action Section */}
      <section className="px-4 md:px-6">
        <h2 className="text-foreground mb-4 flex flex-wrap items-center gap-2 text-xl font-bold md:text-2xl">
          <span className="italic">Jump into</span>
          <span className="rounded-md border border-orange-500 px-2 py-0.5 text-sm font-semibold text-orange-500">
            LIVE
          </span>
          <span className="rounded-md border border-amber-500 px-2 py-0.5 text-sm font-semibold text-amber-500">
            ACTION
          </span>
          <span className="text-muted-foreground ml-1 rounded-full border px-2 py-0.5 text-xs font-normal">
            BETA
          </span>
        </h2>
        <ListCardCharacter
          items={data.liveCharacters}
          layout="swiper"
          loading={isLoadingLive && !mock}
        />
      </section>

      {/* AI Girlfriend Characters Section */}
      <section className="px-4 md:px-6">
        <h2 className="text-foreground mb-4 text-xl font-bold md:text-2xl">
          <span className="from-primary bg-gradient-to-r to-orange-400 bg-clip-text text-transparent">
            AI Girlfriend
          </span>{" "}
          Characters
        </h2>
        <ListCardCharacter
          items={data.aiCharacters}
          layout="grid"
          loading={isLoadingAi && !mock}
          hasNextPage={!mock && hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </section>
    </div>
  );
};

export default HomePage;
