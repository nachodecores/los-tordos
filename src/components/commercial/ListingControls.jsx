import Link from "next/link";
export function SearchForm({ q, placeholder = "Buscar por nombre" }) {
  return <form className="commerce-search" method="get"><label><span className="commerce-visually-hidden">Buscar por nombre</span><input name="q" defaultValue={q} maxLength={100} placeholder={placeholder} /></label><button>Buscar</button></form>;
}
export function Pagination({ base, page, count, q }) {
  const pages = Math.max(1, Math.ceil((count || 0) / 25));
  if (pages === 1 && page === 1) return null;
  const href = (number) => `${base}?page=${number}&q=${encodeURIComponent(q)}`;
  return <nav aria-label="Páginas del listado" className="commerce-pagination">
    {page > 1 && <Link href={href(page - 1)}>Anterior</Link>}<span>Página {page} de {pages}</span>{page < pages && <Link href={href(page + 1)}>Siguiente</Link>}
  </nav>;
}
