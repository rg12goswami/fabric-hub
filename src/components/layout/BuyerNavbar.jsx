"use client";

import { ShoppingCart, LayoutDashboard, Store, LogOut } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useRouter } from "next/navigation";

export default function BuyerNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <a href="/marketplace" className="flex items-center gap-2">
        <Logo size={32} />
        <span className="text-lg font-bold text-gray-800">FabricHub</span>
      </a>

      <div className="flex items-center gap-6">
        <a href="/marketplace" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600">
          <Store size={16} />
          Marketplace
        </a>
        <a href="/cart" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600">
          <ShoppingCart size={16} />
          Cart
        </a>
        <a href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600">
          <LayoutDashboard size={16} />
          Dashboard
        </a>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}
