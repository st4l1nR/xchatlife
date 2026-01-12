import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import TemplateDashboard from "@/app/_components/templates/TemplateDashboard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <TemplateDashboard>{children}</TemplateDashboard>;
}
