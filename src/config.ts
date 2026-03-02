// Configuration file for the client application
import * as z from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_URL: z.string(),
});

const configValidation = configSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
});

if (!configValidation.success) {
  console.error(
    "❌ Invalid client environment variables:",
    configValidation.error,
  );
  throw new Error("Invalid client environment variables");
}

export const envClientConfig = configValidation.data;
