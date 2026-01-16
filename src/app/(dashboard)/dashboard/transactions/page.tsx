import { verifyAdmin } from "@/lib/dal";
import DashboardFinancialTransactionsPage from "@/app/_components/pages/DashboardFinancialTransactionsPage";

const Page = async () => {
  await verifyAdmin();

  return <DashboardFinancialTransactionsPage />;
};

export default Page;
