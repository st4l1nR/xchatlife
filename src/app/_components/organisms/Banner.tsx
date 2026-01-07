"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type BannerSlide = {
  id: string;
  imageSrc: string;
  alt: string;
  href?: string;
};

export type BannerProps = {
  slides: BannerSlide[];
  autoplayDelay?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  loop?: boolean;
  className?: string;
};

const Banner: React.FC<BannerProps> = ({
  slides,
  autoplayDelay = 5000,
  showNavigation = true,
  showPagination = true,
  loop = true,
  className,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  if (slides.length === 0) {
    return null;
  }

  const showControls = showNavigation && slides.length > 1;

  return (
    <div
      className={clsx("relative w-full overflow-hidden rounded-lg", className)}
    >
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        loop={loop && slides.length > 1}
        autoplay={
          autoplayDelay > 0
            ? { delay: autoplayDelay, disableOnInteraction: false }
            : false
        }
        pagination={
          showPagination && slides.length > 1
            ? {
                clickable: true,
                bulletClass: "swiper-pagination-bullet !bg-foreground/50",
                bulletActiveClass:
                  "swiper-pagination-bullet-active !bg-foreground",
              }
            : false
        }
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {slide.href ? (
              <Link href={slide.href} className="block">
                <div className="relative aspect-16/4 w-full">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.alt}
                    fill
                    className="object-contain"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </div>
              </Link>
            ) : (
              <div className="relative aspect-16/4 w-full">
                <Image
                  src={slide.imageSrc}
                  alt={slide.alt}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {showControls && (
        <>
          <button
            onClick={handlePrev}
            className="bg-background/80 text-foreground hover:bg-background absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full p-2 shadow-md transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="bg-background/80 text-foreground hover:bg-background absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full p-2 shadow-md transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default Banner;
