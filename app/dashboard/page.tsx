import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  // kalau nanti ada dashboard user
  redirect("/");
}
