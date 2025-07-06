"use client";
import React from "react";
import { ProfileNav } from "@/components/layout/navs/ProfileNav";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCalendar, FiBook, FiUsers, FiLayers } from "react-icons/fi";
import { MdClass, MdCreditCard } from "react-icons/md";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: <FiHome size={20} /> },
  {
    label: "Evénements",
    href: "/events",
    icon: <FiCalendar size={20} />,
  },
  { label: "Classes", href: "/classes", icon: <MdClass size={20} /> },
  { label: "Matières", href: "/subjects", icon: <FiLayers size={20} /> },
  { label: "Filières", href: "/sectors", icon: <FiUsers size={20} /> },
  { label: "Cours", href: "/admin/courses", icon: <FiBook size={20} /> },
  { label: "Cartes", href: "/admin/cartes", icon: <MdCreditCard size={20} /> },
];

function SidebarMenu() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 mt-8 w-full">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium text-lg transition
            ${
              pathname === item.href
                ? "bg-[#eaf1fb] text-[#2563eb] font-semibold shadow"
                : "text-gray-700 hover:bg-[#f3f6fa] hover:text-[#2563eb]"
            }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="hidden md:flex h-screen bg-[#f6f9fb]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col items-center py-8 shadow-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <Image src="/logo.png" alt="Logo" width={200} height={200} />
          <span className="mt-2 text-xl font-bold tracking-wide text-[#2563eb] drop-shadow-sm">
            Admin
          </span>
        </div>
        {/* Séparateur */}
        <hr className="w-4/5 border-gray-200 my-1" />
        {/* Menu */}
        <SidebarMenu />
        <div className="flex-1" />
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-end px-8 shadow-sm">
          <ProfileNav />
        </header>
        {/* Page content */}
        <main className="flex-1 p-8 bg-[#f6f9fb] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
