# Importación de datos

Crear los CSV en la carpeta `prisma/` y ejecutar los scripts en este orden.

**Formatos de fecha aceptados:** YYYY-MM-DD o DD/MM/YY (ej. 21/10/25, 21/2/26)

## 1. servicios.csv

```
caravana_vaca,fecha
0362,2024-02-20
0415,2024-03-01
```

- `caravana_vaca`: vaca o vaquillona (debe existir)
- `fecha`: YYYY-MM-DD o DD/MM/YY

```bash
npm run db:import-servicios
```

---

## 2. partos.csv

```
caravana,fecha
0362,2024-01-10
0415,2024-02-05
```

- `caravana`: madre (debe existir)
- `fecha`: YYYY-MM-DD o DD/MM/YY

```bash
npm run db:import-partos
```

---

## 3. secados.csv

```
caravana,fecha
0362,2024-11-15
0415,2024-12-01
```

- `caravana`: vaca (debe existir)
- `fecha`: YYYY-MM-DD o DD/MM/YY

```bash
npm run db:import-secados
```

---

## 4. tactos.csv

```
caravana,fecha,resultado,fecha_estimada_parto
0362,2024-03-15,prenada,2024-12-20
0415,2024-03-15,vacia,
```

- `caravana`: animal (debe existir)
- `fecha`: YYYY-MM-DD o DD/MM/YY
- `resultado`: `prenada` o `vacia`
- `fecha_estimada_parto`: solo si resultado=prenada. Vacío si vacía

```bash
npm run db:import-tactos
```

---

## 5. abortos.csv

```
caravana,fecha
0362,2024-06-10
```

- `caravana`: vaca o vaquillona (debe existir)
- `fecha`: YYYY-MM-DD o DD/MM/YY

```bash
npm run db:import-abortos
```
