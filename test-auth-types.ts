import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
        enabled: true,
        password: {
            hash: async (password) => await bcrypt.hash(password, 10),
            verify: async ({ hash, password }) => await bcrypt.compare(password, hash)
        }
    }
});
