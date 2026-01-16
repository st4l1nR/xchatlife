import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";
import DashboardRelationshipsPage from "@/app/_components/pages/DashboardRelationshipsPage";

export default async function RelationshipsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch user role from database since better-auth session doesn't include it
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { customRole: { select: { name: true } } },
  });

  // Check for admin role
  const roleName = user?.customRole?.name?.toUpperCase();
  if (!roleName || (roleName !== "ADMIN" && roleName !== "SUPERADMIN")) {
    redirect("/dashboard");
  }

  return <DashboardRelationshipsPage />;
}
