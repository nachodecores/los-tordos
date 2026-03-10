"use client";

import Link from "next/link";
import Image from "next/image";
import logochico from "../../public/logos/logochico.svg";
import AdminUserMenu from "@/components/admin/AdminUserMenu";

export default function AdminHeader() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-coloryellow6 border-b border-gray-200">
      <Link href="/admin" className="flex items-center">
        <Image
          src={logochico}
          alt="Los Tordos"
          width={40}
          height={40}
          className="object-contain"
        />
      </Link>
      <AdminUserMenu nameOnMobile={true} vertical hideAvatar />
    </header>
  );
}
