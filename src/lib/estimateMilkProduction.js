/**
 * Estimación de producción diaria de leche por vaca.
 * Lógica simple, legible y editable. Sin dependencias externas.
 */

const CURVE_SEGMENTS = [
  { min: 0, max: 10, percent: 0.6 },
  { min: 11, max: 20, percent: 0.75 },
  { min: 21, max: 30, percent: 0.88 },
  { min: 31, max: 40, percent: 0.96 },
  { min: 41, max: 60, percent: 1.0 },
  { min: 61, max: 90, percent: 0.97 },
  { min: 91, max: 120, percent: 0.93 },
  { min: 121, max: 150, percent: 0.89 },
  { min: 151, max: 180, percent: 0.85 },
  { min: 181, max: 210, percent: 0.81 },
  { min: 211, max: 240, percent: 0.76 },
  { min: 241, max: 270, percent: 0.71 },
  { min: 271, max: 305, percent: 0.65 },
];

const SEASONAL_FACTORS = {
  spring: 1.12,
  autumn: 1.03,
  winter: 0.94,
  summer: 0.83,
};

export const DEFAULTS = {
  peakFactor: 1.35,
  baseConcentrateKg: 6,
  litersPerExtraKg: 0.7,
  minDaysInMilk: 0,
  maxDaysInMilk: 305,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function getLactationCurvePercent(daysInMilk, params) {
  const dim = clamp(
    daysInMilk,
    params.minDaysInMilk,
    params.maxDaysInMilk
  );
  const segment = CURVE_SEGMENTS.find(
    (item) => dim >= item.min && dim <= item.max
  );
  return segment?.percent ?? 0.65;
}

function getSeasonalFactor(season) {
  return SEASONAL_FACTORS[season];
}

function getRationAdjustmentLiters(concentrateKgPerDay, daysInMilk, params) {
  const dim = clamp(
    daysInMilk,
    params.minDaysInMilk,
    params.maxDaysInMilk
  );
  let litersPerExtraKg = params.litersPerExtraKg;
  if (dim <= 90) {
    litersPerExtraKg = 1.0;
  } else if (dim <= 180) {
    litersPerExtraKg = 0.7;
  } else {
    litersPerExtraKg = 0.4;
  }
  return (concentrateKgPerDay - params.baseConcentrateKg) * litersPerExtraKg;
}

/** Obtiene la estación del año a partir del mes (1-12) */
export function getSeasonFromMonth(month) {
  if (month >= 12 || month <= 2) return "summer";
  if (month >= 3 && month <= 5) return "autumn";
  if (month >= 6 && month <= 8) return "winter";
  return "spring";
}

/**
 * Estima la producción diaria de leche por vaca (litros/día).
 */
export function estimateCowMilkProduction(input, params = DEFAULTS) {
  const daysInMilk = clamp(
    input.daysInMilk,
    params.minDaysInMilk,
    params.maxDaysInMilk
  );

  const peakLiters = input.targetAverageLiters * params.peakFactor;
  const lactationCurvePercent = getLactationCurvePercent(daysInMilk, params);
  const baseLiters = peakLiters * lactationCurvePercent;

  const seasonalFactor = getSeasonalFactor(input.season);
  const litersAfterSeason = baseLiters * seasonalFactor;

  const rationAdjustmentLiters = getRationAdjustmentLiters(
    input.concentrateKgPerDay,
    daysInMilk,
    params
  );

  const finalLiters = Math.max(0, litersAfterSeason + rationAdjustmentLiters);

  return {
    peakLiters: round(peakLiters),
    lactationCurvePercent: round(lactationCurvePercent, 3),
    baseLiters: round(baseLiters),
    seasonalFactor: round(seasonalFactor, 3),
    litersAfterSeason: round(litersAfterSeason),
    rationAdjustmentLiters: round(rationAdjustmentLiters),
    finalLiters: round(finalLiters),
  };
}

/**
 * Estima la producción mensual (litros) para una vaca.
 */
export function estimateMonthlyProduction(
  input,
  daysInMonth = 30,
  params = DEFAULTS
) {
  const result = estimateCowMilkProduction(input, params);
  return round(result.finalLiters * daysInMonth);
}

/**
 * Estima la producción anual (litros) para una vaca.
 * Promedia por estación a lo largo de 12 meses.
 */
export function estimateAnnualProduction(input, params = DEFAULTS) {
  const months = 12;
  const daysPerMonth = 365 / 12;
  let total = 0;

  for (let m = 0; m < months; m++) {
    const season = getSeasonFromMonth(
      ((new Date().getMonth() + m) % 12) + 1
    );
    const dimAtMonth = input.daysInMilk + m * Math.round(daysPerMonth);
    const monthInput = {
      ...input,
      daysInMilk: dimAtMonth,
      season,
    };
    total += estimateMonthlyProduction(monthInput, daysPerMonth, params);
  }

  return round(total);
}

/**
 * Estima la producción diaria total del rodeo (litros/día).
 */
export function estimateHerdDailyProduction(cows, params = DEFAULTS) {
  const total = cows.reduce(
    (acc, cow) => acc + estimateCowMilkProduction(cow, params).finalLiters,
    0
  );
  return round(total);
}

/**
 * Estima la producción mensual total del rodeo (litros).
 */
export function estimateHerdMonthlyProduction(
  cows,
  daysInMonth = 30,
  params = DEFAULTS
) {
  const total = cows.reduce(
    (acc, cow) => acc + estimateMonthlyProduction(cow, daysInMonth, params),
    0
  );
  return round(total);
}
