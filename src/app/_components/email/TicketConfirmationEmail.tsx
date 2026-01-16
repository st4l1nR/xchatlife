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

type TicketConfirmationEmailProps = {
  ticketId: string;
  subject: string;
  category: string;
  priority: string;
  userName?: string;
};

const TicketConfirmationEmail = ({
  ticketId,
  subject,
  category,
  priority,
  userName,
}: TicketConfirmationEmailProps) => {
  const previewText = `We received your support ticket - ${subject}`;

  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);
  const priorityDisplay = priority.charAt(0).toUpperCase() + priority.slice(1);

  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case "urgent":
        return "#dc2626";
      case "high":
        return "#ea580c";
      case "normal":
        return "#2563eb";
      case "low":
        return "#16a34a";
      default:
        return "#525252";
    }
  };

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
            We&apos;ve Received Your Ticket
            {userName ? `, ${userName}` : ""}!
          </Heading>

          <Text style={paragraph}>
            Thank you for reaching out. We&apos;ve received your support request
            and our team will review it shortly.
          </Text>

          <Section style={ticketSection}>
            <Text style={ticketLabel}>Ticket Reference</Text>
            <Text style={ticketIdValue}>
              #{ticketId.slice(-8).toUpperCase()}
            </Text>
          </Section>

          <Section style={detailsSection}>
            <Text style={detailRow}>
              <span style={detailLabel}>Subject:</span>{" "}
              <span style={detailValue}>{subject}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>Category:</span>{" "}
              <span style={detailValue}>{categoryDisplay}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>Priority:</span>{" "}
              <span
                style={{ ...detailValue, color: getPriorityColor(priority) }}
              >
                {priorityDisplay}
              </span>
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={subheading}>What Happens Next?</Text>

          <Text style={listItem}>
            1. Our support team will review your ticket within 24 hours
          </Text>
          <Text style={listItem}>
            2. You&apos;ll receive an email notification when we respond
          </Text>
          <Text style={listItem}>
            3. You can track your ticket status in your dashboard
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Please save your ticket reference number for future correspondence.
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

export default TicketConfirmationEmail;

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

const ticketSection = {
  backgroundColor: "#f3f0ff",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const ticketLabel = {
  color: "#7c3aed",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const ticketIdValue = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0",
  letterSpacing: "2px",
};

const detailsSection = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "24px 0",
};

const detailRow = {
  color: "#525252",
  fontSize: "14px",
  lineHeight: "28px",
  margin: "0",
};

const detailLabel = {
  color: "#6b7280",
  fontWeight: "500",
};

const detailValue = {
  color: "#1a1a1a",
  fontWeight: "600",
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
