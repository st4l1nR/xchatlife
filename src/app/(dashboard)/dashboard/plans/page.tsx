import { verifyAdmin } from "@/lib/dal";
import DashboardPlansPage from "@/app/_components/pages/DashboardPlansPage";

const Page = async () => {
  await verifyAdmin();

  return <DashboardPlansPage />;
};

export default Page;
