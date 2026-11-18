export const coverageLabels = { unchecked: "Cobertura sin definir", covered: "Dentro de cobertura", outside: "Fuera de cobertura", ambiguous: "Sobre el límite: revisar" };
export function coordinate(value, min, max) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new Error("Revisá las coordenadas.");
  return Math.round(number * 1e6) / 1e6;
}
const cross = (a,b,c) => (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const onSegment = (a,b,p) => Math.abs(cross(a,b,p)) < 1e-9 && p[0] >= Math.min(a[0],b[0])-1e-9 && p[0] <= Math.max(a[0],b[0])+1e-9 && p[1] >= Math.min(a[1],b[1])-1e-9 && p[1] <= Math.max(a[1],b[1])+1e-9;
function intersects(a,b,c,d) {
  return (cross(a,b,c)*cross(a,b,d)<0 && cross(c,d,a)*cross(c,d,b)<0) || onSegment(a,b,c)||onSegment(a,b,d)||onSegment(c,d,a)||onSegment(c,d,b);
}
export function validateBoundary(input) {
  if (!Array.isArray(input) || input.length < 3 || input.length > 100) throw new Error("Marcá entre 3 y 100 puntos para definir la zona.");
  const points = input.map(p => {
    if (!Array.isArray(p) || p.length !== 2 || p.some(v=>typeof v !== "number")) throw new Error("Revisá los puntos de la zona.");
    const lon=coordinate(p[0],-180,180),lat=coordinate(p[1],-85,85);
    if(lon===null||lat===null) throw new Error("Revisá los puntos de la zona.");
    return [lon,lat];
  });
  if(new Set(points.map(p=>p.join(","))).size!==points.length) throw new Error("La zona tiene puntos repetidos.");
  // Limita la representacion plana a una zona local, sin cruces del antimeridiano.
  if(Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0]))>5 || Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1]))>5) throw new Error("La zona debe ser un área local.");
  let area=0;
  for(let i=0;i<points.length;i++) {
    const next=(i+1)%points.length;
    area+=points[i][0]*points[next][1]-points[next][0]*points[i][1];
    if(Math.abs(cross(points[(i+points.length-1)%points.length],points[i],points[next]))<1e-12) throw new Error("La zona tiene puntos alineados.");
    for(let j=i+1;j<points.length;j++) {
      if(j===next || (i===0&&j===points.length-1)) continue;
      if(intersects(points[i],points[next],points[j],points[(j+1)%points.length])) throw new Error("Los lados de la zona se cruzan.");
    }
  }
  if(Math.abs(area)<1e-10) throw new Error("La zona no tiene superficie.");
  return points;
}
export function pointCoverage(point, boundary, active=true) {
  if(!point || !active || !boundary?.length) return "unchecked";
  let inside=false;
  for(let i=0,j=boundary.length-1;i<boundary.length;j=i++) {
    const a=boundary[j],b=boundary[i];
    if(onSegment(a,b,point)) return "ambiguous";
    if((a[1]>point[1])!==(b[1]>point[1]) && point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0]) inside=!inside;
  }
  return inside?"covered":"outside";
}
