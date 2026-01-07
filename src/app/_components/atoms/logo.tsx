import { forwardRef, type ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Link } from "./link";

export type LogoProps = {
  /**
   * Whether to show the "TraduceHoy" text alongside the logo
   * @default true
   */
  withText?: boolean;
  /**
   * Optional href to make the logo clickable
   */
  href?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size variant for the logo
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: {
    image: "h-6 w-6",
    text: "text-lg",
    gap: "gap-2",
  },
  md: {
    image: "h-8 w-8",
    text: "text-xl",
    gap: "gap-2.5",
  },
  lg: {
    image: "h-12 w-12",
    text: "text-3xl",
    gap: "gap-3",
  },
};

export const Logo = forwardRef<
  HTMLDivElement,
  LogoProps & ComponentPropsWithoutRef<"div">
>(function Logo(
  { withText = true, href, className, size = "md", ...props },
  ref,
) {
  const sizeClass = sizeClasses[size];

  const content = (
    <div
      ref={ref}
      className={clsx(
        "inline-flex items-center",
        sizeClass.gap,
        href && "transition-opacity hover:opacity-80",
        className,
      )}
      {...props}
    >
      <Image
        src="/images/global/logo.png"
        alt="TraduceHoy Logo"
        width={48}
        height={48}
        className={clsx(sizeClass.image, "object-contain")}
        priority
      />
      {withText && (
        <span
          className={clsx(
            "text-foreground font-bold",
            sizeClass.text,
            "tracking-tight",
          )}
        >
          TraduceHoy
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
});

export default Logo;
