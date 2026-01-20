'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/users/logout", { method: "get", credentials: "include" });
    router.push("/login");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      Abhijay
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
