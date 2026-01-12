import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "@/env";
import { db } from "@/server/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "sqlite" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Find the CUSTOMER role and assign it to new users
          const customerRole = await db.role_custom.findUnique({
            where: { name: "CUSTOMER" },
          });

          if (customerRole) {
            await db.user.update({
              where: { id: user.id },
              data: { customRoleId: customerRole.id },
            });
          }
        },
      },
    },
  },
  socialProviders: {
    ...(env.BETTER_AUTH_GITHUB_CLIENT_ID &&
      env.BETTER_AUTH_GITHUB_CLIENT_SECRET && {
        github: {
          clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
          redirectURI: "http://localhost:3000/api/auth/callback/github",
        },
      }),
    ...(env.BETTER_AUTH_GOOGLE_CLIENT_ID &&
      env.BETTER_AUTH_GOOGLE_CLIENT_SECRET && {
        google: {
          clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
        },
      }),
    ...(env.BETTER_AUTH_DISCORD_CLIENT_ID &&
      env.BETTER_AUTH_DISCORD_CLIENT_SECRET && {
        discord: {
          clientId: env.BETTER_AUTH_DISCORD_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_DISCORD_CLIENT_SECRET,
        },
      }),
    ...(env.BETTER_AUTH_TWITTER_CLIENT_ID &&
      env.BETTER_AUTH_TWITTER_CLIENT_SECRET && {
        twitter: {
          clientId: env.BETTER_AUTH_TWITTER_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_TWITTER_CLIENT_SECRET,
        },
      }),
  },
});

export type Session = typeof auth.$Infer.Session;
