import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { requireActor } from "@/lib/auth/access";
import { uuid } from "@/lib/commercial/validation.mjs";
import { CustomerForm } from "@/components/commercial/CustomerForm";
import { PageHeading, LoadError, SavedNotice } from "@/components/commercial/CommercePage";
export default async function CustomerPage({ params, searchParams }) {
  const { profile, supabase } = await requireActor({ permission: "customers.manage" });
  const { id } = await params;
  try { uuid(id, true); } catch { notFound(); }
  const [customerResult, addressResult, coverageResult] = await Promise.all([
    supabase.from("commercial_customers").select("*").eq("id", id).maybeSingle(),
    supabase.from("commercial_addresses").select("*").eq("customer_id", id).order("created_at"),
    supabase.from("commercial_coverage").select("boundary,active,version").maybeSingle(),
  ]);
  if (customerResult.error || addressResult.error || coverageResult.error) return <LoadError profile={profile} error={customerResult.error || addressResult.error || coverageResult.error} />;
  const customer = customerResult.data;
  if (!customer) notFound();
  const query = await searchParams;
  return <AdminShell profile={profile}><PageHeading eyebrow="Clientes" title={customer.name} description="Los cambios de esta ficha no reescriben los datos guardados en pedidos anteriores." />
    <SavedNotice saved={query.saved === "1"} /><section className="commerce-form-card"><CustomerForm key={customer.version + ":" + (addressResult.data[0]?.version || 0)} customer={customer} address={addressResult.data[0]} coverage={coverageResult.data} /></section>
    <p><Link href="/admin/customers">Volver a clientes</Link></p>
  </AdminShell>;
}
