import AdminShell from "@/components/admin/AdminShell";
import { requireActor } from "@/lib/auth/access";
import ProductForm from "@/components/commercial/ProductForm";
import { PageHeading } from "@/components/commercial/CommercePage";
export default async function NewProductPage() {
  const { profile } = await requireActor({ permission: "catalog.manage" });
  return <AdminShell profile={profile}><PageHeading eyebrow="Catálogo" title="Crear producto" description="Completá lo definido y dejá pendientes los valores que todavía no estén aprobados." />
    <section className="commerce-form-card"><ProductForm /></section></AdminShell>;
}
