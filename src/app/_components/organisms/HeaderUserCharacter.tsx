import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { Users, MapPin, Calendar } from "lucide-react";
import { Avatar } from "../atoms/avatar";

export type HeaderUserCharacterProps = {
  className?: string;
  name: string;
  avatarSrc?: string | null;
  role?: string;
  location?: string;
  joinedDate?: string;
  bannerSrc?: string;
};

const HeaderUserCharacter: React.FC<HeaderUserCharacterProps> = ({
  className,
  name,
  avatarSrc,
  role,
  location,
  joinedDate,
  bannerSrc,
}) => {
  return (
    <div className={clsx("bg-card overflow-hidden rounded-2xl", className)}>
      {/* Banner Image */}
      <div className="relative h-40 sm:h-48">
        <Image
          src={bannerSrc ?? "/images/dashboard/generic-banner.png"}
          alt="Profile banner"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* User Info Section */}
      <div className="relative px-4 pt-14 pb-4 sm:px-6 sm:pt-16 sm:pb-6">
        {/* Avatar - positioned absolutely to overlap */}
        <div className="absolute -top-12 left-4 sm:-top-14 sm:left-6">
          <div className="rounded-full bg-violet-500 p-1">
            <Avatar
              src={avatarSrc}
              alt={name}
              initials={name.charAt(0).toUpperCase()}
              className="border-card size-22 border-3 sm:size-26"
            />
          </div>
        </div>

        {/* User Details */}
        <div className="ml-28 sm:ml-32">
          <h2 className="text-foreground text-xl font-semibold">{name}</h2>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {role && (
              <span className="flex items-center gap-1.5">
                <Users className="size-4" />
                {role}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {location}
              </span>
            )}
            {joinedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                Joined {joinedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderUserCharacter;
