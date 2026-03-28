import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_API_BASE_URL: z.string(),
    // Make secrets optional so the client doesn't crash, but they'll still be 
    // enforced on the server where process.env is populated.
    ACCESS_TOKEN_SECRET: z.string().optional(),
})

const result = envSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
})

if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment variables. Check your .env file.");
}

export const envVars = result.data;
