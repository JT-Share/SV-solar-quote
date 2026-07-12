import { NextResponse } from "next/server";
import { getSql, ensureTable } from "@/lib/db";

export const runtime = "nodejs";

// Load one quote's full data.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getSql();
  if (!sql) return NextResponse.json({ error: "database_not_configured" }, { status: 503 });
  const { id } = await params;
  try {
    await ensureTable(sql);
    const rows = await sql`SELECT id, client_name, data FROM quotes WHERE id = ${id}`;
    if (!rows.length) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// Delete one quote.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getSql();
  if (!sql) return NextResponse.json({ error: "database_not_configured" }, { status: 503 });
  const { id } = await params;
  try {
    await ensureTable(sql);
    await sql`DELETE FROM quotes WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
