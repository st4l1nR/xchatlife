import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";
import DashboardCharactersPage from "@/app/_components/pages/DashboardCharactersPage";

export default async function CharactersPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/");
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

  return <DashboardCharactersPage />;
}
