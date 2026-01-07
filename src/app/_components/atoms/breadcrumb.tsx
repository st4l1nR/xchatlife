import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={clsx("mb-6 text-sm", className)}>
      <ol className="text-primary flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary/80 uppercase transition-colors"
                >
                  {item.label}
                </Link>
              ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="hover:text-primary/80 uppercase transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={clsx(
                    "uppercase",
                    item.isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
            {index < items.length - 1 && (
              <li className="text-muted-foreground">
                <ChevronRightIcon className="h-3 w-3" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
