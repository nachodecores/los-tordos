import AuthForm from "@/components/auth/AuthForm";
import { saveProduct } from "@/app/admin/commercial-actions";
import { FormIds } from "./CommercePage";

export default function ProductForm({ product }) {
  return <AuthForm action={saveProduct} submitLabel={product ? "Guardar producto" : "Crear producto"}>
    <FormIds record={product} />
    <label>Código interno<input name="sku" defaultValue={product?.sku || ""} required maxLength={60} /></label>
    <label>Nombre<input name="name" defaultValue={product?.name || ""} required maxLength={160} /></label>
    <div className="commerce-form-row">
      <label>Peso nominal en gramos<input name="nominal_weight_grams" type="number" min="1" step="1" defaultValue={product?.nominal_weight_grams ?? ""} /></label>
      <label>Precio por paquete en pesos<input name="unit_price" inputMode="decimal" placeholder="Sin definir" defaultValue={product?.unit_price ?? ""} /></label>
    </div>
    <label className="access-checkbox"><input name="active" type="checkbox" defaultChecked={product?.active || false} />Producto habilitado</label>
    <p className="panel-muted">Podés dejar peso y precio sin definir mientras el producto esté deshabilitado.</p>
  </AuthForm>;
}
