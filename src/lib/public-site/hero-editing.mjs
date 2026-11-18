export const heroEditorStorageKey = 'lostordos-hero-editor-v1';
export const adjustmentRanges = {
  brightness: [0.3, 1.6, 0.01],
  contrast: [0.5, 1.8, 0.01],
  saturation: [0, 1.6, 0.01],
  warmth: [0, 0.5, 0.01],
  shadows: [0, 1, 0.01],
  sharpness: [0, 0.8, 0.01],
  zoom: [1, 2.5, 0.01],
  mobileZoom: [1, 2.5, 0.01],
};
export function cleanAdjustments(value, photos) {
  const result = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
  for (const photo of photos) {
    const input = value[photo.id];
    if (!input || typeof input !== 'object' || Array.isArray(input)) continue;
    const output = {};
    for (const [key, [min, max]] of Object.entries(adjustmentRanges)) {
      if (typeof input[key] === 'number' && Number.isFinite(input[key])) output[key] = Math.max(min, Math.min(max, input[key]));
    }
    for (const key of ['position', 'mobilePosition']) {
      if (typeof input[key] !== 'string') continue;
      const match = input[key].match(/^(\d+(?:\.\d+)?)% (\d+(?:\.\d+)?)%$/);
      if (match && +match[1] <= 100 && +match[2] <= 100) output[key] = input[key];
    }
    result[photo.id] = output;
  }
  return result;
}
export function heroPhotoStyle(photo) {
  return {
    '--hero-position': photo.position,
    '--hero-mobile-position': photo.mobilePosition || photo.position,
    '--hero-brightness': photo.brightness ?? 0.83,
    '--hero-contrast': photo.contrast ?? 1.23,
    '--hero-saturation': photo.saturation ?? 0.85,
    '--hero-warmth': photo.warmth ?? 0,
    '--hero-shadows': photo.shadows ?? 1,
    '--hero-zoom': photo.zoom ?? 1,
    '--hero-mobile-zoom': photo.mobileZoom ?? 1,
    '--hero-sharpen': photo.sharpness > 0 ? `url(#hero-sharp-${photo.id})` : 'brightness(1)',
  };
}
