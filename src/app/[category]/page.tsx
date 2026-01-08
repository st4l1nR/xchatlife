import { notFound } from "next/navigation";
import HomePage from "@/app/_components/pages/HomePage";

const VALID_CATEGORIES = [
  "realistic-girl",
  "anime-girl",
  "realistic-men",
] as const;

type Category = (typeof VALID_CATEGORIES)[number];

type CategoryParams = { category: string };

// Parse category into style and gender
function parseCategory(category: Category) {
  const map: Record<
    Category,
    { style: "realistic" | "anime"; gender: "girl" | "men" }
  > = {
    "realistic-girl": { style: "realistic", gender: "girl" },
    "anime-girl": { style: "anime", gender: "girl" },
    "realistic-men": { style: "realistic", gender: "men" },
  };
  return map[category];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<CategoryParams>;
}) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const { style, gender } = parseCategory(category as Category);

  return <HomePage style={style} gender={gender} />;
}
