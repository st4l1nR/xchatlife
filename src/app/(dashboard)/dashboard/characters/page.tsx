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
    select: { role: true },
  });

  // Check for admin role
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard");
  }

  return <DashboardCharactersPage />;
}
