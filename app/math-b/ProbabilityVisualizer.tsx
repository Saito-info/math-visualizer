"use client";

import React, { useState } from "react";
import type { ProbTabType } from "./prob-utils";
import TransformTab from "./TransformTab";
import SimulationTab from "./SimulationTab";
import SumProductTab from "./SumProductTab";
import BinomialNormalTab from "./BinomialNormalTab";

export default function ProbabilityVisualizer() {
  const [activeTab, setActiveTab] = useState<ProbTabType>("transform");

  return (
    <div className="h-full flex flex-col gap-3 min-h-0">
      <div className="shrink-0 bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
        <h2 className="text-xl font-bold text-indigo-900">確率分布</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveTab("transform")}
            className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition ${activeTab === "transform" ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            1. aX+b と数直線
          </button>
          <button
            onClick={() => setActiveTab("simulation")}
            className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition ${activeTab === "simulation" ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            2. 硬貨・玉・さいころ
          </button>
          <button
            onClick={() => setActiveTab("sum_product")}
            className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition ${activeTab === "sum_product" ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            3. 和と積
          </button>
          <button
            onClick={() => setActiveTab("binomial_normal")}
            className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition ${activeTab === "binomial_normal" ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            4. 二項分布と正規分布
          </button>
        </div>
      </div>

      <div className={activeTab === "transform" ? "flex-1 min-h-0" : "hidden"}>
        <TransformTab />
      </div>
      <div className={activeTab === "simulation" ? "flex-1 min-h-0" : "hidden"}>
        <SimulationTab />
      </div>
      <div className={activeTab === "sum_product" ? "flex-1 min-h-0" : "hidden"}>
        <SumProductTab />
      </div>
      <div className={activeTab === "binomial_normal" ? "flex-1 min-h-0" : "hidden"}>
        <BinomialNormalTab />
      </div>
    </div>
  );
}
