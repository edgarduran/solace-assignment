import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import { advocates } from "./schema.js";
import { advocateData } from "./seed/advocates.js";

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS advocates (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        city TEXT NOT NULL,
        degree TEXT NOT NULL,
        payload JSONB DEFAULT '[]'::jsonb NOT NULL,
        years_of_experience INTEGER NOT NULL,
        phone_number BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Seeding advocates...");
    await db.delete(advocates);
    await db.insert(advocates).values(advocateData);

    console.log("Seeding completed successfully.");
  } catch (err) {
    console.error("Failed to run migration:", err);
  } finally {
    await client.end();
  }
}

runMigration();
