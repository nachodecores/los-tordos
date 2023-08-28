import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between px-6 py-4">
      <h3>
        <Link href="/">Los Tordos</Link>
      </h3>
      <ul className="flex [&>li]:mx-2">
        <li>
          <Link href="/about">Sobre Nosotros</Link>
        </li>
        <li>
          <Link href="/products">Productos</Link>
        </li>
        <li>
          <Link href="/contact">Contacto</Link>
        </li>
        <li>
          <Link href="/login" className="font-bold">
            Iniciar Sesión
          </Link>
        </li>
      </ul>
    </nav>
  );
}
