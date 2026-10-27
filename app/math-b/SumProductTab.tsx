"use client";

import React, { useMemo, useState } from "react";
import { InlineMath } from "react-katex";
import { ProbItem, toLatexFraction } from "./prob-utils";
import { SplitPane } from "../components/SplitLayout";

type TwoVarPreset = "prac13" | "dice2" | "coins500_100" | "prac10";

export default function SumProductTab() {
  const [twoVarPreset, setTwoVarPreset] = useState<TwoVarPreset>("prac13");
  const [coefA, setCoefA] = useState(1);
  const [coefB, setCoefB] = useState(1);

  const twoVarData = useMemo(() => {
    if (twoVarPreset === "prac13") {
      return {
        title: "練習13・練習14（独立な2つの確率変数 X, Y）",
        xItems: [
          { x: 1, num: 2, den: 3, p: 2 / 3 },
          { x: 3, num: 1, den: 3, p: 1 / 3 },
        ] as ProbItem[],
        yItems: [
          { x: 2, num: 4, den: 5, p: 4 / 5 },
          { x: 4, num: 1, den: 5, p: 1 / 5 },
        ] as ProbItem[],
      };
    }
    if (twoVarPreset === "prac10") {
      return {
        title: "練習10（X: 1, 3, 5 / Y: 2, 4, 6）",
        xItems: [1, 3, 5].map((x) => ({ x, num: 1, den: 3, p: 1 / 3 })) as ProbItem[],
        yItems: [2, 4, 6].map((x) => ({ x, num: 1, den: 3, p: 1 / 3 })) as ProbItem[],
      };
    }
    if (twoVarPreset === "coins500_100") {
      return {
        title: "応用例題1（500円硬貨 X枚 と 100円硬貨 Y枚）",
        xItems: [
          { x: 0, num: 1, den: 2, p: 0.5 },
          { x: 1, num: 1, den: 2, p: 0.5 },
        ] as ProbItem[],
        yItems: [
          { x: 0, num: 1, den: 2, p: 0.5 },
          { x: 1, num: 1, den: 2, p: 0.5 },
        ] as ProbItem[],
      };
    }
    return {
      title: "例9・例11・例12（大小2個のさいころの出る目 X, Y）",
      xItems: [1, 2, 3, 4, 5, 6].map((x) => ({ x, num: 1, den: 6, p: 1 / 6 })) as ProbItem[],
      yItems: [1, 2, 3, 4, 5, 6].map((x) => ({ x, num: 1, den: 6, p: 1 / 6 })) as ProbItem[],
    };
  }, [twoVarPreset]);

  const twoVarStats = useMemo(() => {
    const { xItems, yItems } = twoVarData;
    const ex = xItems.reduce((s, i) => s + i.x * i.p, 0);
    const ex2 = xItems.reduce((s, i) => s + i.x * i.x * i.p, 0);
    const vx = ex2 - ex * ex;
    const ey = yItems.reduce((s, i) => s + i.x * i.p, 0);
    const ey2 = yItems.reduce((s, i) => s + i.x * i.x * i.p, 0);
    const vy = ey2 - ey * ey;
    const eSum = coefA * ex + coefB * ey;
    const vSum = coefA * coefA * vx + coefB * coefB * vy;
    const eProd = ex * ey;
    return { ex, vx, ey, vy, eSum, vSum, sSum: Math.sqrt(Math.max(0, vSum)), eProd };
  }, [twoVarData, coefA, coefB]);

  return (
    <SplitPane>
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">独立な2つの確率変数</h3>
            <p className="text-xs text-slate-600 mb-2">{twoVarData.title}</p>
            <select
              value={twoVarPreset}
              onChange={(e) => {
                const val = e.target.value as TwoVarPreset;
                setTwoVarPreset(val);
                if (val === "coins500_100") { setCoefA(500); setCoefB(100); }
                else { setCoefA(1); setCoefB(1); }
              }}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
            >
              <option value="prac13">練習13・14: X=(1,3), Y=(2,4)</option>
              <option value="prac10">練習10: X=(1,3,5), Y=(2,4,6)</option>
              <option value="coins500_100">応用例題1: 500円硬貨 + 100円硬貨</option>
              <option value="dice2">例9・11・12: 大小さいころ</option>
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border space-y-3">
            <div className="text-xs font-bold text-slate-700">
              線形結合 <InlineMath math="Z = aX + bY" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">a =</span>
              <input type="number" value={coefA} onChange={(e) => setCoefA(Number(e.target.value) || 0)} className="w-20 px-2 py-1 text-xs font-bold border rounded bg-white" />
              <span className="text-xs font-semibold">b =</span>
              <input type="number" value={coefB} onChange={(e) => setCoefB(Number(e.target.value) || 0)} className="w-20 px-2 py-1 text-xs font-bold border rounded bg-white" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setCoefA(1); setCoefB(1); }} className="px-2.5 py-1 text-xs bg-white border rounded hover:bg-slate-100">X+Y</button>
              <button onClick={() => { setCoefA(10); setCoefB(5); }} className="px-2.5 py-1 text-xs bg-white border rounded hover:bg-slate-100">10X+5Y</button>
              <button onClick={() => { setCoefA(500); setCoefB(100); }} className="px-2.5 py-1 text-xs bg-white border rounded hover:bg-slate-100">500X+100Y</button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3">
              <div className="text-xs font-bold text-indigo-800 mb-1">和の期待値</div>
              <div className="bg-white py-2 rounded border border-indigo-100 text-center text-sm">
                <InlineMath math="E(aX + bY) = aE(X) + bE(Y)" />
              </div>
              <div className="text-xs font-bold text-indigo-950 mt-2">
                <InlineMath math={`E=${twoVarStats.eSum.toFixed(2)}`} />
              </div>
            </div>
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3">
              <div className="text-xs font-bold text-purple-800 mb-1">積の期待値（独立時）</div>
              <div className="bg-white py-2 rounded border border-purple-100 text-center text-sm">
                <InlineMath math="E(XY) = E(X)E(Y)" />
              </div>
              <div className="text-xs font-bold text-purple-950 mt-2">
                <InlineMath math={`E(XY)=${twoVarStats.eProd.toFixed(2)}`} />
              </div>
            </div>
            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3">
              <div className="text-xs font-bold text-teal-800 mb-1">和の分散（独立時）</div>
              <div className="bg-white py-2 rounded border border-teal-100 text-center text-sm">
                <InlineMath math="V(aX + bY) = a^2V(X) + b^2V(Y)" />
              </div>
              <div className="text-xs font-bold text-teal-950 mt-2">
                <InlineMath math={`V\\approx${twoVarStats.vSum.toFixed(2)}\\ (\\sigma\\approx${twoVarStats.sSum.toFixed(2)})`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full min-h-[280px] w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-auto p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-3">
          同時確率分布表（独立なので <InlineMath math="P(X=x_i, Y=y_j) = p_i q_j" />）
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs bg-white rounded-lg overflow-hidden border border-slate-200">
            <thead>
              <tr className="bg-slate-100 border-b">
                <th className="py-2 px-2 border-r">X ＼ Y</th>
                {twoVarData.yItems.map((yi, j) => (
                  <th key={`yth-${j}`} className="py-2 px-2 border-r text-emerald-800 font-bold">Y = {yi.x}</th>
                ))}
                <th className="py-2 px-2 bg-blue-50 text-blue-800 font-bold">X の周辺確率</th>
              </tr>
            </thead>
            <tbody>
              {twoVarData.xItems.map((xi, i) => (
                <tr key={`xtr-${i}`} className="border-b">
                  <th className="py-2 px-2 bg-slate-50 border-r text-blue-800 font-bold">X = {xi.x}</th>
                  {twoVarData.yItems.map((yi, j) => {
                    const sumVal = coefA * xi.x + coefB * yi.x;
                    const prodVal = xi.x * yi.x;
                    return (
                      <td key={`cell-${i}-${j}`} className="py-2 px-2 border-r">
                        <div className="font-bold">確率: <InlineMath math={toLatexFraction(xi.num * yi.num, xi.den * yi.den)} /></div>
                        <div className="text-[11px] text-indigo-600 mt-0.5">和:{sumVal} / 積:{prodVal}</div>
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 bg-blue-50/50 font-bold text-blue-800">
                    <InlineMath math={toLatexFraction(xi.num, xi.den, false)} />
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-50/50 font-bold text-emerald-800">
                <th className="py-2 px-2 border-r">Y の周辺確率</th>
                {twoVarData.yItems.map((yi, j) => (
                  <td key={`ymarg-${j}`} className="py-2 px-2 border-r">
                    <InlineMath math={toLatexFraction(yi.num, yi.den, false)} />
                  </td>
                ))}
                <td className="py-2 px-2 bg-slate-200 text-slate-900">計 1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SplitPane>
  );
}
