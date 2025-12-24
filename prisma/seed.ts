import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import {
  audienceData,
  effectData,
  formData,
  ingredientData,
} from "./seed-data";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  for (const u of formData) {
    await prisma.form.create({ data: u });
  }
  for (const u of effectData) {
    await prisma.effect.create({ data: u });
  }
  for (const u of ingredientData) {
    await prisma.ingredient.create({ data: u });
  }
  for (const u of audienceData) {
    await prisma.audience.create({ data: u });
  }
}

main();
