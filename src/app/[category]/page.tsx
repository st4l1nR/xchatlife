import { notFound } from "next/navigation";
import HomePage from "@/app/_components/pages/HomePage";

const VALID_CATEGORIES = [
  "realistic-girl",
  "anime-girl",
  "realistic-men",
  "realistic-trans",
] as const;

type Category = (typeof VALID_CATEGORIES)[number];

type CategoryParams = { category: string };
type SearchParams = { invite?: string };

// Parse category into style and gender
function parseCategory(category: Category) {
  const map: Record<
    Category,
    { style: "realistic" | "anime"; gender: "girl" | "men" | "trans" }
  > = {
    "realistic-girl": { style: "realistic", gender: "girl" },
    "anime-girl": { style: "anime", gender: "girl" },
    "realistic-men": { style: "realistic", gender: "men" },
    "realistic-trans": { style: "realistic", gender: "trans" },
  };
  return map[category];
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<CategoryParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await params;
  const { invite: inviteToken } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const { style, gender } = parseCategory(category as Category);

  return <HomePage style={style} gender={gender} inviteToken={inviteToken} />;
}
