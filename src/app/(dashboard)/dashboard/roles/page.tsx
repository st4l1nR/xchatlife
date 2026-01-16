import { verifyAdmin } from "@/lib/dal";
import DashboardRolesPage from "@/app/_components/pages/DashboardRolesPage";

export default async function RolesPage() {
  await verifyAdmin();

  return <DashboardRolesPage />;
}
