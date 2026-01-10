"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Lock,
  Gem,
  Sparkles,
  ImageIcon,
  Video,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "../atoms/button";

// ============================================================================
// Feedback Controls Component
// ============================================================================

const FeedbackControls: React.FC = () => {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setFeedback(feedback === "like" ? null : "like")}
          className={clsx(
            "rounded p-1 transition-colors",
            feedback === "like"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="Like"
        >
          <ThumbsUp className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setFeedback(feedback === "dislike" ? null : "dislike")}
          className={clsx(
            "rounded p-1 transition-colors",
            feedback === "dislike"
              ? "text-destructive"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="Dislike"
        >
          <ThumbsDown className="size-3.5" />
        </button>
      </div>
      {feedback && (
        <button
          type="button"
          className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors"
        >
          Tell us more
        </button>
      )}
    </div>
  );
};

// ============================================================================
// Audio Waveform Animation Component
// ============================================================================

const AudioWaveform: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const bars = [
    { height: [40, 80, 40], delay: 0 },
    { height: [60, 30, 60], delay: 0.1 },
    { height: [30, 70, 30], delay: 0.2 },
    { height: [50, 40, 80, 50], delay: 0.15 },
  ];

  return (
    <div className="flex items-center justify-center gap-0.5">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className="w-0.5 rounded-full bg-current"
          initial={{ height: 4 }}
          animate={
            isPlaying
              ? {
                  height: bar.height.map((h) => (h / 100) * 12),
                }
              : { height: 4 }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: bar.delay,
                  ease: "easeInOut",
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
};

// ============================================================================
// Types
// ============================================================================

export type CardMessageVariant =
  | "text"
  | "video"
  | "image"
  | "private-content"
  | "unlocked-content";

export type CardMessageProps = {
  className?: string;
  id?: string;
  variant: CardMessageVariant;
  self?: boolean;
  timestamp?: string;

  // Text variant
  text?: string;
  audioSrc?: string;

  // Video variant
  videoSrc?: string;
  videoPosterSrc?: string;
  videoDuration?: string;

  // Image variant
  imageSrc?: string;
  imageAlt?: string;
  onCreateAIVideo?: () => void;
  onImageClick?: () => void;

  // Private content variant
  previewSrc?: string;
  tokenCost?: number;
  contentDescription?: string;
  imageCount?: number;
  videoCount?: number;
  onUnlock?: () => void;
  isUnlocking?: boolean;

  // Feedback controls
  feedbackControls?: boolean;
};

// ============================================================================
// Sub-components
// ============================================================================

const TextMessage: React.FC<{
  text: string;
  self: boolean;
  audioSrc?: string;
  timestamp?: string;
  feedbackControls?: boolean;
}> = ({ text, self, audioSrc, timestamp, feedbackControls }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Autoplay may be blocked
      });
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-1",
        self ? "items-end" : "items-start",
      )}
    >
      <div
        className={clsx(
          "max-w-[75%]",
          self
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
            : "bg-muted text-foreground rounded-2xl rounded-bl-sm",
        )}
      >
        <p className="px-4 py-3 text-sm leading-relaxed">{text}</p>
      </div>

      {/* Audio button, timestamp and feedback row */}
      <div
        className={clsx(
          "flex items-center gap-2",
          self ? "flex-row-reverse" : "flex-row",
        )}
      >
        {audioSrc && (
          <>
            <audio ref={audioRef} src={audioSrc} preload="metadata" />
            <button
              type="button"
              onClick={toggleAudio}
              className="bg-primary text-primary-foreground relative flex size-7 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? (
                <AudioWaveform isPlaying={isPlaying} />
              ) : (
                <Play className="size-3 translate-x-px" fill="currentColor" />
              )}
            </button>
          </>
        )}
        {timestamp && (
          <span className="text-muted-foreground text-xs">{timestamp}</span>
        )}
        {feedbackControls && <FeedbackControls />}
      </div>
    </div>
  );
};

const VideoMessage: React.FC<{
  videoSrc: string;
  posterSrc?: string;
  duration?: string;
  self: boolean;
  timestamp?: string;
  feedbackControls?: boolean;
}> = ({ videoSrc, posterSrc, duration, self, timestamp, feedbackControls }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {
        // Autoplay may be blocked
      });
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-1",
        self ? "items-end" : "items-start",
      )}
    >
      <div className="group bg-muted relative aspect-9/16 w-48 overflow-hidden rounded-2xl">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          playsInline
          className="absolute inset-0 size-full object-cover"
        />

        {/* Play/Pause overlay */}
        <button
          type="button"
          onClick={toggleVideo}
          className={clsx(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            isPlaying
              ? "bg-transparent opacity-0 group-hover:bg-black/20 group-hover:opacity-100"
              : "bg-black/20 opacity-100 hover:bg-black/30",
          )}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <div
            className={clsx(
              "flex size-14 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity",
              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100",
            )}
          >
            {isPlaying ? (
              <Pause className="size-6" />
            ) : (
              <Play className="size-6 translate-x-0.5" />
            )}
          </div>
        </button>

        {/* Duration badge */}
        {duration && !isPlaying && (
          <div className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            {duration}
          </div>
        )}

        {/* Progress bar */}
        {isPlaying && (
          <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/30">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Timestamp and feedback row */}
      <div className="flex items-center gap-2 px-1">
        {timestamp && (
          <span className="text-muted-foreground text-xs">{timestamp}</span>
        )}
        {feedbackControls && <FeedbackControls />}
      </div>
    </div>
  );
};

const ImageMessage: React.FC<{
  imageSrc: string;
  imageAlt?: string;
  self: boolean;
  timestamp?: string;
  onCreateAIVideo?: () => void;
  onImageClick?: () => void;
  feedbackControls?: boolean;
}> = ({
  imageSrc,
  imageAlt,
  self,
  timestamp,
  onCreateAIVideo,
  onImageClick,
  feedbackControls,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1",
        self ? "items-end" : "items-start",
      )}
    >
      <div className="bg-muted relative w-48 overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={onImageClick}
          className="block aspect-9/16 w-full cursor-pointer"
          aria-label="View full image"
        >
          <Image
            src={imageSrc}
            alt={imageAlt ?? "Image message"}
            fill
            sizes="192px"
            className="object-cover transition-transform hover:scale-105"
          />
        </button>

        {/* Create AI Video button */}
        {onCreateAIVideo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCreateAIVideo();
            }}
            className="absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <Sparkles className="size-3.5" />
            Create AI Video
          </button>
        )}
      </div>
      {/* Timestamp and feedback row */}
      <div className="flex items-center gap-2 px-1">
        {timestamp && (
          <span className="text-muted-foreground text-xs">{timestamp}</span>
        )}
        {feedbackControls && <FeedbackControls />}
      </div>
    </div>
  );
};

const PrivateContentMessage: React.FC<{
  previewSrc?: string;
  tokenCost?: number;
  contentDescription?: string;
  imageCount?: number;
  videoCount?: number;
  self: boolean;
  timestamp?: string;
  onUnlock?: () => void;
  isUnlocking?: boolean;
  feedbackControls?: boolean;
}> = ({
  previewSrc,
  tokenCost,
  contentDescription,
  imageCount,
  videoCount,
  self,
  timestamp,
  onUnlock,
  isUnlocking,
  feedbackControls,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1",
        self ? "items-end" : "items-start",
      )}
    >
      <div className="bg-muted relative w-48 overflow-hidden rounded-2xl">
        {/* Blurred preview */}
        <div className="aspect-9/16 w-full">
          {previewSrc && (
            <Image
              src={previewSrc}
              alt="Locked content preview"
              fill
              sizes="192px"
              className="object-cover blur-lg"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Media count badges */}
        <div className="absolute top-2 left-1/2 flex -translate-x-1/2 items-center gap-3">
          {imageCount !== undefined && imageCount > 0 && (
            <div className="flex items-center gap-1 text-xs font-medium text-white">
              <ImageIcon className="size-3.5" />
              {imageCount}
            </div>
          )}
          {videoCount !== undefined && videoCount > 0 && (
            <div className="flex items-center gap-1 text-xs font-medium text-white">
              <Video className="size-3.5" />
              {videoCount}
            </div>
          )}
        </div>

        {/* Lock icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex size-16 items-center justify-center rounded-full border-2 border-white/30 bg-black/30 backdrop-blur-sm">
            <Lock className="size-7 text-white" />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute right-0 bottom-0 left-0 flex flex-col items-center gap-2 p-3">
          {tokenCost !== undefined && (
            <div className="text-primary flex items-center gap-1.5 text-sm font-semibold">
              <Gem className="size-4" />
              {tokenCost} Tokens
            </div>
          )}

          {contentDescription && (
            <p className="text-center text-xs text-white/80">
              {contentDescription}
            </p>
          )}

          <Button
            color="primary"
            onClick={onUnlock}
            loading={isUnlocking}
            className="w-full"
          >
            <Gem data-slot="icon" className="size-4" />
            Unlock
          </Button>
        </div>
      </div>

      {/* Timestamp and feedback row */}
      <div className="flex items-center gap-2 px-1">
        {timestamp && (
          <span className="text-muted-foreground text-xs">{timestamp}</span>
        )}
        {feedbackControls && <FeedbackControls />}
      </div>
    </div>
  );
};

const UnlockedContentMessage: React.FC<{
  imageSrc?: string;
  imageAlt?: string;
  contentDescription?: string;
  imageCount?: number;
  videoCount?: number;
  self: boolean;
  timestamp?: string;
  onImageClick?: () => void;
  feedbackControls?: boolean;
}> = ({
  imageSrc,
  contentDescription,
  imageCount,
  videoCount,
  self,
  timestamp,
  onImageClick,
  feedbackControls,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1",
        self ? "items-end" : "items-start",
      )}
    >
      <div className="bg-muted relative w-48 overflow-hidden rounded-2xl">
        {/* Image */}
        <button
          type="button"
          onClick={onImageClick}
          className="block aspect-9/16 w-full cursor-pointer"
          aria-label="View full image"
        >
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="Unlocked content"
              fill
              sizes="192px"
              className="object-cover transition-transform hover:scale-105"
            />
          )}
        </button>

        {/* Bottom overlay with stats and description */}
        <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-3 pt-8">
          {/* Media count row */}
          <div className="mb-1 flex items-center gap-3">
            {imageCount !== undefined && imageCount > 0 && (
              <div className="flex items-center gap-1 text-xs font-medium text-white">
                <ImageIcon className="size-3.5" />
                {imageCount}
              </div>
            )}
            {videoCount !== undefined && videoCount > 0 && (
              <div className="flex items-center gap-1 text-xs font-medium text-white">
                <Video className="size-3.5" />
                {videoCount}
              </div>
            )}
          </div>

          {/* Description */}
          {contentDescription && (
            <p className="text-xs text-white/90">{contentDescription}</p>
          )}
        </div>
      </div>

      {/* Timestamp and feedback row */}
      <div className="flex items-center gap-2 px-1">
        {timestamp && (
          <span className="text-muted-foreground text-xs">{timestamp}</span>
        )}
        {feedbackControls && <FeedbackControls />}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const CardMessage: React.FC<CardMessageProps> = ({
  className,
  variant,
  self = false,
  timestamp,
  // Text variant
  text,
  audioSrc,
  // Video variant
  videoSrc,
  videoPosterSrc,
  videoDuration,
  // Image variant
  imageSrc,
  imageAlt,
  onCreateAIVideo,
  onImageClick,
  // Private content variant
  previewSrc,
  tokenCost,
  contentDescription,
  imageCount,
  videoCount,
  onUnlock,
  isUnlocking,
  // Feedback controls
  feedbackControls,
}) => {
  return (
    <div
      className={clsx(
        "flex w-full",
        self ? "justify-end" : "justify-start",
        className,
      )}
    >
      {variant === "text" && text && (
        <TextMessage
          text={text}
          self={self}
          audioSrc={audioSrc}
          timestamp={timestamp}
          feedbackControls={feedbackControls}
        />
      )}

      {variant === "video" && videoSrc && (
        <VideoMessage
          videoSrc={videoSrc}
          posterSrc={videoPosterSrc}
          duration={videoDuration}
          self={self}
          timestamp={timestamp}
          feedbackControls={feedbackControls}
        />
      )}

      {variant === "image" && imageSrc && (
        <ImageMessage
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          self={self}
          timestamp={timestamp}
          onCreateAIVideo={onCreateAIVideo}
          onImageClick={onImageClick}
          feedbackControls={feedbackControls}
        />
      )}

      {variant === "private-content" && (
        <PrivateContentMessage
          previewSrc={previewSrc}
          tokenCost={tokenCost}
          contentDescription={contentDescription}
          imageCount={imageCount}
          videoCount={videoCount}
          self={self}
          timestamp={timestamp}
          onUnlock={onUnlock}
          isUnlocking={isUnlocking}
          feedbackControls={feedbackControls}
        />
      )}

      {variant === "unlocked-content" && (
        <UnlockedContentMessage
          imageSrc={imageSrc}
          contentDescription={contentDescription}
          imageCount={imageCount}
          videoCount={videoCount}
          self={self}
          timestamp={timestamp}
          onImageClick={onImageClick}
          feedbackControls={feedbackControls}
        />
      )}
    </div>
  );
};

export default CardMessage;
