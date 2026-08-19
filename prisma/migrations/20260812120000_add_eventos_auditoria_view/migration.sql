-- CreateView
-- Vista de auditoría: unifica todos los eventos del ciclo productivo
-- (servicio, tacto, parto, secado, aborto) más el alta de animales,
-- para poder identificar rápido qué evento se agregó y quién lo cargó.
CREATE VIEW "eventos_auditoria" AS
SELECT
  'servicio' AS tipo_evento,
  s.id AS evento_id,
  s.animal_id,
  a.caravana,
  s.fecha,
  s.creado_por,
  s.created_at
FROM "Servicio" s
JOIN "Animal" a ON a.id = s.animal_id

UNION ALL

SELECT
  'tacto' AS tipo_evento,
  t.id AS evento_id,
  t.animal_id,
  a.caravana,
  t.fecha,
  t.creado_por,
  t.created_at
FROM "Tacto" t
JOIN "Animal" a ON a.id = t.animal_id

UNION ALL

SELECT
  'parto' AS tipo_evento,
  p.id AS evento_id,
  p.animal_id,
  a.caravana,
  p.fecha,
  p.creado_por,
  p.created_at
FROM "Parto" p
JOIN "Animal" a ON a.id = p.animal_id

UNION ALL

SELECT
  'secado' AS tipo_evento,
  se.id AS evento_id,
  se.animal_id,
  a.caravana,
  se.fecha,
  se.creado_por,
  se.created_at
FROM "Secado" se
JOIN "Animal" a ON a.id = se.animal_id

UNION ALL

SELECT
  'aborto' AS tipo_evento,
  ab.id AS evento_id,
  ab.animal_id,
  a.caravana,
  ab.fecha,
  ab.creado_por,
  ab.created_at
FROM "Aborto" ab
JOIN "Animal" a ON a.id = ab.animal_id

UNION ALL

SELECT
  'alta_animal' AS tipo_evento,
  a.id AS evento_id,
  a.id AS animal_id,
  a.caravana,
  a.created_at::date AS fecha,
  a.creado_por,
  a.created_at
FROM "Animal" a;
