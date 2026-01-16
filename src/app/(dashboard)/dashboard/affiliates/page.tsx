import { verifyAdmin } from "@/lib/dal";
import DashboardAffiliatesPage from "@/app/_components/pages/DashboardAffiliatesPage";

const Page = async () => {
  await verifyAdmin();

  return <DashboardAffiliatesPage />;
};

export default Page;
