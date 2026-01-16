import { verifyAdmin } from "@/lib/dal";
import DashboardTicketsPage from "@/app/_components/pages/DashboardTicketsPage";

const Page = async () => {
  await verifyAdmin();

  return <DashboardTicketsPage />;
};

export default Page;
