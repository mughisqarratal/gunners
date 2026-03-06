"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        alert("User berhasil dihapus");
      } else {
        alert("Gagal menghapus user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingUser.name, email: editingUser.email }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
        setEditingUser(null);
        alert("User berhasil diperbarui");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {/* Tambah Header No */}
            <th className="border px-4 py-2 w-12">No</th>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {/* Kolom Nomor Urut */}
              <td className="border px-4 py-2 text-center font-bold">
                {index + 1}
              </td>
              <td className="border px-4 py-2 text-center font-bold">
                {user.id}
              </td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 text-center" style={{ textTransform: "capitalize" }}>
                {user.role}
              </td>
              <td className="border px-4 py-2 text-center">
                {isMounted 
                  ? new Date(user.createdAt).toLocaleString("id-ID") 
                  : "Loading..."}
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => setEditingUser(user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition cursor-pointer"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Edit tetap sama seperti sebelumnya */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}