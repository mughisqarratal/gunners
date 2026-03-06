import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  return (await cookieStore).get("role")?.value === "admin";
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Gunakan nama tabel sesuai DB Hostinger kamu (User atau user)
    await db.execute("DELETE FROM User WHERE id = ?", [id]);
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { name, email } = await req.json();
    await db.execute("UPDATE User SET name = ?, email = ? WHERE id = ?", [name, email, id]);
    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}