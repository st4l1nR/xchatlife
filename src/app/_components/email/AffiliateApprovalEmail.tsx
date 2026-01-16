import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EMAIL_LOGO_URL } from "@/server/email/constants";

type AffiliateApprovalEmailProps = {
  referralCode: string;
  firstName?: string;
  commissionRate?: number;
};

const AffiliateApprovalEmail = ({
  referralCode,
  firstName,
  commissionRate = 0.4,
}: AffiliateApprovalEmailProps) => {
  const previewText = `Congratulations! Your affiliate application has been approved`;
  const commissionPercentage = Math.round(commissionRate * 100);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src={EMAIL_LOGO_URL}
              width="48"
              height="48"
              alt="XChatLife"
              style={logo}
            />
          </Section>

          <Heading style={heading}>
            Congratulations{firstName ? `, ${firstName}` : ""}!
          </Heading>

          <Text style={paragraph}>
            Your affiliate application has been <strong>approved</strong>.
            Welcome to the XChatLife Affiliate Program!
          </Text>

          <Section style={codeSection}>
            <Text style={codeLabel}>Your Referral Code</Text>
            <Text style={codeValue}>{referralCode}</Text>
          </Section>

          <Text style={paragraph}>
            Share this code with your audience to earn{" "}
            <strong>{commissionPercentage}% commission</strong> on all recurring
            subscriptions and token purchases made by users who sign up with
            your code.
          </Text>

          <Hr style={hr} />

          <Text style={subheading}>How to Get Started</Text>

          <Text style={listItem}>
            1. Share your referral code on your website, social media, or
            content
          </Text>
          <Text style={listItem}>
            2. When users sign up using your code, they become your referrals
          </Text>
          <Text style={listItem}>
            3. Earn {commissionPercentage}% commission on their purchases
          </Text>
          <Text style={listItem}>
            4. Track your earnings and referrals in your dashboard
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions, feel free to contact our support team.
          </Text>

          <Text style={footer}>
            <Link href="https://xchatlife.com" style={link}>
              XChatLife
            </Link>{" "}
            - Your AI Companion Platform
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AffiliateApprovalEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "8px",
  maxWidth: "480px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const logo = {
  margin: "0 auto",
  borderRadius: "8px",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const paragraph = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const codeSection = {
  backgroundColor: "#f3f0ff",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const codeLabel = {
  color: "#7c3aed",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const codeValue = {
  color: "#1a1a1a",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0",
  letterSpacing: "2px",
};

const subheading = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const listItem = {
  color: "#525252",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 8px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const link = {
  color: "#7c3aed",
  textDecoration: "underline",
};
