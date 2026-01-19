import Link from "next/link";
import { getDailyBriefing, getThemeIdeas, getWatchlistQuotes } from "@/lib/data/a-share";

const watchlist = ["600519", "300750", "601318", "000858", "600036"];

export default async function Home() {
  const [briefing, quotes, themes] = await Promise.all([
    getDailyBriefing(),
    getWatchlistQuotes(watchlist),
    getThemeIdeas(),
  ]);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-xl shadow-slate-900/40">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
          A 股投研助手
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
          个股情报 · 新闻解读 · 投资机会
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-300">
          免费公开数据源（可能不稳定）做 MVP，后续可替换为专业行情/财务/研报接口。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href="/discover"
            className="rounded-full bg-cyan-500 px-4 py-2 font-medium text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400"
          >
            发现机会
          </Link>
          <Link
            href="/company/600519"
            className="rounded-full border border-white/20 px-4 py-2 text-slate-100 hover:border-white/40"
          >
            查看示例公司
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">自选股快览</h2>
          <p className="text-xs text-slate-400">演示数据，待接入真实行情</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <Link
              key={quote.symbol}
              href={`/company/${quote.symbol}`}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{quote.symbol}</p>
                  <p className="text-lg font-semibold">{quote.name}</p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    quote.changePercent >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {quote.changePercent >= 0 ? "+" : ""}
                  {quote.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
                <span className="text-lg font-semibold text-white">¥{quote.price.toFixed(2)}</span>
                <span>PE {quote.pe.toFixed(1)}x</span>
                <span>PB {quote.pb.toFixed(1)}x</span>
                <span>市值 {quote.marketCap.toFixed(2)} 万亿</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">今日商业新闻解读</h2>
          <p className="text-xs text-slate-400">样例数据，可接入 RSS/公告+LLM 解读</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {briefing.items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-sm shadow-black/30"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{item.source}</span>
                <span>{item.publishedAt}</span>
              </div>
              <p className="mt-2 text-base font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-cyan-200">
                {item.related.map((code) => (
                  <span
                    key={code}
                    className="rounded-full bg-cyan-500/10 px-2 py-1 text-cyan-200"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">主题机会雷达</h2>
          <Link href="/discover" className="text-sm text-cyan-300 hover:text-cyan-200">
            查看全部
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-sm shadow-black/30"
            >
              <p className="text-sm text-cyan-300">{theme.name}</p>
              <p className="mt-2 text-sm text-slate-300">{theme.thesis}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
                {theme.symbols.map((code) => (
                  <span key={code} className="rounded-full bg-white/5 px-2 py-1">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
