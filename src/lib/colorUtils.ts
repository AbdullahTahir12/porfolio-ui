const HEX_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHexColor(hex: string) {
  const trimmed = hex.trim();
  const match = trimmed.match(HEX_REGEX);
  if (!match) {
    return null;
  }

  const value = match[1];
  if (value.length === 3) {
    return `#${value
      .split('')
      .map((char) => `${char}${char}`)
      .join('')}`.toUpperCase();
  }

  return `#${value.toUpperCase()}`;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) {
    return null;
  }

  const value = normalized.slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return { r, g, b };
}

function rgbToHex(value: number) {
  const clamped = Math.min(255, Math.max(0, Math.round(value)));
  return clamped.toString(16).padStart(2, '0').toUpperCase();
}

function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function mixHexColors(source: string, target: string, ratio: number) {
  const start = hexToRgb(source);
  const end = hexToRgb(target);
  if (!start || !end) {
    return normalizeHexColor(source) ?? source;
  }

  const amount = clamp(ratio, 0, 1);
  const mixChannel = (base: number, overlay: number) => base + (overlay - base) * amount;
  const r = mixChannel(start.r, end.r);
  const g = mixChannel(start.g, end.g);
  const b = mixChannel(start.b, end.b);

  return `#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`;
}

export function lightenHex(hex: string, ratio = 0.2) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) {
    return hex;
  }
  return mixHexColors(normalized, '#FFFFFF', ratio);
}

export function darkenHex(hex: string, ratio = 0.2) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) {
    return hex;
  }
  return mixHexColors(normalized, '#000000', ratio);
}

function srgbToLinear(component: number) {
  const channel = component / 255;
  if (channel <= 0.04045) {
    return channel / 12.92;
  }

  return Math.pow((channel + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb: { r: number; g: number; b: number }) {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(l1: number, l2: number) {
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export function getReadableTextColor(
  hex: string,
  lightFallback = '#FFFFFF',
  darkFallback = '#0D0D0D'
) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return lightFallback;
  }

  const luminance = relativeLuminance(rgb);
  const contrastWithWhite = contrastRatio(luminance, 1);
  const contrastWithBlack = contrastRatio(luminance, 0);

  return contrastWithBlack >= contrastWithWhite ? darkFallback : lightFallback;
}

export function toRgba(hex: string, alpha: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return hex;
  }

  const normalizedAlpha = Math.min(Math.max(alpha, 0), 1);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${normalizedAlpha})`;
}
