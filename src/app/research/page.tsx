"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const hotTickers = [
  { symbol: "600519", name: "贵州茅台" },
  { symbol: "300750", name: "宁德时代" },
  { symbol: "601318", name: "中国平安" },
  { symbol: "000858", name: "五粮液" },
  { symbol: "600036", name: "招商银行" },
  { symbol: "002594", name: "比亚迪" },
  { symbol: "000002", name: "万科A" },
  { symbol: "600000", name: "浦发银行" },
];

export default function ResearchPage() {
  const router = useRouter();
  const [symbol, setSymbol] = useState("");

  const handleAnalyze = () => {
    if (symbol.trim()) {
      router.push(`/company/${symbol.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-2">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-semibold text-purple-300">智投研究</span>
          </div>
          <h1 className="mb-4 text-5xl font-bold text-white">智能投资研究</h1>
          <p className="text-xl text-purple-200">一键生成报告</p>
          <p className="mt-4 text-slate-300">
            输入任意 A 股代码，AI 自动分析企业基本面、行业格局、竞争优势，生成专业级投资调研报告
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-purple-900/30 p-8 shadow-2xl backdrop-blur">
          <div className="mb-6">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="输入股票代码，例如 600519、300750、601318"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-lg text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!symbol.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            开始分析 →
          </button>
        </div>

        {/* Hot Tickers */}
        <div className="mb-8">
          <p className="mb-4 text-sm font-semibold text-slate-400">热门标的：</p>
          <div className="flex flex-wrap gap-3">
            {hotTickers.map((ticker) => (
              <button
                key={ticker.symbol}
                onClick={() => {
                  setSymbol(ticker.symbol);
                  router.push(`/company/${ticker.symbol}`);
                }}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-all hover:border-purple-500/50 hover:bg-purple-500/20 hover:text-white"
              >
                {ticker.symbol} {ticker.name}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
            <div className="mb-2 text-2xl">📊</div>
            <h3 className="mb-2 font-semibold text-white">财务数据分析</h3>
            <p className="text-sm text-slate-400">
              自动提取营收、利润、现金流等关键财务指标，生成趋势图表
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
            <div className="mb-2 text-2xl">💡</div>
            <h3 className="mb-2 font-semibold text-white">AI 智能解读</h3>
            <p className="text-sm text-slate-400">
              基于财报、公告、研报生成专业投资分析，提炼核心观点
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
            <div className="mb-2 text-2xl">🎯</div>
            <h3 className="mb-2 font-semibold text-white">估值与机会</h3>
            <p className="text-sm text-slate-400">
              DCF 估值、相对估值分析，识别潜在投资机会与风险
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
