"use client";

import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";
import AdminShell from "@/components/admin/AdminShell";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className={montserrat.className}>{children}</div>;
  }

  return (
    <div className={montserrat.className}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
