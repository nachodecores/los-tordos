import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireActor } from "@/lib/auth/access";
import { formatMoney } from "@/lib/commercial/format.mjs";
import { listingParams } from "@/lib/commercial/search.mjs";
import { PageHeading, LoadError, EmptyState, SavedNotice } from "@/components/commercial/CommercePage";
import { SearchForm, Pagination } from "@/components/commercial/ListingControls";

export default async function ProductsPage({ searchParams }) {
  const { profile, supabase } = await requireActor({ permission: "catalog.manage" });
  const params = await searchParams;
  const { q, page, from, to } = listingParams(params);
  let query = supabase.from("commercial_products").select("id,sku,name,nominal_weight_grams,unit_price,currency,active", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
  if (q) query = query.ilike("name", `%${q}%`);
  const { data, error, count } = await query;
  if (error) return <LoadError profile={profile} error={error} />;
  return <AdminShell profile={profile}>
    <PageHeading eyebrow="Catálogo" title="Productos" description="Presentaciones y precios de venta." href="/admin/products/new" actionLabel="Crear producto" />
    <SavedNotice saved={params.saved === "1"} /><SearchForm q={q} />
    {!data.length ? <EmptyState>{q ? "No encontramos productos con ese nombre." : "Todavía no hay productos. Creá la presentación cuando tengas sus datos."}</EmptyState> :
      <div className="commerce-table-wrap"><table className="commerce-table"><caption className="commerce-visually-hidden">Productos del catálogo</caption><thead><tr><th>Producto</th><th>Peso nominal</th><th>Precio por paquete</th><th>Estado</th></tr></thead><tbody>{data.map((product) => <tr key={product.id}>
        <td><Link href={`/admin/products/${product.id}`}>{product.name}</Link><small>{product.sku}</small></td><td>{product.nominal_weight_grams ? `${product.nominal_weight_grams} g` : "Sin definir"}</td>
        <td>{formatMoney(product.unit_price)}</td><td><span className="panel-badge">{product.active ? "Habilitado" : "Deshabilitado"}</span></td>
      </tr>)}</tbody></table></div>}
    <Pagination base="/admin/products" page={page} q={q} count={count} />
  </AdminShell>;
}
