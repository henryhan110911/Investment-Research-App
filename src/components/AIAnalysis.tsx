"use client";

import { useState } from "react";

type Props = {
  companySymbol: string;
  companyName: string;
};

export default function AIAnalysis({ companySymbol, companyName }: Props) {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const generateAnalysis = async () => {
    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const response = await fetch(`/api/analyze/${companySymbol}`);
      
      if (!response.ok) {
        throw new Error("生成分析失败");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError("AI 分析暂时不可用，请检查 API 配置");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/50 to-blue-950/50 p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">🤖 AI 投资分析</h2>
          <p className="mt-1 text-sm text-slate-400">
            基于财务数据和市场表现的智能解读
          </p>
        </div>
        <button
          onClick={generateAnalysis}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "生成中..." : analysis ? "重新生成" : "生成分析"}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <span className="ml-3 text-slate-400">AI 正在分析 {companyName} 的投资价值...</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
          {error}
        </div>
      )}

      {analysis && !loading && (
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-6 text-slate-200 leading-relaxed">
            {analysis}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            * AI 分析仅供参考，不构成投资建议。投资有风险，决策需谨慎。
          </p>
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
          <p className="text-sm">点击"生成分析"按钮，让 AI 为您解读 {companyName} 的投资价值</p>
        </div>
      )}
    </div>
  );
}
