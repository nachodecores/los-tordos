import AdminShell from "@/components/admin/AdminShell";
import {requireActor} from "@/lib/auth/access";
import {PageHeading,LoadError,SavedNotice} from "@/components/commercial/CommercePage";
import CoverageForm from "@/components/geo/CoverageForm";
export default async function CoveragePage({searchParams}){
 const {profile,supabase}=await requireActor({permission:"customers.manage"});
 const {data,error}=await supabase.from("commercial_coverage").select("*").maybeSingle();
 if(error)return <LoadError profile={profile} error={error}/>;
 const query=await searchParams;
 return <AdminShell profile={profile}><PageHeading eyebrow="Administración" title="Zona de cobertura" description="Definí la zona comercial general de Los Tordos. Solo administración puede modificarla."/>
 <SavedNotice saved={query.saved==="1"}/>
 {!data&&<p className="commerce-empty">Todavía no hay una zona definida. El mapa está centrado en Montevideo; eso no habilita ninguna cobertura.</p>}
 <section className="commerce-form-card geo-form-card"><CoverageForm key={data?.version||"new"} coverage={data}/></section>
 </AdminShell>;
}
