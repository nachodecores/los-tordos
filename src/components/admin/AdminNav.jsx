"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PanelIcon from "./PanelIcon";

export default function AdminNav({ items }) {
  const pathname = usePathname();
  return <nav className="panel-nav" aria-label="Navegación del panel">
    {items.map((item) => {
      const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
      return <Link key={item.href} href={item.href} className={active ? "is-current" : ""} aria-current={active ? "page" : undefined}>
        <PanelIcon name={item.icon} /><span>{item.label}</span>
      </Link>;
    })}
  </nav>;
}
