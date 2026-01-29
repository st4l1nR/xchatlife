import { notFound } from "next/navigation";
import VisualNovelEditorIdPage from "@/app/_components/pages/VisualNovelEditorIdPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <VisualNovelEditorIdPage visualNovelId={id} />;
};

export default Page;
