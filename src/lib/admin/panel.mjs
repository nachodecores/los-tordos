import { hasPermission } from "../auth/permissions.mjs";

export function getPanelContent(roles) {
  const manageUsers = hasPermission(roles, "users.manage");
  const catalog = hasPermission(roles, "catalog.manage");
  const customers = hasPermission(roles, "customers.manage");
  const manageDeliveries = hasPermission(roles, "deliveries.manage");
  const delivery = hasPermission(roles, "deliveries.operate");
  const collections = hasPermission(roles, "collections.manage");
  const stock = hasPermission(roles, "stock.read");
  const stockManage = hasPermission(roles, "stock.manage");
  const map = manageDeliveries || delivery;

  const summaries = [
    map && { id: "available", title: "Pedidos sin reservar", description: "Pedidos confirmados que todavía no tomó un repartidor.", icon: "orders" },
    map && { id: "reserved", title: delivery && !manageDeliveries ? "Mis pedidos por entregar" : "Reservados por entregar", description: delivery && !manageDeliveries ? "Tus reservas pendientes de entrega." : "Pedidos reservados que todavía no fueron entregados.", icon: "delivery" },
    collections && { id: "unpaid", title: "Entregados por cobrar", description: "Pedidos entregados cuyo pago sigue pendiente de confirmación.", icon: "wallet" },
    collections && { id: "paid", title: "Cobranzas realizadas", description: "Pagos confirmados y su historial.", icon: "check" },
    stock && { id: "stock", title: stockManage ? "Stock por repartidor" : "Mi stock", description: stockManage ? "Paquetes bajo responsabilidad de cada repartidor." : "Paquetes bajo tu responsabilidad y sus movimientos.", icon: "stock" },
    manageUsers && { id: "commissions", title: "Comisiones acumuladas", description: "Comisiones generadas por las entregas registradas.", icon: "commission" },
  ].filter(Boolean);

  const navigation = [
    { href: "/admin", label: "Inicio", icon: "home" },
    ...(stock ? [{ href: "/admin/stock", label: stockManage ? "Stock" : "Mi stock", icon: "stock" }] : []),
    ...(catalog ? [{ href: "/admin/products", label: "Productos", icon: "stock" }] : []),
    ...(customers ? [{ href: "/admin/customers", label: "Clientes", icon: "users" }, { href: "/admin/coverage", label: "Cobertura", icon: "map" }] : []),
    ...(manageUsers ? [{ href: "/admin/users", label: "Usuarios", icon: "users" }] : []),
    { href: "/admin/account", label: "Mi cuenta", icon: "account" },
  ];

  const upcoming = [
    map && { label: "Mapa de pedidos", icon: "map" },
    map && { label: delivery && !manageDeliveries ? "Mis pedidos" : "Pedidos", icon: "orders" },
    collections && { label: "Cobranzas", icon: "wallet" },
    manageUsers && { label: "Comisiones", icon: "commission" },
  ].filter(Boolean);

  return { summaries, navigation, upcoming, showMap: map, showAlerts: manageUsers, manageUsers, catalog, customers, stock, stockManage };
}
