import { notFound } from "next/navigation";
import { verifyAdmin } from "@/lib/dal";
import DashboardTicketsIdPage from "@/app/_components/pages/DashboardTicketsIdPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  await verifyAdmin();
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <DashboardTicketsIdPage ticketId={id} />;
};

export default Page;
