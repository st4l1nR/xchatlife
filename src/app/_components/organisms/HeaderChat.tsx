import React from "react";
import clsx from "clsx";
import { Avatar } from "@/app/_components/atoms/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
} from "@/app/_components/atoms/dropdown";
import {
  LockKeyhole,
  Phone,
  MoreVertical,
  AlignJustify,
  Heart,
  RotateCcw,
  Trash2,
} from "lucide-react";

export type HeaderChatProps = {
  className?: string;
  name: string;
  avatarSrc?: string;
  onClickPrivateContent?: () => void;
  onCallClick?: () => void;
  onAddToFavorites?: () => void;
  onResetChat?: () => void;
  onDeleteChat?: () => void;
  onExpand?: () => void;
};

const HeaderChat: React.FC<HeaderChatProps> = ({
  className,
  name,
  avatarSrc,
  onClickPrivateContent,
  onCallClick,
  onAddToFavorites,
  onResetChat,
  onDeleteChat,
  onExpand,
}) => {
  return (
    <header
      className={clsx(
        "bg-background flex items-center justify-between px-4 py-3",
        className,
      )}
    >
      {/* Left section: Avatar and Name */}
      <div className="flex items-center gap-3">
        <Avatar
          src={avatarSrc}
          alt={name}
          className="h-12 w-12"
          initials={name.charAt(0).toUpperCase()}
        />
        <span className="text-foreground text-lg font-semibold">{name}</span>
      </div>

      {/* Right section: Action icons */}
      <div className="flex items-center gap-1">
        {/* Private Content Icon */}
        <button
          onClick={onClickPrivateContent}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          aria-label="View private content"
        >
          <LockKeyhole className="h-5 w-5" />
        </button>

        {/* Call Icon */}
        <button
          onClick={onCallClick}
          className="text-primary hover:bg-muted hover:text-primary/80 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          aria-label="Start call"
        >
          <Phone className="h-5 w-5" />
        </button>

        {/* More Options Dropdown */}
        <Dropdown>
          <DropdownButton
            as="div"
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </DropdownButton>
          <DropdownMenu anchor="bottom end">
            <DropdownItem onClick={onAddToFavorites}>
              <Heart data-slot="icon" />
              <DropdownLabel>Add to favorites</DropdownLabel>
            </DropdownItem>
            <DropdownItem onClick={onResetChat}>
              <RotateCcw data-slot="icon" />
              <DropdownLabel>Reset chat</DropdownLabel>
            </DropdownItem>
            <DropdownItem onClick={onDeleteChat}>
              <Trash2 data-slot="icon" />
              <DropdownLabel>Delete chat</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Expand Icon */}
        <button
          onClick={onExpand}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          aria-label="Expand"
        >
          <AlignJustify className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default HeaderChat;
