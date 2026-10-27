"use client";

import React, { useEffect, useMemo, useState } from "react";
import { InlineMath } from "react-katex";
import { ProbItem, combinations, toLatexFraction } from "./prob-utils";

type SimMode = "coins" | "balls" | "dice_sum" | "coin_money" | "lottery";

export default function SimulationTab() {
  const [simMode, setSimMode] = useState<SimMode>("balls");
  const [numCoins, setNumCoins] = useState(2);
  const [whiteBalls, setWhiteBalls] = useState(2);
  const [blackBalls, setBlackBalls] = useState(3);
  const [drawBalls, setDrawBalls] = useState(3);
  const [targetBallColor, setTargetBallColor] = useState<"white" | "black">("white");
  const [simCounts, setSimCounts] = useState<Record<number, number>>({});
  const [totalSimTrials, setTotalSimTrials] = useState(0);
  const [lastOutcomeDesc, setLastOutcomeDesc] = useState("");
  const [lastOutcomeValue, setLastOutcomeValue] = useState<number | null>(null);

  const simDistribution: { title: string; formulaDesc: string; items: ProbItem[] } = useMemo(() => {
    if (simMode === "coins") {
      const den = Math.pow(2, numCoins);
      const items: ProbItem[] = [];
      for (let k = 0; k <= numCoins; k++) {
        const num = combinations(numCoins, k);
        items.push({ x: k, num, den, p: num / den });
      }
      return {
        title: `${numCoins}枚の硬貨を投げるとき、表が出る枚数 X`,
        formulaDesc: `P(X=k) = \\frac{_{${numCoins}}\\mathrm{C}_k}{2^{${numCoins}}}`,
        items,
      };
    }
    if (simMode === "balls") {
      const total = whiteBalls + blackBalls;
      const actualDraw = Math.min(drawBalls, total);
      const targetTotal = targetBallColor === "white" ? whiteBalls : blackBalls;
      const otherTotal = targetBallColor === "white" ? blackBalls : whiteBalls;
      const den = combinations(total, actualDraw);
      const items: ProbItem[] = [];
      for (let k = 0; k <= actualDraw; k++) {
        if (k <= targetTotal && actualDraw - k <= otherTotal) {
          const num = combinations(targetTotal, k) * combinations(otherTotal, actualDraw - k);
          items.push({ x: k, num, den, p: num / den });
        }
      }
      const colorName = targetBallColor === "white" ? "白玉" : "黒玉";
      return {
        title: `白玉${whiteBalls}個・黒玉${blackBalls}個から${actualDraw}個取り出すときの${colorName}の個数 X`,
        formulaDesc: `P(X=k) = \\frac{_{${targetTotal}}\\mathrm{C}_k \\times _{${otherTotal}}\\mathrm{C}_{${actualDraw}-k}}{_{${total}}\\mathrm{C}_{${actualDraw}}}`,
        items,
      };
    }
    if (simMode === "dice_sum") {
      const den = 36;
      const items: ProbItem[] = [];
      for (let s = 2; s <= 12; s++) {
        const num = 6 - Math.abs(7 - s);
        items.push({ x: s, num, den, p: num / den });
      }
      return {
        title: "2個のさいころを同時に投げて、出る目の和 X",
        formulaDesc: "P(X=k) \\quad (k=2, 3, \\dots, 12)",
        items,
      };
    }
    if (simMode === "coin_money") {
      return {
        title: "500円硬貨1枚と100円硬貨1枚を投げて表が出た金額の和 Z円",
        formulaDesc: "Z = 500X + 100Y",
        items: [
          { x: 0, num: 1, den: 4, p: 0.25, label: "(裏, 裏)" },
          { x: 100, num: 1, den: 4, p: 0.25, label: "(裏, 表)" },
          { x: 500, num: 1, den: 4, p: 0.25, label: "(表, 裏)" },
          { x: 600, num: 1, den: 4, p: 0.25, label: "(表, 表)" },
        ],
      };
    }
    return {
      title: "1000本のくじを1本引くときの賞金 X円",
      formulaDesc: "E(X) = 10000\\cdot\\frac{1}{1000}+\\cdots",
      items: [
        { x: 0, num: 944, den: 1000, p: 0.944, label: "はずれ" },
        { x: 100, num: 50, den: 1000, p: 0.05, label: "3等" },
        { x: 1000, num: 5, den: 1000, p: 0.005, label: "2等" },
        { x: 10000, num: 1, den: 1000, p: 0.001, label: "1等" },
      ],
    };
  }, [simMode, numCoins, whiteBalls, blackBalls, drawBalls, targetBallColor]);

  useEffect(() => {
    setSimCounts({});
    setTotalSimTrials(0);
    setLastOutcomeDesc("");
    setLastOutcomeValue(null);
  }, [simMode, numCoins, whiteBalls, blackBalls, drawBalls, targetBallColor]);

  const runSimulation = (trials: number) => {
    const newCounts = { ...simCounts };
    let lastVal = 0;
    let lastDesc = "";

    for (let t = 0; t < trials; t++) {
      if (simMode === "coins") {
        let heads = 0;
        const coinsArr: string[] = [];
        for (let c = 0; c < numCoins; c++) {
          const isHead = Math.random() < 0.5;
          if (isHead) heads++;
          coinsArr.push(isHead ? "表" : "裏");
        }
        lastVal = heads;
        if (t === trials - 1) lastDesc = `結果: (${coinsArr.join(", ")}) → 表 ${heads}枚`;
      } else if (simMode === "balls") {
        const total = whiteBalls + blackBalls;
        const actualDraw = Math.min(drawBalls, total);
        const bag: ("W" | "B")[] = [
          ...Array(whiteBalls).fill("W" as const),
          ...Array(blackBalls).fill("B" as const),
        ];
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        const drawn = bag.slice(0, actualDraw);
        const targetChar = targetBallColor === "white" ? "W" : "B";
        const count = drawn.filter((b) => b === targetChar).length;
        lastVal = count;
        if (t === trials - 1) {
          const drawnStr = drawn.map((b) => (b === "W" ? "白" : "黒")).join(" ");
          lastDesc = `取り出した玉: [ ${drawnStr} ] → ${targetBallColor === "white" ? "白玉" : "黒玉"} ${count}個`;
        }
      } else if (simMode === "dice_sum") {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        lastVal = d1 + d2;
        if (t === trials - 1) lastDesc = `さいころ: ${d1}, ${d2} → 和 X = ${d1 + d2}`;
      } else if (simMode === "coin_money") {
        const c500 = Math.random() < 0.5 ? 1 : 0;
        const c100 = Math.random() < 0.5 ? 1 : 0;
        lastVal = 500 * c500 + 100 * c100;
        if (t === trials - 1) lastDesc = `500円: ${c500 ? "表" : "裏"}, 100円: ${c100 ? "表" : "裏"} → ${lastVal}円`;
      } else {
        const r = Math.random();
        if (r < 0.001) { lastVal = 10000; lastDesc = "1等 当選！ (10000円)"; }
        else if (r < 0.006) { lastVal = 1000; lastDesc = "2等 当選！ (1000円)"; }
        else if (r < 0.056) { lastVal = 100; lastDesc = "3等 当選！ (100円)"; }
        else { lastVal = 0; lastDesc = "はずれ (0円)"; }
      }
      newCounts[lastVal] = (newCounts[lastVal] || 0) + 1;
    }

    setSimCounts(newCounts);
    setTotalSimTrials((prev) => prev + trials);
    setLastOutcomeValue(lastVal);
    setLastOutcomeDesc(lastDesc);
  };

  const simStats = useMemo(() => {
    const items = simDistribution.items;
    const den = items[0]?.den || 1;
    const exNum = items.reduce((acc, cur) => acc + cur.x * cur.num, 0);
    const ex = exNum / den;
    const ex2Num = items.reduce((acc, cur) => acc + cur.x * cur.x * cur.num, 0);
    const vx = ex2Num / den - ex * ex;
    const sx = Math.sqrt(Math.max(0, vx));
    let expMean = 0;
    let expVar = 0;
    if (totalSimTrials > 0) {
      let sum = 0;
      let sum2 = 0;
      for (const [valStr, cnt] of Object.entries(simCounts)) {
        const val = Number(valStr);
        sum += val * cnt;
        sum2 += val * val * cnt;
      }
      expMean = sum / totalSimTrials;
      expVar = sum2 / totalSimTrials - expMean * expMean;
    }
    return { den, exNum, ex, vx, sx, expMean, expVar };
  }, [simDistribution, simCounts, totalSimTrials]);

  const modeButtons: { id: SimMode; label: string }[] = [
    { id: "balls", label: "袋から玉を取り出す" },
    { id: "coins", label: "硬貨を投げる" },
    { id: "dice_sum", label: "さいころ2個の和" },
    { id: "coin_money", label: "500円と100円硬貨" },
    { id: "lottery", label: "1000本のくじ" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">試行・問題の種類</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {modeButtons.map((m) => (
            <button
              key={m.id}
              onClick={() => setSimMode(m.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                simMode === m.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {simMode === "balls" && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => { setWhiteBalls(2); setBlackBalls(3); setDrawBalls(3); setTargetBallColor("white"); }} className="px-2.5 py-1 text-xs font-semibold bg-white border rounded-lg hover:bg-indigo-50">例題1: 白2黒3→3個・白</button>
              <button onClick={() => { setWhiteBalls(2); setBlackBalls(3); setDrawBalls(4); setTargetBallColor("black"); }} className="px-2.5 py-1 text-xs font-semibold bg-white border rounded-lg hover:bg-indigo-50">練習1: 白2黒3→4個・黒</button>
              <button onClick={() => { setWhiteBalls(4); setBlackBalls(2); setDrawBalls(2); setTargetBallColor("white"); }} className="px-2.5 py-1 text-xs font-semibold bg-white border rounded-lg hover:bg-indigo-50">練習3: 白4黒2→2個・白</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600">白玉: {whiteBalls}</label>
                <input type="range" min={1} max={6} value={whiteBalls} onChange={(e) => { const w = Number(e.target.value); setWhiteBalls(w); if (drawBalls > w + blackBalls) setDrawBalls(w + blackBalls); }} className="w-full mt-1 accent-indigo-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600">黒玉: {blackBalls}</label>
                <input type="range" min={1} max={6} value={blackBalls} onChange={(e) => { const b = Number(e.target.value); setBlackBalls(b); if (drawBalls > whiteBalls + b) setDrawBalls(whiteBalls + b); }} className="w-full mt-1 accent-indigo-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600">取り出す個数: {Math.min(drawBalls, whiteBalls + blackBalls)}</label>
                <input type="range" min={1} max={whiteBalls + blackBalls} value={Math.min(drawBalls, whiteBalls + blackBalls)} onChange={(e) => setDrawBalls(Number(e.target.value))} className="w-full mt-1 accent-indigo-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">X とする玉</label>
                <div className="flex gap-2">
                  <button onClick={() => setTargetBallColor("white")} className={`flex-1 py-1 text-xs font-bold rounded border ${targetBallColor === "white" ? "bg-indigo-600 text-white" : "bg-white"}`}>白玉</button>
                  <button onClick={() => setTargetBallColor("black")} className={`flex-1 py-1 text-xs font-bold rounded border ${targetBallColor === "black" ? "bg-indigo-600 text-white" : "bg-white"}`}>黒玉</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {simMode === "coins" && (
          <div className="bg-slate-50 p-4 rounded-xl border mb-5 flex flex-wrap items-center gap-4">
            <label className="text-sm font-bold">硬貨の枚数: <span className="text-indigo-600 text-lg">{numCoins}</span></label>
            <input type="range" min={1} max={6} value={numCoins} onChange={(e) => setNumCoins(Number(e.target.value))} className="w-40 accent-indigo-600" />
          </div>
        )}

        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-slate-900">{simDistribution.title}</h3>
            <div className="text-xs bg-indigo-50 text-indigo-800 px-3 py-1 rounded-lg border border-indigo-100">
              <InlineMath math={simDistribution.formulaDesc} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-sm bg-white rounded-lg overflow-hidden border border-slate-200">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="py-2 px-3 font-bold border-r w-32">X の値</th>
                  {simDistribution.items.map((item, idx) => (
                    <td key={`sim-x-${idx}`} className="py-2 px-3 font-bold text-indigo-700 border-r">
                      <div>{item.x}</div>
                      {item.label && <div className="text-[10px] text-slate-500 font-normal">{item.label}</div>}
                    </td>
                  ))}
                  <th className="py-2 px-3 font-bold bg-slate-200/70">計</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <th className="py-2.5 px-3 font-bold border-r bg-slate-50">理論確率</th>
                  {simDistribution.items.map((item, idx) => (
                    <td key={`sim-p-${idx}`} className="py-2.5 px-3 border-r">
                      <InlineMath math={toLatexFraction(item.num, item.den, false)} />
                      <div className="text-[11px] text-slate-400">({(item.p * 100).toFixed(1)}%)</div>
                    </td>
                  ))}
                  <td className="py-2.5 px-3 font-bold bg-slate-100">1</td>
                </tr>
                {totalSimTrials > 0 && (
                  <tr className="bg-orange-50/70">
                    <th className="py-2 px-3 font-bold text-orange-800 border-r">実験相対度数<br /><span className="text-[10px] font-normal">({totalSimTrials}回)</span></th>
                    {simDistribution.items.map((item, idx) => {
                      const cnt = simCounts[item.x] || 0;
                      return (
                        <td key={`sim-exp-${idx}`} className="py-2 px-3 border-r font-semibold text-orange-700">
                          {cnt}回
                          <div className="text-[11px]">({((cnt / totalSimTrials) * 100).toFixed(1)}%)</div>
                        </td>
                      );
                    })}
                    <td className="py-2 px-3 font-bold text-orange-800 bg-orange-100/60">100%</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-orange-50 p-4 rounded-xl border border-indigo-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">実験シミュレーション（大数の法則）</h4>
              <p className="text-xs text-slate-600">試行を繰り返すとオレンジの棒が青い理論値に近づきます。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 10, 100, 1000].map((n) => (
                <button key={n} onClick={() => runSimulation(n)} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg">
                  {n}回
                </button>
              ))}
              <button
                onClick={() => { setSimCounts({}); setTotalSimTrials(0); setLastOutcomeDesc(""); setLastOutcomeValue(null); }}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg border"
              >
                リセット
              </button>
            </div>
          </div>
          {lastOutcomeDesc && (
            <div className="mt-3 pt-3 border-t border-indigo-200/60 flex flex-wrap justify-between gap-2 text-xs">
              <div className="font-bold text-indigo-950 bg-white px-3 py-1.5 rounded-lg border">直前: {lastOutcomeDesc}</div>
              <div className="font-semibold">総試行: <span className="text-orange-600 font-extrabold">{totalSimTrials}</span> 回</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-50 p-4 rounded-xl border">
            <span className="text-xs font-bold text-slate-700">青:理論 ／ オレンジ:実験</span>
            <div className="h-56 flex items-end justify-around gap-2 pt-6 pb-2 px-4 bg-white rounded-lg border mt-2">
              {simDistribution.items.map((item, idx) => {
                const maxP = Math.max(...simDistribution.items.map((i) => i.p), 0.35);
                const theoHeightPct = Math.min(100, (item.p / maxP) * 100);
                const expRel = totalSimTrials > 0 ? (simCounts[item.x] || 0) / totalSimTrials : 0;
                const expHeightPct = Math.min(100, (expRel / maxP) * 100);
                const isLast = lastOutcomeValue === item.x;
                return (
                  <div key={`bar-${idx}`} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-40">
                      <div style={{ height: `${Math.max(3, theoHeightPct)}%` }} className="w-1/2 max-w-[28px] bg-indigo-500 rounded-t relative">
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-700 whitespace-nowrap">{(item.p * 100).toFixed(0)}%</span>
                      </div>
                      {totalSimTrials > 0 && (
                        <div style={{ height: `${Math.max(2, expHeightPct)}%` }} className="w-1/2 max-w-[28px] bg-orange-400 rounded-t relative">
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-700 whitespace-nowrap">{(expRel * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </div>
                    <div className={`mt-2 text-xs font-bold px-2 py-0.5 rounded ${isLast ? "bg-orange-500 text-white" : "text-slate-700"}`}>X={item.x}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border space-y-3">
            <h4 className="text-sm font-bold border-b pb-2">期待値・分散・標準偏差</h4>
            <div className="bg-white p-3 rounded-lg border text-xs space-y-1">
              <div className="font-bold text-indigo-800">E(X) = Σ xₖ pₖ</div>
              <div className="text-sm font-bold"><InlineMath math={`E(X) = ${toLatexFraction(simStats.exNum, simStats.den)} \\approx ${simStats.ex.toFixed(3)}`} /></div>
              {totalSimTrials > 0 && <div className="text-orange-700 font-bold">実験平均: {simStats.expMean.toFixed(3)}</div>}
            </div>
            <div className="bg-white p-3 rounded-lg border text-xs space-y-1">
              <div className="font-bold text-indigo-800">V(X) = E(X²) − &#123;E(X)&#125;²</div>
              <div className="text-sm font-bold"><InlineMath math={`V(X) \\approx ${simStats.vx.toFixed(3)}`} /></div>
              {totalSimTrials > 0 && <div className="text-orange-700 font-bold">実験分散: {simStats.expVar.toFixed(3)}</div>}
            </div>
            <div className="bg-white p-3 rounded-lg border text-xs space-y-1">
              <div className="font-bold text-indigo-800">σ(X) = √V(X)</div>
              <div className="text-sm font-bold"><InlineMath math={`\\sigma(X) \\approx ${simStats.sx.toFixed(3)}`} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
