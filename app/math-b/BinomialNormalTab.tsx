"use client";

import React, { useState } from "react";
import { InlineMath } from "react-katex";
import { combinations, normalPDF, stdNormalCDF, stdNormalP } from "./prob-utils";
import { SplitPane } from "../components/SplitLayout";

export default function BinomialNormalTab() {
  const [binomN, setBinomN] = useState(20);
  const [binomPNum, setBinomPNum] = useState(1);
  const [binomPDen, setBinomPDen] = useState(6);
  const [showNormalApprox, setShowNormalApprox] = useState(true);
  const [compareNCurves, setCompareNCurves] = useState(false);

  const [normM, setNormM] = useState(170.5);
  const [normSigma, setNormSigma] = useState(5.4);
  const [normRangeA, setNormRangeA] = useState(165.0);
  const [normRangeB, setNormRangeB] = useState(178.0);
  const [normMode, setNormMode] = useState<"between" | "greater" | "less">("greater");

  const p = binomPNum / binomPDen;
  const q = 1 - p;
  const binomMean = binomN * p;
  const binomVar = binomN * p * q;
  const binomSd = Math.sqrt(binomVar);

  const zA = normMode === "less" ? -4 : (normRangeA - normM) / normSigma;
  const zB = normMode === "greater" ? 4 : (normRangeB - normM) / normSigma;
  const zLow = Math.min(zA, zB);
  const zHigh = Math.max(zA, zB);
  const prob =
    normMode === "greater"
      ? 1 - stdNormalCDF(zA)
      : normMode === "less"
      ? stdNormalCDF(zB)
      : Math.max(0, stdNormalCDF(zHigh) - stdNormalCDF(zLow));

  return (
    <SplitPane>
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">二項分布 B(n, p)</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button onClick={() => { setBinomN(10); setBinomPNum(1); setBinomPDen(2); setCompareNCurves(false); }} className="px-2 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">例13</button>
              <button onClick={() => { setBinomN(5); setBinomPNum(1); setBinomPDen(3); setCompareNCurves(false); }} className="px-2 py-1 text-xs font-semibold bg-slate-100 rounded-lg">練習16</button>
              <button onClick={() => { setBinomN(20); setBinomPNum(1); setBinomPDen(6); setCompareNCurves(true); }} className="px-2 py-1 text-xs font-semibold bg-amber-50 text-amber-800 rounded-lg border">n比較</button>
              <button onClick={() => { setBinomN(90); setBinomPNum(1); setBinomPDen(3); setCompareNCurves(false); }} className="px-2 py-1 text-xs font-semibold bg-slate-100 rounded-lg">例題2</button>
            </div>
            <div className="text-xs font-bold mb-1">試行回数 n = {binomN}</div>
            <input type="range" min={3} max={100} value={binomN} onChange={(e) => { setBinomN(Number(e.target.value)); setCompareNCurves(false); }} className="w-full accent-indigo-600 mb-3" />
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-xs font-bold self-center">p:</span>
              {[
                { num: 1, den: 6, label: "1/6" },
                { num: 1, den: 3, label: "1/3" },
                { num: 1, den: 2, label: "1/2" },
                { num: 2, den: 3, label: "2/3" },
              ].map((pr) => (
                <button
                  key={pr.label}
                  onClick={() => { setBinomPNum(pr.num); setBinomPDen(pr.den); }}
                  className={`px-2 py-1 text-xs font-semibold rounded border ${binomPNum === pr.num && binomPDen === pr.den ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-slate-300"}`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer mb-1">
              <input type="checkbox" checked={showNormalApprox} onChange={(e) => setShowNormalApprox(e.target.checked)} />
              正規分布曲線を重ねる
            </label>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 cursor-pointer">
              <input type="checkbox" checked={compareNCurves} onChange={(e) => setCompareNCurves(e.target.checked)} />
              n=10,20,30,50 比較
            </label>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
              <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                <div className="font-bold text-slate-500">E=np</div>
                <div className="font-extrabold text-indigo-700">{binomMean.toFixed(2)}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                <div className="font-bold text-slate-500">V=npq</div>
                <div className="font-extrabold text-amber-700">{binomVar.toFixed(2)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                <div className="font-bold text-slate-500">σ</div>
                <div className="font-extrabold text-emerald-700">{binomSd.toFixed(3)}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">正規分布の標準化</h3>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => { setNormM(4); setNormSigma(3); setNormMode("between"); setNormRangeA(1); setNormRangeB(7); }} className="px-2 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg border">例題3</button>
              <button onClick={() => { setNormM(170.5); setNormSigma(5.4); setNormMode("greater"); setNormRangeA(178); setNormRangeB(185); }} className="px-2 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 rounded-lg border">応用例題2</button>
              <button onClick={() => { setNormM(120); setNormSigma(10); setNormMode("between"); setNormRangeA(110); setNormRangeB(130); }} className="px-2 py-1 text-xs font-semibold bg-amber-50 text-amber-800 rounded-lg border">例題4</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold">平均 m</label>
                <input type="number" step="0.5" value={normM} onChange={(e) => setNormM(Number(e.target.value))} className="w-full mt-1 px-2 py-1.5 text-sm font-bold bg-white border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold">標準偏差 σ</label>
                <input type="number" step="0.2" min="0.1" value={normSigma} onChange={(e) => setNormSigma(Math.max(0.1, Number(e.target.value)))} className="w-full mt-1 px-2 py-1.5 text-sm font-bold bg-white border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold">範囲タイプ</label>
              <select value={normMode} onChange={(e) => setNormMode(e.target.value as "between" | "greater" | "less")} className="w-full mt-1 px-2 py-1.5 text-xs font-bold bg-white border rounded-lg">
                <option value="between">a ≦ X ≦ b</option>
                <option value="greater">X ≧ a</option>
                <option value="less">X ≦ b</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {normMode !== "less" && (
                <div>
                  <label className="block text-xs font-bold text-indigo-700">下限 a</label>
                  <input type="number" step="0.5" value={normRangeA} onChange={(e) => setNormRangeA(Number(e.target.value))} className="w-full mt-1 px-2 py-1.5 text-sm font-bold bg-white border border-indigo-300 rounded-lg" />
                </div>
              )}
              {normMode !== "greater" && (
                <div>
                  <label className="block text-xs font-bold text-indigo-700">上限 b</label>
                  <input type="number" step="0.5" value={normRangeB} onChange={(e) => setNormRangeB(Number(e.target.value))} className="w-full mt-1 px-2 py-1.5 text-sm font-bold bg-white border border-indigo-300 rounded-lg" />
                </div>
              )}
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-emerald-900">標準化の結果</div>
              <div><InlineMath math={`Z = \\dfrac{X - ${normM}}{${normSigma}}`} /></div>
              {normMode !== "less" && <div><InlineMath math={`X=${normRangeA}\\Rightarrow Z\\approx${zA.toFixed(2)}`} /> <span className="text-slate-500">p≈{stdNormalP(zA).toFixed(4)}</span></div>}
              {normMode !== "greater" && <div><InlineMath math={`X=${normRangeB}\\Rightarrow Z\\approx${zB.toFixed(2)}`} /> <span className="text-slate-500">p≈{stdNormalP(zB).toFixed(4)}</span></div>}
              <div className="text-base font-extrabold text-emerald-950 pt-1">{prob.toFixed(4)} （約 {(prob * 100).toFixed(1)}%）</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full min-h-[280px] w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            二項分布 <InlineMath math="B(n, p)" /> のグラフ
          </h3>
          <div className="w-full overflow-x-auto bg-slate-50 rounded-xl border p-3">
            {(() => {
              const maxX = compareNCurves ? 25 : binomN;
              const maxY = compareNCurves ? 0.35 : Math.min(0.45, Math.max(0.18, 1.25 / Math.sqrt(2 * Math.PI * Math.max(0.01, binomN * p * q))));
              const xToPx = (r: number) => 55 + (r / maxX) * 690;
              const yToPx = (probY: number) => 230 - (probY / maxY) * 200;

              const calcBinomPoints = (nVal: number) => {
                const pts: { r: number; prob: number }[] = [];
                for (let r = 0; r <= Math.min(nVal, maxX); r++) {
                  const pr = combinations(nVal, r) * Math.pow(p, r) * Math.pow(q, nVal - r);
                  pts.push({ r, prob: pr });
                }
                return pts;
              };

              const calcNormalPath = (nVal: number) => {
                const m = nVal * p;
                const s = Math.sqrt(nVal * p * q);
                const dArr: string[] = [];
                for (let step = 0; step <= 200; step++) {
                  const xVal = (step / 200) * maxX;
                  const yVal = normalPDF(xVal, m, s);
                  dArr.push(`${step === 0 ? "M" : "L"} ${xToPx(xVal).toFixed(1)} ${yToPx(yVal).toFixed(1)}`);
                }
                return dArr.join(" ");
              };

              const currentPoints = calcBinomPoints(binomN);

              return (
                <svg viewBox="0 0 780 265" className="w-full min-w-[640px] h-auto">
                  {[0.1, 0.2, 0.3].filter((v) => v <= maxY).map((yVal) => (
                    <g key={`gy-${yVal}`}>
                      <line x1={55} y1={yToPx(yVal)} x2={745} y2={yToPx(yVal)} stroke="#cbd5e1" strokeDasharray="3 3" />
                      <text x={48} y={yToPx(yVal) + 4} textAnchor="end" fontSize="10" fill="#475569">{yVal.toFixed(1)}</text>
                    </g>
                  ))}
                  <line x1={55} y1={20} x2={55} y2={230} stroke="#334155" strokeWidth="1.5" />
                  <line x1={55} y1={230} x2={755} y2={230} stroke="#334155" strokeWidth="1.5" />
                  <text x={35} y={25} fontSize="11" fontWeight="bold" fill="#334155">P(X=r)</text>
                  <text x={755} y={248} fontSize="11" fontWeight="bold" fill="#334155">r</text>
                  {Array.from({ length: maxX + 1 })
                    .filter((_, r) => maxX <= 20 || r % 5 === 0)
                    .map((_, idx) => {
                      const r = maxX <= 20 ? idx : idx * 5;
                      return (
                        <g key={`rx-${r}`} transform={`translate(${xToPx(r)}, 230)`}>
                          <line y1={0} y2={5} stroke="#334155" />
                          <text y={16} textAnchor="middle" fontSize="10" fill="#475569">{r}</text>
                        </g>
                      );
                    })}
                  {compareNCurves ? (
                    [
                      { n: 10, color: "#2563eb" },
                      { n: 20, color: "#059669" },
                      { n: 30, color: "#d97706" },
                      { n: 50, color: "#dc2626" },
                    ].map((cfg) => {
                      const pts = calcBinomPoints(cfg.n);
                      const polyPoints = pts.map((pt) => `${xToPx(pt.r)},${yToPx(pt.prob)}`).join(" ");
                      return (
                        <g key={`multi-${cfg.n}`}>
                          {showNormalApprox && <path d={calcNormalPath(cfg.n)} fill="none" stroke={cfg.color} strokeWidth="2.5" opacity={0.45} />}
                          <polyline fill="none" stroke={cfg.color} strokeWidth="1.8" points={polyPoints} />
                          {pts.map((pt) => (
                            <circle key={`c-${cfg.n}-${pt.r}`} cx={xToPx(pt.r)} cy={yToPx(pt.prob)} r={3.2} fill={cfg.color} />
                          ))}
                          {pts.length > 0 && (
                            <text x={xToPx(Math.round(cfg.n * p))} y={yToPx(Math.max(...pts.map((x) => x.prob))) - 8} textAnchor="middle" fontSize="11" fontWeight="bold" fill={cfg.color}>
                              n={cfg.n}
                            </text>
                          )}
                        </g>
                      );
                    })
                  ) : (
                    <g>
                      {currentPoints.map((pt) => {
                        const barW = Math.max(3, Math.min(22, 500 / (maxX + 1)));
                        const topY = yToPx(pt.prob);
                        return (
                          <rect key={`bbar-${pt.r}`} x={xToPx(pt.r) - barW / 2} y={topY} width={barW} height={Math.max(0, 230 - topY)} fill="#93c5fd" opacity={0.5} />
                        );
                      })}
                      <polyline fill="none" stroke="#1d4ed8" strokeWidth="2" points={currentPoints.map((pt) => `${xToPx(pt.r)},${yToPx(pt.prob)}`).join(" ")} />
                      {currentPoints.map((pt) => (
                        <circle key={`pt-${pt.r}`} cx={xToPx(pt.r)} cy={yToPx(pt.prob)} r={3.5} fill="#1e40af" />
                      ))}
                      {showNormalApprox && <path d={calcNormalPath(binomN)} fill="none" stroke="#dc2626" strokeWidth="2.5" />}
                      <line x1={xToPx(binomN * p)} y1={20} x2={xToPx(binomN * p)} y2={230} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x={xToPx(binomN * p)} y={15} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">
                        np = {(binomN * p).toFixed(1)}
                      </text>
                    </g>
                  )}
                </svg>
              );
            })()}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            正規分布 <InlineMath math="N(m, \sigma^2)" /> と標準正規分布
          </h3>
          {(() => {
            const zToSvgX = (z: number) => 400 + (z / 3.8) * 340;
            const stdPdfH = (z: number) => (normalPDF(z, 0, 1) / 0.4) * 80;
            const buildCurve = (baseY: number) => {
              const pts: string[] = [];
              for (let i = -38; i <= 38; i++) {
                const z = i / 10;
                pts.push(`${i === -38 ? "M" : "L"} ${zToSvgX(z).toFixed(1)} ${(baseY - stdPdfH(z)).toFixed(1)}`);
              }
              return pts.join(" ");
            };
            const buildArea = (baseY: number) => {
              const startZ = Math.max(-3.8, Math.min(3.8, zLow));
              const endZ = Math.max(-3.8, Math.min(3.8, zHigh));
              if (endZ <= startZ) return "";
              const pts: string[] = [`M ${zToSvgX(startZ).toFixed(1)} ${baseY}`];
              for (let i = 0; i <= 50; i++) {
                const z = startZ + ((endZ - startZ) * i) / 50;
                pts.push(`L ${zToSvgX(z).toFixed(1)} ${(baseY - stdPdfH(z)).toFixed(1)}`);
              }
              pts.push(`L ${zToSvgX(endZ).toFixed(1)} ${baseY} Z`);
              return pts.join(" ");
            };
            return (
              <div className="bg-slate-50 rounded-xl border p-3 overflow-x-auto">
                <svg viewBox="0 0 800 280" className="w-full min-w-[580px] h-auto">
                  <text x={20} y={22} fontSize="12" fontWeight="bold" fill="#1e40af">① X ～ N({normM}, {normSigma}²)</text>
                  <path d={buildArea(115)} fill="#93c5fd" opacity={0.75} />
                  <path d={buildCurve(115)} fill="none" stroke="#1d4ed8" strokeWidth="2.5" />
                  <line x1={50} y1={115} x2={750} y2={115} stroke="#334155" strokeWidth="1.5" />
                  {[-3, -2, -1, 0, 1, 2, 3].map((k) => {
                    const xVal = normM + k * normSigma;
                    const sx = zToSvgX(k);
                    return (
                      <g key={`xm-${k}`} transform={`translate(${sx}, 115)`}>
                        <line y1={-4} y2={4} stroke="#475569" />
                        <text y={15} textAnchor="middle" fontSize="10" fontWeight={k === 0 ? "bold" : "normal"} fill="#334155">
                          {Number.isInteger(xVal) ? xVal : xVal.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}
                  {normMode !== "less" && Math.abs(zA) <= 3.8 && (
                    <line x1={zToSvgX(zA)} y1={115} x2={zToSvgX(zA)} y2={245} stroke="#059669" strokeWidth="2" strokeDasharray="4 3" />
                  )}
                  {normMode !== "greater" && Math.abs(zB) <= 3.8 && (
                    <line x1={zToSvgX(zB)} y1={115} x2={zToSvgX(zB)} y2={245} stroke="#059669" strokeWidth="2" strokeDasharray="4 3" />
                  )}
                  <text x={20} y={160} fontSize="12" fontWeight="bold" fill="#047857">② Z ～ N(0, 1)</text>
                  <path d={buildArea(245)} fill="#6ee7b7" opacity={0.8} />
                  <path d={buildCurve(245)} fill="none" stroke="#059669" strokeWidth="2.5" />
                  <line x1={50} y1={245} x2={750} y2={245} stroke="#334155" strokeWidth="1.5" />
                  {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
                    <g key={`zm-${k}`} transform={`translate(${zToSvgX(k)}, 245)`}>
                      <line y1={-4} y2={4} stroke="#475569" />
                      <text y={15} textAnchor="middle" fontSize="10" fontWeight={k === 0 ? "bold" : "normal"} fill="#065f46">z={k}</text>
                    </g>
                  ))}
                  <text x={400} y={220} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#064e3b">
                    面積（確率） = {prob.toFixed(4)} （約 {(prob * 100).toFixed(1)}%）
                  </text>
                </svg>
              </div>
            );
          })()}
        </div>
      </div>
    </SplitPane>
  );
}
