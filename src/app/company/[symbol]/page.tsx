import Link from "next/link";
import { getCompanySnapshot } from "@/lib/data/a-share";
import RevenueChart from "@/components/RevenueChart";
import GrowthChart from "@/components/GrowthChart";
import AIAnalysis from "@/components/AIAnalysis";

type Props = {
  params: Promise<{ symbol: string }>;
};

export default async function CompanyPage({ params }: Props) {
  const { symbol } = await params;
  const snapshot = await getCompanySnapshot(symbol);
  const { profile, quote, highlights, news, financialData, valuation, longTermGrowth } = snapshot;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white">
          首页
        </Link>
        <span>/</span>
        <Link href="/research" className="hover:text-white">
          智投研究
        </Link>
        <span>/</span>
        <span>{symbol}</span>
      </div>

      {/* Company Header Card */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-purple-900/30 p-8 shadow-lg shadow-black/30">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                  {profile.symbol}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300">
                  {profile.sector}
                </span>
                {profile.country && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300">
                    {profile.country}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">当前股价</p>
            <p className="text-4xl font-bold text-white">¥{quote.price.toFixed(2)}</p>
            <p
              className={`text-lg font-semibold ${
                quote.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {quote.changePercent >= 0 ? "+" : ""}
              {quote.changePercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">市值</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {quote.marketCap.toFixed(2)} 万亿
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">员工数</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {profile.employees?.toLocaleString() || "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">IPO 日期</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {profile.ipoDate || "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">行业</p>
            <p className="mt-1 text-xl font-semibold text-white">{profile.sector}</p>
          </div>
        </div>
      </div>

      {/* Valuation & Financial Metrics */}
      {valuation && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/50 to-purple-950/50 p-8">
          <h2 className="mb-2 text-2xl font-bold text-white">估值与财务指标</h2>
          <p className="mb-6 text-sm text-slate-400">关键财务比率和估值分析</p>

          {/* DCF Valuation */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-white">DCF 估值分析</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">当前股价</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  ¥{valuation.currentPrice.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">DCF 内在价值</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  ¥{valuation.dcfIntrinsicValue.toFixed(2)}
                </p>
              </div>
              <div
                className={`rounded-xl border border-white/10 p-6 ${
                  valuation.potentialUpside >= 0
                    ? "bg-emerald-500/20"
                    : "bg-rose-500/20"
                }`}
              >
                <p className="text-sm text-slate-400">潜在空间</p>
                <p
                  className={`mt-2 text-3xl font-bold ${
                    valuation.potentialUpside >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {valuation.potentialUpside >= 0 ? "+" : ""}
                  {valuation.potentialUpside.toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              基于 DCF 模型，该股票可能
              {valuation.potentialUpside >= 0 ? "被低估" : "被高估"}约
              {Math.abs(valuation.potentialUpside).toFixed(1)}%
            </p>
          </div>

          {/* Financial Ratios */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">其他财务比率</h3>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">P/E 市盈率</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {valuation.pe > 0 ? `${valuation.pe.toFixed(1)}x` : "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">P/B 市净率</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {valuation.pb > 0 ? `${valuation.pb.toFixed(1)}x` : "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">P/S 市销率</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {valuation.ps > 0 ? `${valuation.ps.toFixed(2)}x` : "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">EV/EBITDA</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {valuation.evEbitda > 0 ? `${valuation.evEbitda.toFixed(1)}x` : "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">股息率</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {valuation.dividendYield > 0
                    ? `${valuation.dividendYield.toFixed(2)}%`
                    : "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">收益率</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {valuation.yieldRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      <AIAnalysis companySymbol={symbol} companyName={profile.name} />

      {/* Financial Charts */}
      {financialData && financialData.length > 0 && (
        <div className="space-y-6">
          <RevenueChart data={financialData} />
          <GrowthChart data={financialData} />
        </div>
      )}

      {/* Long-term Growth Indicators */}
      {longTermGrowth && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">长期增长指标</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">3年营收增长（年化）</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {longTermGrowth.revenue3Y.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">5年营收增长（年化）</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {longTermGrowth.revenue5Y.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">10年营收增长（年化）</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {longTermGrowth.revenue10Y.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">3年净利润增长（年化）</p>
              <p
                className={`mt-2 text-2xl font-bold ${
                  longTermGrowth.netProfit3Y >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {longTermGrowth.netProfit3Y >= 0 ? "+" : ""}
                {longTermGrowth.netProfit3Y.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">5年净利润增长（年化）</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {longTermGrowth.netProfit5Y.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">10年净利润增长（年化）</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {longTermGrowth.netProfit10Y.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Highlights */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-slate-900/70 p-6 shadow-sm shadow-black/30"
          >
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </section>

      {/* News Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">相关新闻/公告</h2>
          <p className="text-xs text-slate-400">后续可接入公告/研报/RSS</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {news.length === 0 && (
            <p className="text-sm text-slate-400">暂无相关新闻，待真实数据接入。</p>
          )}
          {news.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-6 shadow-sm shadow-black/30"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{item.source}</span>
                <span>{item.publishedAt}</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section className="rounded-xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-300">
        <p className="mb-2 font-semibold text-white">下一步可接入</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>免费行情接口（新浪/网易等）的实时价格与涨跌幅。</li>
          <li>财报、财务指标、研报/公告摘要，结合 LLM 输出要点。</li>
          <li>电话会/路演纪要，供用户快速浏览与标注。</li>
        </ul>
      </section>
    </div>
  );
}
