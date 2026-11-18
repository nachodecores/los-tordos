import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { requireActor } from "@/lib/auth/access";
import { uuid } from "@/lib/commercial/validation.mjs";
import ProductForm from "@/components/commercial/ProductForm";
import { PageHeading, LoadError } from "@/components/commercial/CommercePage";
export default async function ProductPage({ params }) {
  const { profile, supabase } = await requireActor({ permission: "catalog.manage" });
  const { id } = await params;
  try { uuid(id, true); } catch { notFound(); }
  const { data: product, error } = await supabase.from("commercial_products").select("*").eq("id", id).maybeSingle();
  if (error) return <LoadError profile={profile} error={error} />;
  if (!product) notFound();
  return <AdminShell profile={profile}><PageHeading eyebrow="Catálogo" title={product.name} description="Los cambios del catálogo no alteran los importes guardados en pedidos anteriores." />
    <section className="commerce-form-card"><ProductForm key={product.version} product={product} /></section></AdminShell>;
}
