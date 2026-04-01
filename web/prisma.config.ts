import "dotenv/config";
import { defineConfig } from "prisma/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL nao definida. Configure .env ou .env.local");
}

export default defineConfig({});
