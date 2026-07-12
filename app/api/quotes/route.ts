import { NextResponse } from "next/server";
import { getSql, ensureTable } from "@/lib/db";

export const runtime = "nodejs";

// List saved quotes (metadata only — no heavy data payload).
export async function GET() {
  const sql = getSql();
  if (!sql) return NextResponse.json({ error: "database_not_configured" }, { status: 503 });
  try {
    await ensureTable(sql);
    const rows = await sql`
      SELECT id, client_name, address, system_size, updated_at
      FROM quotes ORDER BY updated_at DESC LIMIT 500
    `;
    return NextResponse.json({ quotes: rows });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// Create or update a quote.
export async function POST(req: Request) {
  const sql = getSql();
  if (!sql) return NextResponse.json({ error: "database_not_configured" }, { status: 503 });
  try {
    await ensureTable(sql);
    const body = await req.json();
    const id: string = body.id || crypto.randomUUID();
    const clientName = String(body.clientName ?? "").slice(0, 200);
    const address = String(body.address ?? "").slice(0, 300);
    const systemSize = String(body.systemSize ?? "").slice(0, 50);
    const data = JSON.stringify(body.data ?? {});
    await sql`
      INSERT INTO quotes (id, client_name, address, system_size, data, updated_at)
      VALUES (${id}, ${clientName}, ${address}, ${systemSize}, ${data}::jsonb, now())
      ON CONFLICT (id) DO UPDATE SET
        client_name = EXCLUDED.client_name,
        address = EXCLUDED.address,
        system_size = EXCLUDED.system_size,
        data = EXCLUDED.data,
        updated_at = now()
    `;
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
