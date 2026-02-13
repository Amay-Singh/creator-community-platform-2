"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { ToastProvider } from "@/components/ui/toast";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <TopNav />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main className="ml-64 flex-1 p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
