"use client";

import { useSession } from "next-auth/react";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";

export default function AdminShell({ children }) {
  const { data: session } = useSession();
  const showNav = session?.user?.rol === "admin";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <AdminNav />
      <main
        className={`flex-1 flex flex-col pt-24 md:pt-0 ${showNav ? "md:pl-56 pb-24 md:pb-0" : ""}`}
      >
        <AdminHeader />
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
