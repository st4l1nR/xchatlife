import { verifyAdmin } from "@/lib/dal";
import DashboardFinancialCategoriesPage from "@/app/_components/pages/DashboardFinancialCategoriesPage";

const Page = async () => {
  await verifyAdmin();

  return <DashboardFinancialCategoriesPage />;
};

export default Page;
