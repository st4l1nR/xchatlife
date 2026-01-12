import React from "react";
import clsx from "clsx";
import { User, Check, Crown, Flag, Languages, Phone, Mail } from "lucide-react";

export type AsideUserSummaryProps = {
  className?: string;
  // About section
  fullName?: string;
  status?: "Active" | "Inactive" | "Suspended";
  role?: string;
  country?: string;
  language?: string;
  // Contacts section
  phone?: string;
  email?: string;
  // Overview section
  messagesSent?: number | string;
  charactersCreated?: number | string;
  visualNovels?: number | string;
  collectionItems?: number | string;
  tokensUsed?: number | string;
  memberSince?: string | number;
};

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
};

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <li className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground text-sm">{label}:</span>
      <span className="text-foreground text-sm">{value}</span>
    </li>
  );
};

type OverviewItemProps = {
  label: string;
  value?: string | number;
};

const OverviewItem: React.FC<OverviewItemProps> = ({ label, value }) => {
  if (value === undefined || value === null) return null;
  return (
    <li className="flex items-center gap-3">
      <Check className="text-muted-foreground size-4" />
      <span className="text-foreground text-sm">{label}</span>
      <span className="text-muted-foreground ml-auto text-sm">{value}</span>
    </li>
  );
};

const AsideUserSummary: React.FC<AsideUserSummaryProps> = ({
  className,
  fullName,
  status,
  role,
  country,
  language,
  phone,
  email,
  messagesSent,
  charactersCreated,
  visualNovels,
  collectionItems,
  tokensUsed,
  memberSince,
}) => {
  const hasAboutData = fullName || status || role || country || language;
  const hasContactsData = phone || email;
  const hasOverviewData =
    messagesSent !== undefined ||
    charactersCreated !== undefined ||
    visualNovels !== undefined ||
    collectionItems !== undefined ||
    tokensUsed !== undefined ||
    memberSince !== undefined;

  return (
    <aside className={clsx("space-y-4", className)}>
      {/* About & Contacts Card */}
      {(hasAboutData || hasContactsData) && (
        <div className="bg-muted space-y-4 rounded-lg p-4">
          {/* ABOUT section */}
          {hasAboutData && (
            <section>
              <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
                About
              </h3>
              <ul className="space-y-3">
                <InfoItem
                  icon={<User className="size-4" />}
                  label="Full Name"
                  value={fullName}
                />
                <InfoItem
                  icon={<Check className="size-4" />}
                  label="Status"
                  value={status}
                />
                <InfoItem
                  icon={<Crown className="size-4" />}
                  label="Role"
                  value={role}
                />
                <InfoItem
                  icon={<Flag className="size-4" />}
                  label="Country"
                  value={country}
                />
                <InfoItem
                  icon={<Languages className="size-4" />}
                  label="Language"
                  value={language}
                />
              </ul>
            </section>
          )}

          {/* CONTACTS section */}
          {hasContactsData && (
            <section>
              <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
                Contacts
              </h3>
              <ul className="space-y-3">
                <InfoItem
                  icon={<Phone className="size-4" />}
                  label="Contact"
                  value={phone}
                />
                <InfoItem
                  icon={<Mail className="size-4" />}
                  label="Email"
                  value={email}
                />
              </ul>
            </section>
          )}
        </div>
      )}

      {/* Overview Card */}
      {hasOverviewData && (
        <div className="bg-muted rounded-lg p-4">
          <section>
            <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              Overview
            </h3>
            <ul className="space-y-3">
              <OverviewItem label="Messages sent" value={messagesSent} />
              <OverviewItem
                label="Characters created"
                value={charactersCreated}
              />
              <OverviewItem label="Visual novels" value={visualNovels} />
              <OverviewItem label="Collection items" value={collectionItems} />
              <OverviewItem
                label="Tokens used this period"
                value={tokensUsed}
              />
              <OverviewItem label="Member since" value={memberSince} />
            </ul>
          </section>
        </div>
      )}
    </aside>
  );
};

export default AsideUserSummary;
