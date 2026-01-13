import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";
import DashboardCharactersCreateUpdatePage from "@/app/_components/pages/DashboardCharactersCreateUpdatePage";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CharactersCreateUpdatePage({
  searchParams,
}: Props) {
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

  const params = await searchParams;
  const characterId = params.id;

  return <DashboardCharactersCreateUpdatePage id={characterId} />;
}
