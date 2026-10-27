"use client";

import React, { useState } from "react";
import { InlineMath } from "react-katex";
import type { ProbTabType } from "./prob-utils";
import TransformTab from "./TransformTab";
import SimulationTab from "./SimulationTab";
import SumProductTab from "./SumProductTab";
import BinomialNormalTab from "./BinomialNormalTab";

const TABS: { id: ProbTabType; sub: string; title: string }[] = [
  { id: "transform", sub: "重点テーマ (p.54-59)", title: "① aX+b と数直線ビジュアライズ" },
  { id: "simulation", sub: "基本と実験 (p.50-58)", title: "② 硬貨・玉・さいころと確率分布" },
  { id: "sum_product", sub: "2つの確率変数 (p.60-65)", title: "③ 和 X+Y と積 XY の期待値・分散" },
  { id: "binomial_normal", sub: "発展と近似 (p.65-79)", title: "④ 二項分布 B(n,p) と正規分布" },
];

export default function ProbabilityVisualizer() {
  const [activeTab, setActiveTab] = useState<ProbTabType>("transform");

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <header className="shrink-0 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5 mb-3">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold tracking-wide mb-2">
            数学B：第2章 統計的な推測 ／ 第1節 確率分布
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
            確率分布・期待値・分散 インタラクティブ視覚化ラボ
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            数直線による <InlineMath math="aX+b" /> の変化、実験シミュレーション、二項分布と正規分布のつながりを体験できます。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl text-left transition-all border ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <div className="text-xs opacity-80 font-semibold">{tab.sub}</div>
              <div className="font-bold text-sm mt-0.5">{tab.title}</div>
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4" style={{ scrollbarWidth: "thin" }}>
        {activeTab === "transform" && <TransformTab />}
        {activeTab === "simulation" && <SimulationTab />}
        {activeTab === "sum_product" && <SumProductTab />}
        {activeTab === "binomial_normal" && <BinomialNormalTab />}
      </div>
    </div>
  );
}
