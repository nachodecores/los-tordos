import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireActor } from "@/lib/auth/access";
import { listingParams } from "@/lib/commercial/search.mjs";
import { PageHeading, LoadError, EmptyState } from "@/components/commercial/CommercePage";
import { SearchForm, Pagination } from "@/components/commercial/ListingControls";
export default async function CustomersPage({ searchParams }) {
  const { profile, supabase } = await requireActor({ permission: "customers.manage" });
  const { q, page, from, to } = listingParams(await searchParams);
  let query = supabase.from("commercial_customers").select("id,name,phone", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
  if (q) query = query.ilike("name", `%${q}%`);
  const { data, error, count } = await query;
  if (error) return <LoadError profile={profile} error={error} />;
  return <AdminShell profile={profile}><PageHeading eyebrow="Clientes" title="Clientes" description="Nombre, teléfono y direcciones de entrega. Sin registro del consumidor." href="/admin/customers/new" actionLabel="Crear cliente" />
    <SearchForm q={q} />{!data.length ? <EmptyState>{q ? "No encontramos clientes con ese nombre." : "Todavía no hay clientes registrados."}</EmptyState> :
      <div className="commerce-table-wrap"><table className="commerce-table"><caption className="commerce-visually-hidden">Clientes registrados</caption><thead><tr><th>Nombre</th><th>Teléfono</th><th>Ficha</th></tr></thead><tbody>{data.map((customer) => <tr key={customer.id}><td>{customer.name}</td><td>{customer.phone}</td><td><Link href={`/admin/customers/${customer.id}`}>Ver cliente</Link></td></tr>)}</tbody></table></div>}
    <Pagination base="/admin/customers" page={page} q={q} count={count} />
  </AdminShell>;
}
