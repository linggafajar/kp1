'use client';

import { AppSidebar } from "@/components/adminpage";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminPenggunaPage from "@/components/pengelolaanpengguna";

export default function AdminPengguna() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar className="w-64" />

        {/* Konten utama */}
        <main className="flex-1 p-6 bg-gray-50">
          <AdminPenggunaPage />
        </main>
      </div>
    </SidebarProvider>
  );
}
