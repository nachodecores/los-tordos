import Link from "next/link";
import {randomUUID} from "node:crypto";
import AdminShell from "@/components/admin/AdminShell";
import {requireActor} from "@/lib/auth/access";
import {hasPermission} from "@/lib/auth/permissions.mjs";
import {uuid} from "@/lib/commercial/validation.mjs";
import {formatDate} from "@/lib/commercial/format.mjs";
import {PageHeading,LoadError,SavedNotice,EmptyState} from "@/components/commercial/CommercePage";
import StockMovementForm from "@/components/stock/StockMovementForm";
export default async function StockPage({searchParams}){
 const {profile,supabase}=await requireActor({permission:"stock.read"});
 const manage=hasPermission(profile.roles,"stock.manage"),query=await searchParams;
 let courier=null;
 try{courier=uuid(query.courier);}catch{courier=null;}
 const page=Math.min(100000,Math.max(1,Number.parseInt(query.page,10)||1));
 const results=await Promise.all([
  supabase.rpc("commercial_stock_balances"),
  supabase.rpc("commercial_stock_history",{p_courier_id:courier,p_page:page}),
  manage?supabase.from("staff_profiles").select("id,name,active,roles").order("name"):Promise.resolve({data:[]}),
  manage?supabase.from("commercial_products").select("id,name,sku").order("name"):Promise.resolve({data:[]})
 ]);
 const failed=results.find(r=>r.error);if(failed)return <LoadError profile={profile} error={failed.error}/>;
 const [accounts,movements,staff,products]=results.map(r=>r.data);
 const couriers=staff.filter(p=>(p.active&&p.roles.includes("reparto"))||accounts.some(a=>a.courier_id===p.id));
 const total=Number(movements[0]?.total_count||0);
 const requestKey=randomUUID();
 const base="/admin/stock?"+(courier?"courier="+courier+"&":"");
 return <AdminShell profile={profile}><PageHeading eyebrow="Inventario" title={manage?"Stock por repartidor":"Mi stock"} description="Cuenta corriente de paquetes por producto. Los movimientos anteriores no se editan ni se borran."/>
 <SavedNotice saved={query.saved==="1"}/>
 <section className="commerce-section"><h2>Saldos registrados</h2>
 {!accounts.length?<EmptyState>Todavía no hay stock registrado.</EmptyState>:<div className="commerce-table-wrap"><table className="commerce-table"><caption className="commerce-visually-hidden">Saldo por producto y repartidor</caption><thead><tr>{manage&&<th>Repartidor</th>}<th>Producto</th><th>Paquetes</th></tr></thead>
 <tbody>{accounts.map(a=><tr key={a.courier_id+":"+a.product_id}>{manage&&<td>{a.courier_name}{!a.courier_active&&" · Inactivo"}</td>}<td>{a.product_name} · {a.sku}</td><td>{a.balance}</td></tr>)}</tbody></table></div>}</section>
 {manage&&<section className="commerce-section"><h2>Registrar movimiento</h2>
 {!couriers.length?<EmptyState>Primero habilitá un usuario con el rol Reparto desde Usuarios.</EmptyState>:!products.length?<EmptyState>Primero agregá un producto al catálogo.</EmptyState>:
 <div className="commerce-form-card"><StockMovementForm key={requestKey} requestKey={requestKey} couriers={couriers} products={products} accounts={accounts}/></div>}</section>}
 <section className="commerce-section"><h2>Historial</h2>
 {manage&&<form className="commerce-search" method="get"><label>Repartidor<select name="courier" defaultValue={courier||""}><option value="">Todos</option>{couriers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><button type="submit">Filtrar</button></form>}
 {!movements.length?<EmptyState>No hay movimientos para mostrar.</EmptyState>:<div className="commerce-table-wrap"><table className="commerce-table"><caption className="commerce-visually-hidden">Movimientos de stock</caption><thead><tr><th>Fecha</th>{manage&&<th>Repartidor</th>}<th>Producto</th><th>Movimiento</th><th>Paquetes</th><th>Saldo</th><th>Responsable</th><th>Motivo</th></tr></thead>
 <tbody>{movements.map(m=><tr key={m.id}><td>{formatDate(m.occurred_at)}</td>{manage&&<td>{m.courier_name}</td>}<td>{m.product_name}</td><td>{m.kind==="entry"?"Entrada":"Corrección"}</td><td>{m.delta>0?"+":""}{m.delta}</td><td>{m.balance_before} → {m.balance_after}</td><td>{m.actor_name}</td><td>{m.reason||"—"}</td></tr>)}</tbody></table></div>}
 <nav className="commerce-pagination" aria-label="Páginas del historial">{page>1&&<Link href={base+"page="+(page-1)}>Anterior</Link>}<span>Página {page}</span>{page*25<total&&<Link href={base+"page="+(page+1)}>Siguiente</Link>}</nav>
 </section></AdminShell>;
}
