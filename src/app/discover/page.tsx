import Link from "next/link";
import { getDiscoverIdeas, getThemeIdeas } from "@/lib/data/a-share";

export default async function DiscoverPage() {
  const [ideas, themes] = await Promise.all([getDiscoverIdeas(), getThemeIdeas()]);

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white">
          首页
        </Link>
        <span>/</span>
        <span>发现机会</span>
      </div>

      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">策略篮子</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <div
              key={idea.name}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-black/30"
            >
              <p className="text-sm text-cyan-300">{idea.name}</p>
              <p className="mt-2 text-sm text-slate-300">{idea.logic}</p>
              <div className="mt-4 space-y-2">
                {idea.picks.map((pick) => (
                  <Link
                    key={pick.symbol}
                    href={`/company/${pick.symbol}`}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white hover:border-cyan-300/40"
                  >
                    <span>
                      {pick.symbol} · {pick.name}
                    </span>
                    <span className="text-slate-300">{pick.reason}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">主题机会</h2>
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
                  <Link
                    key={code}
                    href={`/company/${code}`}
                    className="rounded-full bg-white/5 px-2 py-1 hover:border-cyan-300/40"
                  >
                    {code}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-cyan-400/40 bg-cyan-500/5 p-5 text-sm text-cyan-50">
        <p className="font-semibold">下一步迭代</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-cyan-100">
          <li>接入真实行情 + 量化指标筛选（ROE、现金流、估值）。</li>
          <li>按主题/产业链自动生成候选公司清单 + 逻辑摘要（LLM）。</li>
          <li>异动雷达：价格/成交量/期权持仓、回购/减持/机构持仓变化。</li>
        </ul>
      </section>
    </div>
  );
}
