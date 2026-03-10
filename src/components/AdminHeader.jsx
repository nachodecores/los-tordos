"use client";

import Link from "next/link";
import Image from "next/image";
import logochicoamarillo from "../../public/logos/logochicoamarillo.svg";
import AdminUserMenu from "@/components/admin/AdminUserMenu";

export default function AdminHeader() {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <Link href="/admin" className="flex items-center">
        <Image
          src={logochicoamarillo}
          alt="Los Tordos"
          width={40}
          height={40}
          className="object-contain"
        />
      </Link>
      <AdminUserMenu nameOnMobile={false} />
    </header>
  );
}
