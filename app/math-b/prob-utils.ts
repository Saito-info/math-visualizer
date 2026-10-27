// 数学B：確率分布ユーティリティ

export const gcd = (a: number, b: number): number => {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
};

export const combinations = (n: number, r: number): number => {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  let res = 1;
  for (let i = 1; i <= r; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return Math.round(res);
};

export const toLatexFraction = (num: number, den: number, simplify = true): string => {
  if (den === 0 || num === 0) return "0";
  const sign = (num < 0) !== (den < 0) ? "-" : "";
  const absNum = Math.abs(Math.round(num));
  const absDen = Math.abs(Math.round(den));
  const g = simplify ? gcd(absNum, absDen) : 1;
  const n = absNum / g;
  const d = absDen / g;
  if (d === 1) return `${sign}${n}`;
  return `${sign}\\frac{${n}}{${d}}`;
};

export const erf = (x: number): number => {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
};

export const stdNormalP = (u: number): number => 0.5 * erf(Math.abs(u) / Math.sqrt(2));

export const stdNormalCDF = (z: number): number => 0.5 * (1 + erf(z / Math.sqrt(2)));

export const normalPDF = (x: number, m: number, sigma: number): number => {
  if (sigma <= 0) return 0;
  const z = (x - m) / sigma;
  return (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-0.5 * z * z);
};

export interface ProbItem {
  x: number;
  num: number;
  den: number;
  p: number;
  label?: string;
}

export type ProbTabType = "transform" | "simulation" | "sum_product" | "binomial_normal";
