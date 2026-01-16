import { notFound } from "next/navigation";
import { verifyAdmin } from "@/lib/dal";
import DashboardAffiliatesIdPage from "@/app/_components/pages/DashboardAffiliatesIdPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  await verifyAdmin();

  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <DashboardAffiliatesIdPage affiliateId={id} />;
};

export default Page;
