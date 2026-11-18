import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

export const ids = { admin: "00000000-0000-4000-8000-000000000001", reparto: "00000000-0000-4000-8000-000000000002", cobranzas: "00000000-0000-4000-8000-000000000003" };
export const sessionId = id => id.replace("00000000-", "10000000-");

export async function database({ through } = {}) {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon noinherit; create role authenticated noinherit;
      revoke all on schema public from public;
      create schema auth;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,encrypted_password text);
      create table auth.sessions(id uuid primary key,user_id uuid references auth.users);
      create table auth.mfa_factors(id uuid primary key default gen_random_uuid(),user_id uuid,status text);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}'::jsonb)$$;
      grant usage on schema auth to authenticated,anon;
    `);
    const dir = new URL("../../supabase/migrations/", import.meta.url);
    const migrations = (await readdir(dir)).filter(file => file.endsWith(".sql") && (!through || file <= through)).sort();
    for (const file of migrations) await db.exec(await readFile(new URL(file, dir), "utf8"));
    for (const [role, id] of Object.entries(ids)) {
      await db.query("insert into public.staff_invitations(email,name,roles) values($1,$2,$3)", [role + "@example.com", role, [role]]);
      await db.query("insert into auth.users(id,email,email_confirmed_at,encrypted_password) values($1,$2,now(),'test-only-hash')", [id, role + "@example.com"]);
      await db.query("insert into auth.sessions(id,user_id) values($1,$2)", [sessionId(id), id]);
    }
    await db.exec("update public.staff_profiles set onboarding_required=false");
    return db;
  } catch (error) { await db.close(); throw error; }
}
export async function actor(db, role, aal = "aal1") {
  const id = ids[role];
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claims',$2,false)", [id, JSON.stringify({ sub: id, aal, session_id: sessionId(id) })]);
  await db.exec("set role authenticated");
}
