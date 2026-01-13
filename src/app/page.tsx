import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const params = await searchParams;
  const target = params.invite
    ? `/realistic-girl?invite=${params.invite}`
    : "/realistic-girl";
  redirect(target);
}
