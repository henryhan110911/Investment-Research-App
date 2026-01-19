/**
 * A 股数据接口（接入真实 API）
 * 整合 Tushare 和 OpenRouter API
 */

import {
  getFullCompanyData,
  convertToTsCode,
  getLatestQuote,
  getDailyBasic,
} from "@/lib/api/tushare";
import { generateCompanyAnalysis } from "@/lib/api/openrouter";
import type {
  Quote,
  CompanySnapshot,
  FinancialData,
  ValuationMetrics,
} from "./a-share";

/**
 * 获取公司完整快照（真实数据）
 */
export async function getCompanySnapshotLive(symbol: string): Promise<CompanySnapshot> {
  try {
    const tsCode = convertToTsCode(symbol);
    const data = await getFullCompanyData(symbol);

    if (!data.stockBasic || !data.latestQuote) {
      throw new Error("无法获取股票数据");
    }

    // 构建 profile
    const profile = {
      name: data.stockBasic.name || "未知公司",
      symbol: symbol,
      sector: data.stockBasic.industry || "未知行业",
      business: data.stockBasic.area || "中国",
      employees: null,
      ipoDate: data.stockBasic.list_date
        ? `${data.stockBasic.list_date.slice(0, 4)}-${data.stockBasic.list_date.slice(4, 6)}-${data.stockBasic.list_date.slice(6, 8)}`
        : undefined,
      country: "中国",
    };

    // 构建 quote
    const latestQuote = data.latestQuote;
    const dailyBasic = data.dailyBasic;

    const quote: Quote = {
      symbol: symbol,
      name: profile.name,
      price: latestQuote.close || 0,
      changePercent: latestQuote.pct_chg || 0,
      pe: dailyBasic?.pe || 0,
      pb: dailyBasic?.pb || 0,
      marketCap: dailyBasic?.total_mv ? dailyBasic.total_mv / 1000000 : 0, // 转换为万亿
    };

    // 构建财务数据
    const financialData: FinancialData[] = [];
    if (data.incomeStatements && data.financialIndicators) {
      for (let i = 0; i < Math.min(5, data.incomeStatements.length); i++) {
        const income = data.incomeStatements[i];
        const indicator = data.financialIndicators[i];

        if (!income || !indicator) continue;

        const year = parseInt(income.end_date?.slice(0, 4) || "0");
        if (!year) continue;

        // 上一年数据用于计算增长率
        const prevIncome = data.incomeStatements[i + 1];
        const prevIndicator = data.financialIndicators[i + 1];

        const revenue = (income.revenue || 0) / 100000000; // 转换为亿元
        const netProfit = (income.n_income || 0) / 100000000;
        const prevRevenue = prevIncome ? (prevIncome.revenue || 0) / 100000000 : revenue;
        const prevNetProfit = prevIncome ? (prevIncome.n_income || 0) / 100000000 : netProfit;

        financialData.push({
          year,
          revenue,
          grossProfit: ((income.revenue || 0) - (income.oper_cost || 0)) / 100000000,
          netProfit,
          freeCashFlow: indicator.fcff ? indicator.fcff / 100000000 : 0,
          revenueGrowth:
            prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0,
          netProfitGrowth:
            prevNetProfit > 0 ? ((netProfit - prevNetProfit) / prevNetProfit) * 100 : 0,
          epsGrowth: indicator.eps_yoy || 0,
          fcfGrowth: 0, // Tushare 没有直接提供，可以自己计算
        });
      }
    }

    // 反转数组，让年份从旧到新
    financialData.reverse();

    // 构建估值指标
    const valuation: ValuationMetrics = {
      currentPrice: quote.price,
      dcfIntrinsicValue: quote.price * 0.9, // 简单估算，后续可以接入更复杂的 DCF 模型
      potentialUpside: -10,
      pe: quote.pe,
      pb: quote.pb,
      ps: dailyBasic?.ps || 0,
      evEbitda: 0, // Tushare 基础版没有 EV/EBITDA
      dividendYield: dailyBasic?.dv_ratio || 0,
      yieldRate: dailyBasic?.total_share ? (quote.marketCap * 10000) / dailyBasic.total_share : 0,
    };

    // 计算长期增长率
    const longTermGrowth =
      financialData.length >= 3
        ? {
            revenue3Y: calculateCAGR(
              financialData[financialData.length - 3].revenue,
              financialData[financialData.length - 1].revenue,
              3
            ),
            revenue5Y:
              financialData.length >= 5
                ? calculateCAGR(
                    financialData[0].revenue,
                    financialData[financialData.length - 1].revenue,
                    financialData.length
                  )
                : 0,
            revenue10Y: 0, // 需要更多年份数据
            netProfit3Y: calculateCAGR(
              financialData[financialData.length - 3].netProfit,
              financialData[financialData.length - 1].netProfit,
              3
            ),
            netProfit5Y:
              financialData.length >= 5
                ? calculateCAGR(
                    financialData[0].netProfit,
                    financialData[financialData.length - 1].netProfit,
                    financialData.length
                  )
                : 0,
            netProfit10Y: 0,
          }
        : undefined;

    // 构建亮点指标
    const latestFinancial = financialData[financialData.length - 1];
    const highlights = latestFinancial
      ? [
          {
            label: "收入增速",
            value: `YOY ${latestFinancial.revenueGrowth >= 0 ? "+" : ""}${latestFinancial.revenueGrowth.toFixed(1)}%`,
          },
          {
            label: "净利率",
            value: `${((latestFinancial.netProfit / latestFinancial.revenue) * 100).toFixed(1)}%`,
          },
          {
            label: "市盈率",
            value: `${quote.pe.toFixed(1)}x`,
          },
          {
            label: "市净率",
            value: `${quote.pb.toFixed(1)}x`,
          },
        ]
      : [];

    return {
      profile,
      quote,
      highlights,
      news: [], // 新闻需要单独获取
      financialData,
      valuation,
      longTermGrowth,
    };
  } catch (error) {
    console.error("获取公司数据失败:", error);
    throw error;
  }
}

/**
 * 计算复合年增长率（CAGR）
 */
function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || endValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * 获取自选股行情（真实数据）
 */
export async function getWatchlistQuotesLive(symbols: string[]): Promise<Quote[]> {
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const tsCode = convertToTsCode(symbol);
        const [latestQuote, dailyBasic] = await Promise.all([
          getLatestQuote(tsCode),
          getDailyBasic(tsCode),
        ]);

        if (!latestQuote) {
          return null;
        }

        return {
          symbol,
          name: "未知", // 需要从 stock_basic 获取
          price: latestQuote.close || 0,
          changePercent: latestQuote.pct_chg || 0,
          pe: dailyBasic?.pe || 0,
          pb: dailyBasic?.pb || 0,
          marketCap: dailyBasic?.total_mv ? dailyBasic.total_mv / 1000000 : 0,
        };
      } catch (error) {
        console.error(`获取 ${symbol} 行情失败:`, error);
        return null;
      }
    })
  );

  return quotes.filter((q) => q !== null) as Quote[];
}

/**
 * 生成 AI 投资分析
 */
export async function generateAIAnalysis(snapshot: CompanySnapshot): Promise<string> {
  try {
    const analysis = await generateCompanyAnalysis({
      name: snapshot.profile.name,
      symbol: snapshot.profile.symbol,
      sector: snapshot.profile.sector,
      financialData: snapshot.financialData || [],
      quote: snapshot.quote,
    });

    return analysis;
  } catch (error) {
    console.error("生成 AI 分析失败:", error);
    return "AI 分析暂时不可用，请稍后再试。";
  }
}
