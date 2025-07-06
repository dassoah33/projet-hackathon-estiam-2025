import React from "react";
import { MainNav } from "@/components/layout/navs/MainNav";
import { ProfileNav } from "@/components/layout/navs/ProfileNav";
import Image from "next/image";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Tailwind Mobile Responsive
    // components not changes with pages put here
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 relative">
          {/* Logo à gauche */}
          <div className="absolute left-10 mt-2">
            <Image src="/logo.png" alt="Logo" width={150} height={150} />
          </div>
          {/* Menu centré */}
          <div className="mx-auto">
            <MainNav />
          </div>
          {/* Icône à droite */}
          <div className="absolute right-10 flex items-center space-x-4">
            <ProfileNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </div>
  );
}

export default AdminLayout;
