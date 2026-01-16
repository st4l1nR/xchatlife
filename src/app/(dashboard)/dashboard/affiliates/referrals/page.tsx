import { verifyAdmin } from "@/lib/dal";
import DashboardReferralsPage from "@/app/_components/pages/DashboardReferralsPage";

const Page = async () => {
  await verifyAdmin();

  return <DashboardReferralsPage />;
};

export default Page;
