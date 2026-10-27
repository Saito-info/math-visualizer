"use client";

import React, { useMemo, useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import { ProbItem, toLatexFraction } from "./prob-utils";
import { SplitPane } from "../components/SplitLayout";

type BaseDistType = "dice1" | "coin2" | "balls_ex1" | "prac6" | "prac8";

export default function TransformTab() {
  const [baseDistType, setBaseDistType] = useState<BaseDistType>("dice1");
  const [paramA, setParamA] = useState(2);
  const [paramB, setParamB] = useState(1);
  const [showStepByStep, setShowStepByStep] = useState(true);
  const [showVarianceSquares, setShowVarianceSquares] = useState(false);

  const baseDistribution: { title: string; desc: string; items: ProbItem[] } = useMemo(() => {
    switch (baseDistType) {
      case "dice1":
        return {
          title: "1個のさいころの出る目 X（例2, 例3, 例6, 例7, 例8）",
          desc: "1個のさいころを投げるとき、出る目を X とする。",
          items: [1, 2, 3, 4, 5, 6].map((x) => ({ x, num: 1, den: 6, p: 1 / 6 })),
        };
      case "coin2":
        return {
          title: "2枚の硬貨の表の枚数 X（例1, 例5）",
          desc: "2枚の硬貨を同時に投げるとき、表が出る枚数を X とする。",
          items: [
            { x: 0, num: 1, den: 4, p: 0.25 },
            { x: 1, num: 2, den: 4, p: 0.5 },
            { x: 2, num: 1, den: 4, p: 0.25 },
          ],
        };
      case "balls_ex1":
        return {
          title: "袋から取り出す白玉の個数 X（例題1・練習6）",
          desc: "白玉2個と黒玉3個の入った袋から3個の玉を同時に取り出すとき、出る白玉の個数を X とする。",
          items: [
            { x: 0, num: 1, den: 10, p: 0.1 },
            { x: 1, num: 6, den: 10, p: 0.6 },
            { x: 2, num: 3, den: 10, p: 0.3 },
          ],
        };
      case "prac6":
        return {
          title: "白玉4個・黒玉2個から2個取り出す白玉の数 X（練習3）",
          desc: "白玉4個と黒玉2個の入った袋から2個の玉を同時に取り出すとき、出る白玉の個数を X とする。",
          items: [
            { x: 0, num: 1, den: 15, p: 1 / 15 },
            { x: 1, num: 8, den: 15, p: 8 / 15 },
            { x: 2, num: 6, den: 15, p: 6 / 15 },
          ],
        };
      case "prac8":
        return {
          title: "非対称な確率分布 X（練習8）",
          desc: "P(X=0)=2/6, P(X=1)=1/6, P(X=2)=3/6 で与えられる確率変数 X。",
          items: [
            { x: 0, num: 2, den: 6, p: 2 / 6 },
            { x: 1, num: 1, den: 6, p: 1 / 6 },
            { x: 2, num: 3, den: 6, p: 3 / 6 },
          ],
        };
    }
  }, [baseDistType]);

  const statsTransform = useMemo(() => {
    const items = baseDistribution.items;
    const den = items[0].den;
    const exNum = items.reduce((acc, cur) => acc + cur.x * cur.num, 0);
    const ex = exNum / den;
    const ex2Num = items.reduce((acc, cur) => acc + cur.x * cur.x * cur.num, 0);
    const ex2 = ex2Num / den;
    const vxNum = ex2Num * den - exNum * exNum;
    const vxDen = den * den;
    const vx = ex2 - ex * ex;
    const sx = Math.sqrt(Math.max(0, vx));
    const eax = paramA * ex;
    const sax = Math.abs(paramA) * sx;
    const ey = paramA * ex + paramB;
    const vy = paramA * paramA * vx;
    const sy = Math.abs(paramA) * sx;
    return { den, exNum, ex, ex2Num, vxNum, vxDen, vx, sx, eax, sax, ey, vy, sy };
  }, [baseDistribution, paramA, paramB]);

  const numberLineBounds = useMemo(() => {
    const xs = baseDistribution.items.map((i) => i.x);
    const axs = xs.map((x) => paramA * x);
    const ys = xs.map((x) => paramA * x + paramB);
    const allVals = [
      ...xs, ...axs, ...ys, 0,
      statsTransform.ex - statsTransform.sx,
      statsTransform.ex + statsTransform.sx,
      statsTransform.ey - statsTransform.sy,
      statsTransform.ey + statsTransform.sy,
    ];
    const minVal = Math.floor(Math.min(...allVals)) - 1;
    const maxVal = Math.ceil(Math.max(...allVals)) + 1;
    const span = Math.max(4, maxVal - minVal);
    return { minVal, maxVal, span };
  }, [baseDistribution, paramA, paramB, statsTransform]);

  const valToSvgX = (v: number) => {
    const { minVal, span } = numberLineBounds;
    return 60 + ((v - minVal) / span) * 680;
  };

  const tickStep = useMemo(() => {
    const { span } = numberLineBounds;
    if (span <= 16) return 1;
    if (span <= 35) return 2;
    if (span <= 80) return 5;
    return 10;
  }, [numberLineBounds]);

  const ticks = useMemo(() => {
    const { minVal, maxVal } = numberLineBounds;
    const start = Math.ceil(minVal / tickStep) * tickStep;
    const arr: number[] = [];
    for (let v = start; v <= maxVal; v += tickStep) arr.push(v);
    return arr;
  }, [numberLineBounds, tickStep]);

  const applyPreset = (type: BaseDistType, a: number, b: number) => {
    setBaseDistType(type);
    setParamA(a);
    setParamB(b);
  };

  return (
    <SplitPane>
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              1. もとの確率変数 <InlineMath math="X" /> の分布
            </label>
            <select
              value={baseDistType}
              onChange={(e) => setBaseDistType(e.target.value as BaseDistType)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="dice1">1個のさいころの出る目 X</option>
              <option value="coin2">2枚の硬貨の表の枚数 X</option>
              <option value="balls_ex1">袋(白2, 黒3)から3個・白玉の数 X</option>
              <option value="prac6">袋(白4, 黒2)から2個・白玉の数 X</option>
              <option value="prac8">非対称な確率分布 X</option>
            </select>
            <p className="text-xs text-slate-500 mt-1.5">{baseDistribution.desc}</p>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-600 mb-2">教科書プリセット</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "例3・例8: 2X+1", a: 2, b: 1 },
                { label: "練習4(1): X+2", a: 1, b: 2 },
                { label: "練習4(2): 4X-1", a: 4, b: -1 },
                { label: "練習4(3): -3X", a: -3, b: 0 },
                { label: "練習9(1): X+4", a: 1, b: 4 },
                { label: "練習9(2): -2X", a: -2, b: 0 },
                { label: "練習9(3): 3X-2", a: 3, b: -2 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset("dice1", p.a, p.b)}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm font-bold text-slate-800">2. 変換式 <InlineMath math="Y = aX + b" /></span>
              <span className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg text-sm">
                Y = {paramA === 1 ? "" : paramA === -1 ? "-" : paramA}X{paramB > 0 ? ` + ${paramB}` : paramB < 0 ? ` − ${Math.abs(paramB)}` : ""}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-700">かけ算 a = <strong>{paramA}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min={-3} max={4} step={0.5} value={paramA} onChange={(e) => setParamA(parseFloat(e.target.value))} className="w-full accent-amber-600" />
                <button onClick={() => setParamA(1)} className="px-2 py-1 text-xs bg-white border border-slate-300 rounded shrink-0">a=1</button>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-700">足し算 b = <strong>{paramB >= 0 ? `+${paramB}` : paramB}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min={-6} max={8} step={0.5} value={paramB} onChange={(e) => setParamB(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
                <button onClick={() => setParamB(0)} className="px-2 py-1 text-xs bg-white border border-slate-300 rounded shrink-0">b=0</button>
              </div>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" checked={showStepByStep} onChange={(e) => setShowStepByStep(e.target.checked)} className="rounded text-indigo-600" />
              途中経過（aX）の数直線も表示
            </label>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3">
              <div className="text-xs font-bold text-blue-700 mb-1">期待値</div>
              <div className="text-center bg-white py-1.5 rounded border border-blue-100 text-sm"><InlineMath math="E(aX+b)=aE(X)+b" /></div>
              <div className="text-xs mt-2 font-medium"><InlineMath math={`E(Y)=${statsTransform.ey.toFixed(2)}`} /></div>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
              <div className="text-xs font-bold text-amber-800 mb-1">分散</div>
              <div className="text-center bg-white py-1.5 rounded border border-amber-100 text-sm"><InlineMath math="V(aX+b)=a^2 V(X)" /></div>
              <div className="text-xs mt-2 font-medium"><InlineMath math={`V(Y)\\approx${statsTransform.vy.toFixed(2)}`} /></div>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
              <div className="text-xs font-bold text-emerald-800 mb-1">標準偏差</div>
              <div className="text-center bg-white py-1.5 rounded border border-emerald-100 text-sm"><InlineMath math="\sigma(aX+b)=|a|\sigma(X)" /></div>
              <div className="text-xs mt-2 font-medium"><InlineMath math={`\\sigma(Y)\\approx${statsTransform.sy.toFixed(3)}`} /></div>
            </div>
          </div>

          <button
            onClick={() => setShowVarianceSquares(!showVarianceSquares)}
            className="w-full px-3 py-1.5 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg"
          >
            {showVarianceSquares ? "▲ 正方形イメージを閉じる" : "▼ なぜ分散は a² 倍？"}
          </button>
          {showVarianceSquares && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-xs text-slate-700 space-y-2">
              <div className="bg-white p-2 rounded border border-amber-200">
                <BlockMath math="\{(aX+b)-(am+b)\}^2 = a^2(X-m)^2" />
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs bg-white rounded-lg overflow-hidden border border-slate-200">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="py-1.5 px-2 font-bold text-blue-800 border-r">X</th>
                  {baseDistribution.items.map((item, idx) => (
                    <td key={`th-x-${idx}`} className="py-1.5 px-2 font-bold text-blue-700 border-r">{item.x}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-emerald-50/60 border-b">
                  <th className="py-1.5 px-2 font-bold text-emerald-800 border-r">Y</th>
                  {baseDistribution.items.map((item, idx) => (
                    <td key={`td-y-${idx}`} className="py-1.5 px-2 font-bold text-emerald-700 border-r">{paramA * item.x + paramB}</td>
                  ))}
                </tr>
                <tr>
                  <th className="py-1.5 px-2 font-bold border-r bg-slate-50">P</th>
                  {baseDistribution.items.map((item, idx) => (
                    <td key={`td-p-${idx}`} className="py-1.5 px-2 border-r"><InlineMath math={toLatexFraction(item.num, item.den, false)} /></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="h-full min-h-[280px] w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative flex flex-col p-4">
        <div className="mb-2 shrink-0">
          <h2 className="text-sm font-bold text-slate-900">数直線で見る期待値と標準偏差</h2>
          <p className="text-xs text-slate-600">青: X ／ オレンジ: aX ／ 緑: aX+b</p>
        </div>
        <div className="flex-1 min-h-0 w-full overflow-x-auto bg-slate-50 rounded-xl border border-slate-200 p-3">
          <svg viewBox={`0 0 800 ${showStepByStep ? 390 : 270}`} className="w-full min-w-[680px] h-auto select-none">
            <defs>
              <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
              </marker>
              <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
              </marker>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" />
              </marker>
            </defs>

            {ticks.map((t) => {
              const xPos = valToSvgX(t);
              const isZero = Math.abs(t) < 1e-9;
              return (
                <g key={`grid-${t}`}>
                  <line x1={xPos} y1={20} x2={xPos} y2={showStepByStep ? 360 : 240} stroke={isZero ? "#94a3b8" : "#e2e8f0"} strokeWidth={isZero ? 2 : 1} strokeDasharray={isZero ? "none" : "3 3"} />
                  {isZero && <text x={xPos} y={15} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#64748b">原点 0</text>}
                </g>
              );
            })}

            {baseDistribution.items.map((item, idx) => {
              const x1 = valToSvgX(item.x);
              const x2 = valToSvgX(paramA * item.x);
              const x3 = valToSvgX(paramA * item.x + paramB);
              if (showStepByStep) {
                return (
                  <g key={`conn-${idx}`} opacity={0.55}>
                    <path d={`M ${x1} 80 C ${x1} 135, ${x2} 145, ${x2} 200`} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                    <path d={`M ${x2} 200 C ${x2} 255, ${x3} 265, ${x3} 320`} fill="none" stroke="#10b981" strokeWidth="2" />
                  </g>
                );
              }
              return (
                <g key={`conn-${idx}`} opacity={0.55}>
                  <path d={`M ${x1} 80 C ${x1} 135, ${x3} 145, ${x3} 200`} fill="none" stroke="#10b981" strokeWidth="2" />
                </g>
              );
            })}

            {(() => {
              const exPos = valToSvgX(statsTransform.ex);
              const eaxPos = valToSvgX(statsTransform.eax);
              const eyPos = valToSvgX(statsTransform.ey);
              if (showStepByStep) {
                return (
                  <g>
                    <line x1={exPos} y1={95} x2={eaxPos} y2={185} stroke="#d97706" strokeWidth="2.5" markerEnd="url(#arrow-amber)" />
                    <line x1={eaxPos} y1={215} x2={eyPos} y2={305} stroke="#059669" strokeWidth="2.5" markerEnd="url(#arrow-emerald)" />
                  </g>
                );
              }
              return <line x1={exPos} y1={95} x2={eyPos} y2={185} stroke="#059669" strokeWidth="2.5" markerEnd="url(#arrow-emerald)" />;
            })()}

            {/* X 数直線 */}
            <g transform="translate(0, 80)">
              <text x={12} y={-35} fontSize="13" fontWeight="bold" fill="#1e40af">① もとの確率変数 X</text>
              <line x1={45} y1={0} x2={760} y2={0} stroke="#334155" strokeWidth="2" />
              {ticks.map((t) => (
                <g key={`t1-${t}`} transform={`translate(${valToSvgX(t)}, 0)`}>
                  <line y1={-4} y2={4} stroke="#334155" strokeWidth="1.5" />
                  <text y={16} textAnchor="middle" fontSize="10" fill="#475569">{t}</text>
                </g>
              ))}
              {baseDistribution.items.map((item, i) => {
                const cx = valToSvgX(item.x);
                const barH = Math.max(8, item.p * 65);
                return (
                  <g key={`x-pt-${i}`} transform={`translate(${cx}, 0)`}>
                    <rect x={-7} y={-barH} width={14} height={barH} rx={3} fill="#93c5fd" opacity={0.85} stroke="#2563eb" strokeWidth="1" />
                    <circle cx={0} cy={0} r={5.5} fill="#1d4ed8" stroke="#fff" strokeWidth="1.5" />
                    <text y={-barH - 5} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e3a8a">x={item.x}</text>
                  </g>
                );
              })}
              {(() => {
                const exX = valToSvgX(statsTransform.ex);
                const leftS = valToSvgX(statsTransform.ex - statsTransform.sx);
                const rightS = valToSvgX(statsTransform.ex + statsTransform.sx);
                return (
                  <g>
                    <rect x={leftS} y={-30} width={Math.max(0, rightS - leftS)} height={8} fill="#dbeafe" opacity={0.7} />
                    <line x1={leftS} y1={-26} x2={rightS} y2={-26} stroke="#2563eb" strokeWidth="2.5" markerStart="url(#arrow-blue)" markerEnd="url(#arrow-blue)" />
                    <text x={exX} y={-33} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1d4ed8">σ(X) = {statsTransform.sx.toFixed(2)}</text>
                    <polygon points={`${exX},2 ${exX - 7},14 ${exX + 7},14`} fill="#dc2626" />
                    <text x={exX} y={27} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">E(X) = {statsTransform.ex.toFixed(2)}</text>
                  </g>
                );
              })()}
            </g>

            {showStepByStep && (
              <g transform="translate(0, 200)">
                <text x={12} y={-35} fontSize="13" fontWeight="bold" fill="#b45309">② かけ算 aX（a={paramA}）</text>
                <line x1={45} y1={0} x2={760} y2={0} stroke="#334155" strokeWidth="2" />
                {ticks.map((t) => (
                  <g key={`t2-${t}`} transform={`translate(${valToSvgX(t)}, 0)`}>
                    <line y1={-4} y2={4} stroke="#334155" strokeWidth="1.5" />
                    <text y={16} textAnchor="middle" fontSize="10" fill="#475569">{t}</text>
                  </g>
                ))}
                {baseDistribution.items.map((item, i) => {
                  const val = paramA * item.x;
                  const cx = valToSvgX(val);
                  const barH = Math.max(8, item.p * 65);
                  return (
                    <g key={`ax-pt-${i}`} transform={`translate(${cx}, 0)`}>
                      <rect x={-7} y={-barH} width={14} height={barH} rx={3} fill="#fde68a" opacity={0.9} stroke="#d97706" strokeWidth="1" />
                      <circle cx={0} cy={0} r={5.5} fill="#d97706" stroke="#fff" strokeWidth="1.5" />
                      <text y={-barH - 5} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400e">{val}</text>
                    </g>
                  );
                })}
                {(() => {
                  const eaxX = valToSvgX(statsTransform.eax);
                  const leftS = valToSvgX(statsTransform.eax - statsTransform.sax);
                  const rightS = valToSvgX(statsTransform.eax + statsTransform.sax);
                  return (
                    <g>
                      {statsTransform.sax > 0 && (
                        <>
                          <rect x={leftS} y={-30} width={Math.max(0, rightS - leftS)} height={8} fill="#fef3c7" opacity={0.8} />
                          <line x1={leftS} y1={-26} x2={rightS} y2={-26} stroke="#d97706" strokeWidth="2.5" markerStart="url(#arrow-amber)" markerEnd="url(#arrow-amber)" />
                        </>
                      )}
                      <text x={eaxX} y={-33} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b45309">σ(aX) = {statsTransform.sax.toFixed(2)}</text>
                      <polygon points={`${eaxX},2 ${eaxX - 7},14 ${eaxX + 7},14`} fill="#dc2626" />
                      <text x={eaxX} y={27} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">E(aX) = {statsTransform.eax.toFixed(2)}</text>
                    </g>
                  );
                })()}
              </g>
            )}

            <g transform={`translate(0, ${showStepByStep ? 320 : 200})`}>
              <text x={12} y={-35} fontSize="13" fontWeight="bold" fill="#047857">{showStepByStep ? "③" : "②"} Y = aX + b</text>
              <line x1={45} y1={0} x2={760} y2={0} stroke="#334155" strokeWidth="2" />
              {ticks.map((t) => (
                <g key={`t3-${t}`} transform={`translate(${valToSvgX(t)}, 0)`}>
                  <line y1={-4} y2={4} stroke="#334155" strokeWidth="1.5" />
                  <text y={16} textAnchor="middle" fontSize="10" fill="#475569">{t}</text>
                </g>
              ))}
              {baseDistribution.items.map((item, i) => {
                const val = paramA * item.x + paramB;
                const cx = valToSvgX(val);
                const barH = Math.max(8, item.p * 65);
                return (
                  <g key={`y-pt-${i}`} transform={`translate(${cx}, 0)`}>
                    <rect x={-7} y={-barH} width={14} height={barH} rx={3} fill="#a7f3d0" opacity={0.9} stroke="#059669" strokeWidth="1" />
                    <circle cx={0} cy={0} r={5.5} fill="#059669" stroke="#fff" strokeWidth="1.5" />
                    <text y={-barH - 5} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46">y={val}</text>
                  </g>
                );
              })}
              {(() => {
                const eyX = valToSvgX(statsTransform.ey);
                const leftS = valToSvgX(statsTransform.ey - statsTransform.sy);
                const rightS = valToSvgX(statsTransform.ey + statsTransform.sy);
                return (
                  <g>
                    {statsTransform.sy > 0 && (
                      <>
                        <rect x={leftS} y={-30} width={Math.max(0, rightS - leftS)} height={8} fill="#d1fae5" opacity={0.8} />
                        <line x1={leftS} y1={-26} x2={rightS} y2={-26} stroke="#059669" strokeWidth="2.5" markerStart="url(#arrow-emerald)" markerEnd="url(#arrow-emerald)" />
                      </>
                    )}
                    <text x={eyX} y={-33} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#047857">σ(Y) = {statsTransform.sy.toFixed(2)}</text>
                    <polygon points={`${eyX},2 ${eyX - 7},14 ${eyX + 7},14`} fill="#dc2626" />
                    <text x={eyX} y={27} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">E(Y) = {statsTransform.ey.toFixed(2)}</text>
                  </g>
                );
              })()}
            </g>
          </svg>
        </div>
      </div>
    </SplitPane>
  );
}
