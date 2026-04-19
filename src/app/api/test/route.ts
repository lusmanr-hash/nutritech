import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      return NextResponse.json({ error: "No TURSO_DATABASE_URL" });
    }

    const httpUrl = url.replace("libsql://", "https://");

    // Test raw HTTP request to Turso
    const response = await fetch(`${httpUrl}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql: "SELECT count(*) as count FROM Company" } },
          { type: "close" },
        ],
      }),
    });

    const text = await response.text();
    return NextResponse.json({
      status: response.status,
      url: httpUrl.substring(0, 40) + "...",
      tokenLength: authToken?.length,
      response: text.substring(0, 500),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message });
  }
}
