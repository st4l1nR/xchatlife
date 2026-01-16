/**
 * Script to send test emails with mock data
 *
 * Usage:
 *   pnpm email:test
 *
 * This script allows you to send test emails to preview how they
 * appear in real email clients like Gmail.
 */

// Skip env validation before importing anything else
import * as dotenv from "dotenv";
dotenv.config();
process.env.SKIP_ENV_VALIDATION = "true";

import { checkbox, input, confirm } from "@inquirer/prompts";
import { Resend } from "resend";

const { RESEND_API_KEY } = process.env;
const EMAIL_FROM = "contact@createqr-ai.com";

// Validate Resend API key
if (!RESEND_API_KEY) {
  console.error("❌ Missing RESEND_API_KEY in environment variables");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// Sleep helper to avoid rate limits
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // Dynamic imports after env is set
  const { default: TicketConfirmationEmail } =
    await import("@/app/_components/email/TicketConfirmationEmail");
  const { default: InvitationEmail } =
    await import("@/app/_components/email/InvitationEmail");
  const { default: AffiliateApprovalEmail } =
    await import("@/app/_components/email/AffiliateApprovalEmail");

  // Email templates with mock data
  const EMAIL_TEMPLATES = [
    {
      id: "ticket-confirmation",
      name: "Ticket Confirmation",
      description: "Sent when a user creates a support ticket",
      subject: "We've received your support ticket - Cannot access my account",
      component: TicketConfirmationEmail({
        ticketId: "cm5abc123xyz789def",
        subject: "Cannot access my account settings",
        category: "account",
        priority: "normal",
        userName: "John",
      }),
    },
    {
      id: "ticket-urgent",
      name: "Ticket Confirmation (Urgent)",
      description: "Urgent priority ticket confirmation",
      subject: "We've received your support ticket - Payment failed",
      component: TicketConfirmationEmail({
        ticketId: "cm5urgent456abc",
        subject: "Payment failed but subscription cancelled",
        category: "billing",
        priority: "urgent",
        userName: "Sarah",
      }),
    },
    {
      id: "invitation",
      name: "User Invitation",
      description: "Sent when inviting a new user to the platform",
      subject: "You've been invited to join XChatLife",
      component: InvitationEmail({
        inviteLink: "https://xchatlife.com/invite/abc123",
        email: "newuser@example.com",
        role: "admin",
        invitedBy: "John Smith",
      }),
    },
    {
      id: "invitation-superadmin",
      name: "User Invitation (Super Admin)",
      description: "Invitation for super admin role",
      subject: "You've been invited to join XChatLife",
      component: InvitationEmail({
        inviteLink: "https://xchatlife.com/invite/xyz789",
        email: "superadmin@example.com",
        role: "superadmin",
        invitedBy: "CEO",
      }),
    },
    {
      id: "affiliate-approval",
      name: "Affiliate Approval",
      description: "Sent when an affiliate application is approved",
      subject: "Your Affiliate Application Has Been Approved!",
      component: AffiliateApprovalEmail({
        referralCode: "JOHN2024",
        firstName: "John",
        commissionRate: 0.4,
      }),
    },
    {
      id: "affiliate-approval-no-name",
      name: "Affiliate Approval (No Name)",
      description: "Affiliate approval without first name",
      subject: "Your Affiliate Application Has Been Approved!",
      component: AffiliateApprovalEmail({
        referralCode: "PARTNER50",
        commissionRate: 0.5,
      }),
    },
  ];

  async function sendEmail(
    to: string,
    template: (typeof EMAIL_TEMPLATES)[0],
  ): Promise<boolean> {
    try {
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: `[TEST] ${template.subject}`,
        react: template.component,
      });

      if (error) {
        console.error(`  ❌ Failed: ${error.message}`);
        return false;
      }

      console.log(`  ✅ Sent successfully`);
      return true;
    } catch (err) {
      console.error(`  ❌ Error: ${err}`);
      return false;
    }
  }

  console.log("");
  console.log("═".repeat(60));
  console.log("  📧 XChatLife Email Template Tester");
  console.log("═".repeat(60));
  console.log("");

  // Get recipient email
  const recipientEmail = await input({
    message: "Enter the email address to send test emails to:",
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      return true;
    },
  });

  console.log("");

  // Select templates to send
  const selectedTemplates = await checkbox({
    message: "Select email templates to send:",
    choices: EMAIL_TEMPLATES.map((template) => ({
      name: `${template.name} - ${template.description}`,
      value: template.id,
      checked: false,
    })),
    validate: (selected) => {
      if (selected.length === 0) {
        return "Please select at least one template";
      }
      return true;
    },
  });

  const templatesToSend = EMAIL_TEMPLATES.filter((t) =>
    selectedTemplates.includes(t.id),
  );

  console.log("");
  console.log(`📋 Selected ${templatesToSend.length} template(s):`);
  templatesToSend.forEach((t) => console.log(`   • ${t.name}`));
  console.log("");

  // Confirm before sending
  const shouldSend = await confirm({
    message: `Send ${templatesToSend.length} test email(s) to ${recipientEmail}?`,
    default: true,
  });

  if (!shouldSend) {
    console.log("");
    console.log("❌ Cancelled");
    process.exit(0);
  }

  console.log("");
  console.log("─".repeat(60));
  console.log("Sending emails...");
  console.log("─".repeat(60));
  console.log("");

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < templatesToSend.length; i++) {
    const template = templatesToSend[i]!;
    console.log(`📨 ${template.name}...`);
    const success = await sendEmail(recipientEmail, template);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Wait 600ms between emails to avoid rate limit (2 req/sec)
    if (i < templatesToSend.length - 1) {
      await sleep(600);
    }
  }

  console.log("");
  console.log("═".repeat(60));
  console.log("  Summary");
  console.log("═".repeat(60));
  console.log(`  ✅ Sent: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  📬 Recipient: ${recipientEmail}`);
  console.log("");

  if (successCount > 0) {
    console.log("💡 Check your inbox (and spam folder) for test emails.");
    console.log(
      "   Subject lines are prefixed with [TEST] for easy identification.",
    );
  }

  console.log("");
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
