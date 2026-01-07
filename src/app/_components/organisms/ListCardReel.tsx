"use client";

import React, { useState, useRef } from "react";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import CardReel from "../molecules/CardReel";
import type { CardReelProps } from "../molecules/CardReel";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";

// ============================================================================
// Types
// ============================================================================

export type ListCardReelProps = {
  className?: string;
  loading: boolean;
  items: CardReelProps[];
  isLoggedIn: boolean;
  onAuthRequired?: () => void;
};

// ============================================================================
// Component
// ============================================================================

const ListCardReel: React.FC<ListCardReelProps> = ({
  className,
  loading,
  items,
  isLoggedIn,
  onAuthRequired,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <WrapperLoader loading={loading} totalDocs={items.length}>
      {/* Content - TikTok-style vertical scroll with Swiper */}
      <div
        className={clsx("relative h-full w-full overflow-hidden", className)}
      >
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={8}
          speed={400}
          threshold={20}
          resistanceRatio={0}
          followFinger={false}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.5,
            thresholdDelta: 100,
            thresholdTime: 500,
          }}
          touchRatio={1}
          shortSwipes={false}
          longSwipesRatio={0.3}
          longSwipesMs={100}
          modules={[Mousewheel]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          className="h-full w-full"
          style={{ overflow: "hidden" }}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id ?? index} style={{ height: "100%" }}>
              <div className="flex h-full w-full items-center justify-center p-2">
                <CardReel
                  {...item}
                  isLoggedIn={isLoggedIn}
                  onAuthRequired={onAuthRequired}
                  className={clsx(
                    "max-h-full",
                    index !== currentIndex && "pointer-events-none",
                  )}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation dots */}
        {items.length > 1 && (
          <div className="absolute top-1/2 right-2 z-10 flex -translate-y-1/2 flex-col gap-1">
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => swiperRef.current?.slideTo(index)}
                className={clsx(
                  "h-2 w-2 rounded-full transition-all duration-200",
                  index === currentIndex
                    ? "scale-125 bg-white"
                    : "bg-white/40 hover:bg-white/60",
                )}
                aria-label={`Go to reel ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      <div className="bg-muted flex h-full w-full animate-pulse items-center justify-center rounded-2xl">
        <div className="text-muted-foreground">Loading...</div>
      </div>

      {/* Empty state */}
      <CardEmptyState title="No reels" description="No reels available yet" />
    </WrapperLoader>
  );
};

export default ListCardReel;
