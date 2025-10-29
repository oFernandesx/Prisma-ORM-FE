import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  adapter: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
});
