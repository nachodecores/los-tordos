import Link from "next/link";
import { requireActor } from "@/lib/auth/access";
import { getPanelContent } from "@/lib/admin/panel.mjs";
import AdminShell from "@/components/admin/AdminShell";
import PanelIcon from "@/components/admin/PanelIcon";

export default async function AdminPage() {
  const { profile } = await requireActor();
  const panel = getPanelContent(profile.roles);
  return <AdminShell profile={profile}>
    <div className="panel-page-heading"><p className="panel-eyebrow">Inicio</p><h1>Resumen de la operación</h1><p>Tu espacio de trabajo en Los Tordos.</p></div>

    {panel.showMap && <section className="panel-map-feature" aria-labelledby="map-heading">
      <div className="panel-map-symbol"><PanelIcon name="map" /></div>
      <div className="panel-map-copy"><div className="panel-feature-title"><h2 id="map-heading">Mapa de pedidos</h2><span className="panel-badge panel-badge-dark">Próximamente</span></div>
        <p>Los pedidos y su ubicación, en un solo lugar.</p><p className="panel-map-detail">Acá podrás consultar los pedidos disponibles y organizar las entregas.</p>
      </div>
    </section>}

    {panel.summaries.length > 0 && <section aria-labelledby="summary-heading">
      <div className="panel-section-heading"><h2 id="summary-heading">De un vistazo</h2><span>Herramientas en preparación</span></div>
      <div className="panel-summary-grid">{panel.summaries.map((item) => <article key={item.id} className="panel-summary-card">
        <div className="panel-card-top"><span className="panel-icon-box"><PanelIcon name={item.icon} /></span><span className="panel-badge">{item.id === "stock" ? "Disponible" : "Próximamente"}</span></div>
        <h3>{item.title}</h3><p>{item.description}</p>
      </article>)}</div>
    </section>}

    {panel.showAlerts && <section className="panel-alerts" aria-labelledby="alerts-heading">
      <div className="panel-alerts-icon"><PanelIcon name="bell" /></div>
      <div><div className="panel-feature-title"><h2 id="alerts-heading">Alertas de pedidos</h2><span className="panel-badge">Próximamente</span></div>
        <p>Acá se mostrarán los pedidos que superen los plazos configurados: sin reservar, por entregar o con pago pendiente.</p>
        <p className="panel-muted">Cada aviso identificará el pedido y el tiempo transcurrido para que puedas intervenir.</p>
      </div>
    </section>}

    <section className="panel-shortcuts" aria-labelledby="tools-heading"><h2 id="tools-heading">Disponible ahora</h2>
      <div className="panel-shortcut-grid">
        {panel.stock && <Link href="/admin/stock" className="panel-shortcut"><PanelIcon name="stock" /><span><strong>{panel.stockManage ? "Stock por repartidor" : "Mi stock"}</strong><small>Consultá saldos y movimientos de paquetes.</small></span><PanelIcon name="arrow" /></Link>}
        {panel.catalog && <Link href="/admin/products" className="panel-shortcut"><PanelIcon name="stock" /><span><strong>Productos</strong><small>Configurá presentaciones y precios.</small></span><PanelIcon name="arrow" /></Link>}
        {panel.customers && <Link href="/admin/customers" className="panel-shortcut"><PanelIcon name="users" /><span><strong>Clientes</strong><small>Datos de contacto y direcciones.</small></span><PanelIcon name="arrow" /></Link>}
        {panel.customers && <Link href="/admin/coverage" className="panel-shortcut"><PanelIcon name="map" /><span><strong>Zona de cobertura</strong><small>Dibujá el área de entrega en el mapa.</small></span><PanelIcon name="arrow" /></Link>}
        {panel.manageUsers && <Link href="/admin/users" className="panel-shortcut"><PanelIcon name="users" /><span><strong>Usuarios e invitaciones</strong><small>Administrá las cuentas y los permisos del equipo.</small></span><PanelIcon name="arrow" /></Link>}
        <Link href="/admin/account" className="panel-shortcut"><PanelIcon name="account" /><span><strong>Mi cuenta</strong><small>Consultá tu acceso y cambiá tu contraseña.</small></span><PanelIcon name="arrow" /></Link>
      </div>
    </section>
  </AdminShell>;
}
