import { describe, test, before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { database, ids, sessionId } from "./helpers/database.mjs";
import { hasPermission } from "../src/lib/auth/permissions.mjs";

let db;
async function actor(role, aal = "aal1") {
  const id = ids[role];
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claims',$2,false)", [id, JSON.stringify({ sub: id, aal, session_id: sessionId(id) })]);
  await db.exec("set role authenticated");
}
async function scalar(sql, params) {
  const result = await db.query(sql, params);
  return Object.values(result.rows[0])[0];
}
describe("permisos y RLS ejecutados en PostgreSQL aislado en memoria", () => {
  before(async () => { db = await database(); });
  after(async () => { await db?.close(); });
  beforeEach(async () => { await db.exec("begin"); });
  afterEach(async () => { await db.exec("rollback; reset role"); });

  test("el esquema permite uso autenticado sin otorgar creación ni acceso anónimo", async () => {
    assert.equal(await scalar("select has_schema_privilege('authenticated','public','USAGE')"), true);
    assert.equal(await scalar("select has_schema_privilege('authenticated','public','CREATE')"), false);
    assert.equal(await scalar("select has_schema_privilege('anon','public','USAGE')"), false);
  });

  test("anónimo no lee perfiles ni crea invitaciones", async () => {
    await db.exec("set role anon");
    await assert.rejects(db.query("select * from public.staff_profiles"), /permission denied/);
  });
  test("el trigger rechaza cuentas sin invitación aprobada", async () => {
    await assert.rejects(db.query("insert into auth.users(id,email) values(gen_random_uuid(),'intruso@example.com')"), /Invitation required/);
  });
  test("un repartidor solo puede leer su propio perfil", async () => {
    await actor("reparto");
    assert.equal(await scalar("select count(*) from public.staff_profiles"), 1);
    assert.equal(await scalar("select count(*) from public.staff_invitations"), 0);
    assert.equal(await scalar("select count(*) from public.access_audit"), 0);
  });
  test("no puede elevar sus roles escribiendo directamente", async () => {
    await actor("reparto");
    await assert.rejects(db.query("update public.staff_profiles set roles=array['admin'] where id=$1", [ids.reparto]), /permission denied/);
  });
  test("no puede usar la RPC administrativa para elevar permisos", async () => {
    await actor("reparto");
    await assert.rejects(db.query("select public.update_staff_access($1,'Intruso',array['admin'],true)", [ids.reparto]), /Forbidden/);
  });
  test("todos los perfiles pueden operar con sesión de correo y contraseña", async () => {
    for (const role of Object.keys(ids)) {
      await actor(role);
      assert.equal(await scalar("select private.has_access('staff.access')"), true);
    }
  });
  test("un factor histórico no agrega un requisito de acceso", async () => {
    await db.query("insert into auth.mfa_factors(user_id,status) values($1,'verified')", [ids.admin]);
    await actor("admin");
    assert.equal(await scalar("select private.has_access('users.manage')"), true);
  });
  test("la matriz del servidor coincide con la autorización SQL", async () => {
    for (const role of Object.keys(ids)) {
      await actor(role);
      for (const permission of ["stock.manage","stock.read","users.manage","catalog.manage","customers.manage","orders.read","orders.create_manual","logistics.manage","deliveries.manage","deliveries.operate","collections.manage","wholesale.own","unknown"]) {
        assert.equal(await scalar("select private.has_access($1)", [permission]), hasPermission([role], permission), role + " " + permission);
      }
    }
  });
  test("desactivar una cuenta bloquea su sesión ya emitida y deja auditoría", async () => {
    await actor("admin");
    await db.query("select public.update_staff_access($1,'Repartidor',array['reparto'],false)", [ids.reparto]);
    assert.equal(await scalar("select count(*) from public.access_audit where action='access.updated'"), 1);
    await actor("reparto");
    assert.equal(await scalar("select private.has_access('staff.access')"), false);
  });
  test("quitar roles se aplica sin esperar a que venza el JWT", async () => {
    await actor("admin");
    await db.query("select public.update_staff_access($1,'Cobranzas',array['cobranzas'],true)", [ids.reparto]);
    await actor("reparto");
    assert.equal(await scalar("select private.has_access('deliveries.operate')"), false);
    assert.equal(await scalar("select private.has_access('collections.manage')"), true);
  });
  test("no se puede desactivar al último administrador", async () => {
    await actor("admin");
    await assert.rejects(db.query("select public.update_staff_access($1,'Admin',array['admin'],false)", [ids.admin]), /last administrator/);
  });
  test("onboarding pendiente impide operar", async () => {
    await db.query("update public.staff_profiles set onboarding_required=true where id=$1", [ids.reparto]);
    await actor("reparto");
    assert.equal(await scalar("select private.has_access('staff.access')"), false);
    await db.query("select public.complete_staff_onboarding()");
    assert.equal(await scalar("select private.has_access('staff.access')"), true);
  });
  test("una sesión revocada no conserva permisos", async () => {
    await db.query("delete from auth.sessions where user_id=$1", [ids.reparto]);
    await actor("reparto");
    assert.equal(await scalar("select public.staff_session_is_valid()"), false);
    assert.equal(await scalar("select private.has_access('staff.access')"), false);
  });
  test("administración puede reservar una invitación; duplicados se rechazan", async () => {
    await actor("admin");
    const id = await scalar("select public.reserve_staff_invitation('nuevo@example.com','Persona',array['cobranzas','reparto'])");
    assert.ok(id);
    await db.query("select public.record_invitation_delivery($1,true)", [id]);
    assert.equal(await scalar("select delivery_status from public.staff_invitations where id=$1", [id]), "sent");
    await assert.rejects(db.query("select public.reserve_staff_invitation('nuevo@example.com','Otra',array['admin'])"), /duplicate key/);
  });
  test("la auditoría no se puede borrar desde una cuenta administrativa", async () => {
    await actor("admin");
    await assert.rejects(db.query("delete from public.access_audit"), /permission denied/);
  });
});
