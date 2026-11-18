import AdminShell from "@/components/admin/AdminShell";
import { requireActor } from "@/lib/auth/access";
import { CustomerForm } from "@/components/commercial/CustomerForm";
import { PageHeading, LoadError } from "@/components/commercial/CommercePage";
export default async function NewCustomerPage() {
  const { profile, supabase } = await requireActor({ permission: "customers.manage" });
  const {data:coverage,error}=await supabase.from("commercial_coverage").select("boundary,active,version").maybeSingle();
  if(error) return <LoadError profile={profile} error={error} />;
  return <AdminShell profile={profile}><PageHeading eyebrow="Clientes" title="Crear cliente" description="Registrá nombre, teléfono y dirección desde una sola ficha." /><section className="commerce-form-card"><CustomerForm coverage={coverage} /></section></AdminShell>;
}
