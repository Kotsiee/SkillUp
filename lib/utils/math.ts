import { SignalLike } from '$fresh/src/types.ts';

export const normalise = (min: number, max: number, val: number): number => {
  return (val - min) / (max - min);
};

export const getPercentage = (min: number, max: number, val: number): number => {
  return normalise(min, max, val) * 100;
};

export const roundToStep = (value: number, step: number): number => {
  return Math.round(value / step) * step;
};

export function formatWithCommas(value: number): string {
  return value.toLocaleString('en-UK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export const parseNumber = (
  val: string | number | SignalLike<string | undefined> | undefined,
  fallback: number
): number => {
  const resolvedVal = typeof val === 'object' && 'value' in val ? val.value : val;
  const num = typeof resolvedVal === 'string' ? parseFloat(resolvedVal) : resolvedVal ?? NaN;
  return Number.isFinite(num) ? num : fallback;
};
