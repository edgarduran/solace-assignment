// import { NextRequest, NextResponse } from "next/server";
// import { advocateData } from "../../../db/seed/advocates";
// import { advocates } from "../../../db/schema";
// import { advocatesData } from "./advocates";

// import { NextRequest, NextResponse } from "next/server";
// import db from "@/db";
// import { ilike, or, sql } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { advocates } from "../../../db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    const take = Number(req.nextUrl.searchParams.get("take") ?? 20);

    // If a search query exists, filter by it
    const whereClause = q
      ? or(
          ilike(advocates.firstName, `%${q}%`),
          ilike(advocates.lastName, `%${q}%`),
          ilike(advocates.city, `%${q}%`),
          ilike(advocates.degree, `%${q}%`)
        )
      : sql`true`;

    const rows = await db.select().from(advocates).where(whereClause).limit(take);

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("DB ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}


