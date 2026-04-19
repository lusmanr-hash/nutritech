import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export async function GET() {
  try {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      return NextResponse.json({ error: "No TURSO_DATABASE_URL", env: Object.keys(process.env).filter(k => k.startsWith("TURSO")) });
    }

    const client = createClient({ url, authToken });
    const result = await client.execute("SELECT count(*) as count FROM Company");

    return NextResponse.json({
      ok: true,
      count: result.rows[0].count,
      url: url.substring(0, 30) + "..."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message });
  }
}
