"use client";

import { LayoutDashboard, Package, ClipboardList, LogOut, UserCircle } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useRouter } from "next/navigation";

export default function SupplierNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <a href="/supplier-dashboard" className="flex items-center gap-2">
        <Logo size={32} />
        <span className="text-lg font-bold text-gray-800">FabricHub Supplier</span>
      </a>

      <div className="flex items-center gap-6">
        <a href="/supplier-dashboard" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-600">
          <LayoutDashboard size={16} />
          Dashboard
        </a>
        <a href="/inventory" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-600">
          <Package size={16} />
          Inventory
        </a>
        <a href="/orders" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-600">
          <ClipboardList size={16} />
          Orders
        </a>
        <a href="/profile" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-600">
          <UserCircle size={16} />
          Profile
        </a>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}
