"use client";

import React, { useState } from "react";
import { InlineMath } from "react-katex";
import { combinations, normalPDF, stdNormalCDF, stdNormalP, toLatexFraction } from "./prob-utils";

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

  return (
    <div className="space-y-6">
      {/* 二項分布 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              二項分布 <InlineMath math="B(n, p)" /> と正規分布近似（p.65-69, p.77-78）
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              n を大きくすると二項分布がつりがね状の正規分布 <InlineMath math="N(np, npq)" /> に近づきます。
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => { setBinomN(10); setBinomPNum(1); setBinomPDen(2); setCompareNCurves(false); }} className="px-2.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">例13: B(10,1/2)</button>
            <button onClick={() => { setBinomN(5); setBinomPNum(1); setBinomPDen(3); setCompareNCurves(false); }} className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 rounded-lg">練習16: B(5,1/3)</button>
            <button onClick={() => { setBinomN(20); setBinomPNum(1); setBinomPDen(6); setCompareNCurves(true); }} className="px-2.5 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 rounded-lg border border-amber-200">研究: n比較</button>
            <button onClick={() => { setBinomN(90); setBinomPNum(1); setBinomPDen(3); setCompareNCurves(false); }} className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 rounded-lg">例題2: B(90,1/3)</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 p-4 rounded-xl border mb-5">
          <div className="md:col-span-5 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>試行回数 n = {binomN}</span>
              </div>
              <input type="range" min={3} max={100} value={binomN} onChange={(e) => { setBinomN(Number(e.target.value)); setCompareNCurves(false); }} className="w-full mt-1 accent-indigo-600" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold">p:</span>
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
            <div className="flex flex-wrap gap-3 pt-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                <input type="checkbox" checked={showNormalApprox} onChange={(e) => setShowNormalApprox(e.target.checked)} />
                正規分布曲線を重ねる
              </label>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 cursor-pointer">
                <input type="checkbox" checked={compareNCurves} onChange={(e) => setCompareNCurves(e.target.checked)} />
                n=10,20,30,50 比較
              </label>
            </div>
          </div>
          <div className="md:col-span-7 grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg border text-center">
              <div className="text-[11px] font-bold text-slate-500">E(X)=np</div>
              <div className="text-base font-extrabold text-indigo-700 mt-1"><InlineMath math={toLatexFraction(binomN * binomPNum, binomPDen)} /></div>
              <div className="text-xs text-slate-500">({binomMean.toFixed(2)})</div>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <div className="text-[11px] font-bold text-slate-500">V(X)=npq</div>
              <div className="text-base font-extrabold text-amber-700 mt-1">
                <InlineMath math={toLatexFraction(binomN * binomPNum * (binomPDen - binomPNum), binomPDen * binomPDen)} />
              </div>
              <div className="text-xs text-slate-500">({binomVar.toFixed(2)})</div>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <div className="text-[11px] font-bold text-slate-500">σ=√npq</div>
              <div className="text-base font-extrabold text-emerald-700 mt-1">{binomSd.toFixed(3)}</div>
              <div className="text-xs text-slate-500">N({binomMean.toFixed(1)}, {binomSd.toFixed(1)}²)</div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto bg-slate-50 rounded-xl border p-3">
          {(() => {
            const maxX = compareNCurves ? 25 : binomN;
            const maxY = compareNCurves ? 0.35 : Math.min(0.45, Math.max(0.18, 1.25 / Math.sqrt(2 * Math.PI * Math.max(0.01, binomN * p * q))));
            const xToPx = (r: number) => 55 + (r / maxX) * 690;
            const yToPx = (prob: number) => 230 - (prob / maxY) * 200;

            const calcBinomPoints = (nVal: number) => {
              const pts: { r: number; prob: number }[] = [];
              for (let r = 0; r <= Math.min(nVal, maxX); r++) {
                const prob = combinations(nVal, r) * Math.pow(p, r) * Math.pow(q, nVal - r);
                pts.push({ r, prob });
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

      {/* 正規分布標準化 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              正規分布 <InlineMath math="N(m, \sigma^2)" /> の標準化（p.72-76）
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              <InlineMath math="Z = (X-m)/\sigma" /> で標準正規分布に変換し、面積（確率）を求めます。
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => { setNormM(4); setNormSigma(3); setNormMode("between"); setNormRangeA(1); setNormRangeB(7); }} className="px-2.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">例題3: N(4,3²)</button>
            <button onClick={() => { setNormM(170.5); setNormSigma(5.4); setNormMode("greater"); setNormRangeA(178); setNormRangeB(185); }} className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">応用例題2: 身長</button>
            <button onClick={() => { setNormM(120); setNormSigma(10); setNormMode("between"); setNormRangeA(110); setNormRangeB(130); }} className="px-2.5 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 rounded-lg border border-amber-200">例題4: N(120,10²)</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-xl border mb-5">
          <div>
            <label className="block text-xs font-bold">平均 m</label>
            <input type="number" step="0.5" value={normM} onChange={(e) => setNormM(Number(e.target.value))} className="w-full mt-1 px-2.5 py-1.5 text-sm font-bold bg-white border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-bold">標準偏差 σ</label>
            <input type="number" step="0.2" min="0.1" value={normSigma} onChange={(e) => setNormSigma(Math.max(0.1, Number(e.target.value)))} className="w-full mt-1 px-2.5 py-1.5 text-sm font-bold bg-white border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-bold">範囲タイプ</label>
            <select value={normMode} onChange={(e) => setNormMode(e.target.value as "between" | "greater" | "less")} className="w-full mt-1 px-2 py-1.5 text-xs font-bold bg-white border rounded-lg">
              <option value="between">a ≦ X ≦ b</option>
              <option value="greater">X ≧ a</option>
              <option value="less">X ≦ b</option>
            </select>
          </div>
          {normMode !== "less" && (
            <div>
              <label className="block text-xs font-bold text-indigo-700">下限 a</label>
              <input type="number" step="0.5" value={normRangeA} onChange={(e) => setNormRangeA(Number(e.target.value))} className="w-full mt-1 px-2.5 py-1.5 text-sm font-bold bg-white border border-indigo-300 rounded-lg" />
            </div>
          )}
          {normMode !== "greater" && (
            <div>
              <label className="block text-xs font-bold text-indigo-700">上限 b</label>
              <input type="number" step="0.5" value={normRangeB} onChange={(e) => setNormRangeB(Number(e.target.value))} className="w-full mt-1 px-2.5 py-1.5 text-sm font-bold bg-white border border-indigo-300 rounded-lg" />
            </div>
          )}
        </div>

        {(() => {
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 bg-slate-50 rounded-xl border p-3 overflow-x-auto">
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

              <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border space-y-3 text-xs">
                <h4 className="text-sm font-bold border-b pb-2">標準化の計算ステップ</h4>
                <div className="bg-white p-3 rounded-lg border space-y-1.5">
                  <div className="font-bold text-indigo-800">Step 1: 標準化</div>
                  <div><InlineMath math={`Z = \\dfrac{X - ${normM}}{${normSigma}}`} /> → N(0,1)</div>
                </div>
                <div className="bg-white p-3 rounded-lg border space-y-1.5">
                  <div className="font-bold text-emerald-800">Step 2: 境界を Z に変換</div>
                  {normMode !== "less" && (
                    <div>
                      <InlineMath math={`X=${normRangeA}\\Rightarrow Z\\approx${zA.toFixed(2)}`} />
                      <span className="ml-2 text-slate-500">p≈{stdNormalP(zA).toFixed(4)}</span>
                    </div>
                  )}
                  {normMode !== "greater" && (
                    <div>
                      <InlineMath math={`X=${normRangeB}\\Rightarrow Z\\approx${zB.toFixed(2)}`} />
                      <span className="ml-2 text-slate-500">p≈{stdNormalP(zB).toFixed(4)}</span>
                    </div>
                  )}
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <div className="font-bold text-emerald-900 mb-1">Step 3: 確率</div>
                  <div className="text-base font-extrabold text-emerald-950">{prob.toFixed(4)} （約 {(prob * 100).toFixed(1)}%）</div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
