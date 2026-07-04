import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        password: {
            hash: async (password) => {
                const bcrypt = require("bcrypt");
                return await bcrypt.hash(password, 10);
            },
            verify: async ({ hash, password }) => {
                const bcrypt = require("bcrypt");
                return await bcrypt.compare(password, hash);
            }
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "EMPLOYEE"
            },
            companyId: {
                type: "string",
                required: false
            }
        }
    }
});
