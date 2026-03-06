import { db } from "@/lib/db";
import { cookies } from "next/headers";
import UserTable from "./UserTable";

export default async function UsersPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    return <p className="text-red-500 p-10 font-bold">Unauthorized: Akses Ditolak</p>;
  }

  // Ambil data user dari database (Pastikan nama tabel "User" sesuai dengan DB Hostinger kamu)
  const [users] = await db.execute<any[]>(
    "SELECT id, name, email, role, createdAt FROM User ORDER BY createdAt ASC"
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kelola User</h1>
      {/* Kita pindahkan tabel ke komponen terpisah agar bisa klik Edit/Hapus */}
      <UserTable initialUsers={users} />
    </div>
  );
}