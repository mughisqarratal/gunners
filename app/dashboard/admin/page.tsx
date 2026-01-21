import { db } from "@/lib/db"; // pastikan db.ts/connection sudah siap
import { cookies } from "next/headers";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  // 🔐 Hanya admin
  if (role !== "admin") {
    return <p className="text-red-500">Unauthorized</p>;
  }

  // Ambil data real user dari DB
  const [users] = await db.execute<any[]>("SELECT id, name, email, role, createdAt FROM user");

  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "admin").length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p className="text-gray-700 mb-6">Selamat datang di halaman admin.</p>

      {/* Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold">Total Users</h3>
          <p className="text-2xl mt-2">{totalUsers}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold">Total Admin</h3>
          <p className="text-2xl mt-2">{totalAdmins}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold">Status</h3>
          <p className="text-green-600 font-bold mt-2">Aktif</p>
        </div>
      </div>

      
    </div>
  );
}
