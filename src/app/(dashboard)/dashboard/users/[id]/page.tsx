import { notFound } from "next/navigation";
import DashboardUsersIdPage from "@/app/_components/pages/DashboardUsersIdPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <DashboardUsersIdPage userId={id} />;
};

export default Page;
