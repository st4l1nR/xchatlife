import React from "react";
import clsx from "clsx";
import {
  User,
  Check,
  Mail,
  Globe,
  MessageCircle,
  Briefcase,
  XCircle,
} from "lucide-react";

export type AffiliateStatusType = "pending" | "approved" | "rejected";
export type AffiliateTypeValue =
  | "influencer"
  | "blogger"
  | "youtuber"
  | "social_media"
  | "website_owner"
  | "email_marketing"
  | "other";

export type AsideAffiliateSummaryProps = {
  className?: string;
  // About section
  name?: string | null;
  email?: string | null;
  type?: AffiliateTypeValue | null;
  status?: AffiliateStatusType | null;
  websiteUrl?: string | null;
  telegram?: string | null;
  // Application section
  introduction?: string | null;
  promotionalMethods?: string | null;
  rejectionReason?: string | null;
  // Stats section (only for approved)
  referralCode?: string | null;
  commissionRate?: number | null;
  totalEarned?: number | null;
  isActive?: boolean | null;
  appliedAt?: string | null;
  approvedAt?: string | null;
};

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
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

type StatItemProps = {
  label: string;
  value?: string | number | null;
};

const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  if (value === undefined || value === null) return null;
  return (
    <li className="flex items-center gap-3">
      <Check className="text-muted-foreground size-4" />
      <span className="text-foreground text-sm">{label}</span>
      <span className="text-muted-foreground ml-auto text-sm">{value}</span>
    </li>
  );
};

const affiliateTypeLabels: Record<AffiliateTypeValue, string> = {
  influencer: "Influencer",
  blogger: "Blogger",
  youtuber: "YouTuber",
  social_media: "Social Media",
  website_owner: "Website Owner",
  email_marketing: "Email Marketing",
  other: "Other",
};

const statusColors: Record<AffiliateStatusType, string> = {
  pending: "text-amber-500",
  approved: "text-green-500",
  rejected: "text-red-500",
};

const statusLabels: Record<AffiliateStatusType, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const AsideAffiliateSummary: React.FC<AsideAffiliateSummaryProps> = ({
  className,
  name,
  email,
  type,
  status,
  websiteUrl,
  telegram,
  introduction,
  promotionalMethods,
  rejectionReason,
  referralCode,
  commissionRate,
  totalEarned,
  isActive,
  appliedAt,
  approvedAt,
}) => {
  const hasAboutData =
    name || email || type || status || websiteUrl || telegram;
  const hasApplicationData =
    introduction || promotionalMethods || rejectionReason;
  const hasStatsData =
    referralCode ||
    commissionRate !== undefined ||
    totalEarned !== undefined ||
    isActive !== undefined ||
    appliedAt ||
    approvedAt;

  return (
    <aside className={clsx("space-y-4", className)}>
      {/* About Card */}
      {hasAboutData && (
        <div className="bg-muted space-y-4 rounded-lg p-4">
          <section>
            <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              About
            </h3>
            <ul className="space-y-3">
              <InfoItem
                icon={<User className="size-4" />}
                label="Name"
                value={name}
              />
              <InfoItem
                icon={<Mail className="size-4" />}
                label="Email"
                value={email}
              />
              <InfoItem
                icon={<Briefcase className="size-4" />}
                label="Type"
                value={type ? affiliateTypeLabels[type] : undefined}
              />
              {status && (
                <li className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    <Check className="size-4" />
                  </span>
                  <span className="text-muted-foreground text-sm">Status:</span>
                  <span
                    className={clsx(
                      "text-sm font-medium",
                      statusColors[status],
                    )}
                  >
                    {statusLabels[status]}
                  </span>
                </li>
              )}
              <InfoItem
                icon={<Globe className="size-4" />}
                label="Website"
                value={websiteUrl}
              />
              <InfoItem
                icon={<MessageCircle className="size-4" />}
                label="Telegram"
                value={telegram}
              />
            </ul>
          </section>
        </div>
      )}

      {/* Application Details Card */}
      {hasApplicationData && (
        <div className="bg-muted space-y-4 rounded-lg p-4">
          <section>
            <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              Application Details
            </h3>
            <div className="space-y-4">
              {introduction && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs uppercase">
                    Introduction
                  </p>
                  <p className="text-foreground text-sm">{introduction}</p>
                </div>
              )}
              {promotionalMethods && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs uppercase">
                    Promotional Methods
                  </p>
                  <p className="text-foreground text-sm">
                    {promotionalMethods}
                  </p>
                </div>
              )}
              {rejectionReason && (
                <div>
                  <p className="mb-1 flex items-center gap-1 text-xs text-red-500 uppercase">
                    <XCircle className="size-3" />
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-400">{rejectionReason}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Stats Card (only for approved affiliates) */}
      {hasStatsData && (
        <div className="bg-muted rounded-lg p-4">
          <section>
            <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              Affiliate Stats
            </h3>
            <ul className="space-y-3">
              <StatItem label="Referral Code" value={referralCode} />
              <StatItem
                label="Commission Rate"
                value={
                  commissionRate !== null && commissionRate !== undefined
                    ? `${(commissionRate * 100).toFixed(0)}%`
                    : undefined
                }
              />
              <StatItem
                label="Total Earned"
                value={
                  totalEarned != null ? `$${totalEarned.toFixed(2)}` : undefined
                }
              />
              {isActive != null && (
                <li className="flex items-center gap-3">
                  <Check className="text-muted-foreground size-4" />
                  <span className="text-foreground text-sm">Active Status</span>
                  <span
                    className={clsx(
                      "ml-auto text-sm font-medium",
                      isActive ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </li>
              )}
              <StatItem label="Applied" value={appliedAt} />
              <StatItem label="Approved" value={approvedAt} />
            </ul>
          </section>
        </div>
      )}
    </aside>
  );
};

export default AsideAffiliateSummary;
