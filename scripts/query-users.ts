import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      nickname: true,
      language: true,
      tokenBalance: true,
      createdAt: true,
    },
  });

  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
