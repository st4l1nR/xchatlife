import {
  Body,
  Button,
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

type InvitationEmailProps = {
  inviteLink: string;
  email: string;
  role: string;
  invitedBy?: string;
};

const InvitationEmail = ({
  inviteLink,
  email,
  role,
  invitedBy,
}: InvitationEmailProps) => {
  const previewText = `You've been invited to join XChatLife`;

  const roleDisplay =
    role === "superadmin"
      ? "Super Admin"
      : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://xchatlife.com/images/logo.png"
              width="48"
              height="48"
              alt="XChatLife"
              style={logo}
            />
          </Section>

          <Heading style={heading}>You&apos;re Invited!</Heading>

          <Text style={paragraph}>
            {invitedBy
              ? `${invitedBy} has invited you to join XChatLife.`
              : "You've been invited to join XChatLife."}
          </Text>

          <Text style={paragraph}>
            An account will be created for <strong>{email}</strong> with{" "}
            <strong>{roleDisplay}</strong> privileges.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={inviteLink}>
              Accept Invitation
            </Button>
          </Section>

          <Text style={paragraph}>
            Click the button above to create your account and get started.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you didn&apos;t expect this invitation, you can safely ignore
            this email.
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

export default InvitationEmail;

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

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#7c3aed",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
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
