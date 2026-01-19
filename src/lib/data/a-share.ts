export type Quote = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  pe: number;
  pb: number;
  marketCap: number;
};

export type NewsItem = {
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  related: string[];
};

export type FinancialData = {
  year: number;
  revenue: number; // 营收（亿元）
  grossProfit: number; // 毛利润（亿元）
  netProfit: number; // 净利润（亿元）
  freeCashFlow: number; // 自由现金流（亿元）
  revenueGrowth: number; // 营收增长率 %
  netProfitGrowth: number; // 净利润增长率 %
  epsGrowth: number; // EPS增长率 %
  fcfGrowth: number; // 自由现金流增长率 %
};

export type ValuationMetrics = {
  currentPrice: number;
  dcfIntrinsicValue: number;
  potentialUpside: number; // %
  pe: number;
  pb: number;
  ps: number;
  evEbitda: number;
  dividendYield: number;
  yieldRate: number;
};

export type CompanySnapshot = {
  profile: {
    name: string;
    symbol: string;
    sector: string;
    business: string;
    employees?: number;
    ipoDate?: string;
    country?: string;
  };
  quote: Quote;
  highlights: { label: string; value: string }[];
  news: NewsItem[];
  financialData?: FinancialData[]; // 年度财务数据
  valuation?: ValuationMetrics; // 估值指标
  longTermGrowth?: {
    revenue3Y: number;
    revenue5Y: number;
    revenue10Y: number;
    netProfit3Y: number;
    netProfit5Y: number;
    netProfit10Y: number;
  };
};

const fallbackQuotes: Record<string, Quote> = {
  "600519": {
    symbol: "600519",
    name: "贵州茅台",
    price: 1600,
    changePercent: 1.2,
    pe: 26.5,
    pb: 7.1,
    marketCap: 2.02,
  },
  "300750": {
    symbol: "300750",
    name: "宁德时代",
    price: 185.4,
    changePercent: -0.8,
    pe: 24.1,
    pb: 4.3,
    marketCap: 0.86,
  },
  "601318": {
    symbol: "601318",
    name: "中国平安",
    price: 46.3,
    changePercent: 0.5,
    pe: 8.7,
    pb: 1.1,
    marketCap: 0.84,
  },
  "000858": {
    symbol: "000858",
    name: "五粮液",
    price: 170.1,
    changePercent: 0.3,
    pe: 18.5,
    pb: 4.5,
    marketCap: 0.66,
  },
  "600036": {
    symbol: "600036",
    name: "招商银行",
    price: 34.8,
    changePercent: 0.1,
    pe: 5.8,
    pb: 0.9,
    marketCap: 0.88,
  },
};

const fallbackNews: NewsItem[] = [
  {
    title: "AI 服务器订单超预期，龙头厂商上调全年指引",
    source: "财联社",
    publishedAt: "今天 08:30",
    summary:
      "公司披露 2025 年 AI 服务器订单同比+60%，受益于海外云厂商及国内大模型算力扩张。",
    related: ["603160", "688041"],
  },
  {
    title: "白酒行业春节动销平稳，高端价盘坚挺",
    source: "券商晨报",
    publishedAt: "今天 07:45",
    summary:
      "渠道反馈高端白酒批价稳中有升，动销恢复常态。中高端梯队恢复仍需时间。",
    related: ["600519", "000858"],
  },
  {
    title: "新能源车 1 月销量延续高增，电池装机量同比+35%",
    source: "乘联会",
    publishedAt: "昨天 21:00",
    summary:
      "龙头车企新品放量，海外出口贡献增量；电池龙头受益高镍产品放量与成本下行。",
    related: ["300750", "002594"],
  },
];

const fallbackHighlights = [
  { label: "收入增速", value: "YOY +12%" },
  { label: "毛利率", value: "76%" },
  { label: "ROE(TTM)", value: "27%" },
  { label: "经营现金流", value: "连续 6 年为正" },
];

export async function getDailyBriefing() {
  // TODO: 接入公开新闻源（如 RSSHub 的新浪/财新频道）+ LLM 解读
  return {
    date: new Date(),
    items: fallbackNews,
  };
}

export async function getWatchlistQuotes(symbols: string[]) {
  // TODO: 替换为真实 A 股免费行情接口（例如新浪/网易/HQ API），注意跨域与限频。
  return symbols.map((s) => fallbackQuotes[s] ?? fallbackQuotes["600519"]);
}

export async function getThemeIdeas() {
  return [
    {
      name: "AI 服务器/算力",
      thesis: "AI 算力和训练需求高增长，服务器与液冷配套受益。",
      symbols: ["603160", "688041", "300454"],
    },
    {
      name: "高端白酒",
      thesis: "高端价盘稳固，需求恢复常态，中长期现金流稳健。",
      symbols: ["600519", "000858", "603369"],
    },
    {
      name: "新能源车 & 电池",
      thesis: "销量高增 + 出口放量，电池技术迭代带来成本下降。",
      symbols: ["300750", "002594", "002460"],
    },
  ];
}

export async function getCompanySnapshot(symbol: string): Promise<CompanySnapshot> {
  const quote = fallbackQuotes[symbol] ?? fallbackQuotes["600519"];
  const profile = {
    name: quote.name,
    symbol,
    sector: "示例行业",
    business: "主营业务描述占位，后续可由公告/研报/官网抓取生成。",
    employees: 48000,
    ipoDate: "2001-08-27",
    country: "中国",
  };

  // 模拟财务数据（2021-2025）
  const financialData: FinancialData[] = [
    {
      year: 2021,
      revenue: 1094.6,
      grossProfit: 934.2,
      netProfit: 524.6,
      freeCashFlow: 602.3,
      revenueGrowth: 11.2,
      netProfitGrowth: 12.5,
      epsGrowth: 12.5,
      fcfGrowth: 15.3,
    },
    {
      year: 2022,
      revenue: 1275.5,
      grossProfit: 1102.8,
      netProfit: 627.2,
      freeCashFlow: 712.5,
      revenueGrowth: 16.5,
      netProfitGrowth: 19.6,
      epsGrowth: 19.6,
      fcfGrowth: 18.3,
    },
    {
      year: 2023,
      revenue: 1506.2,
      grossProfit: 1285.3,
      netProfit: 747.8,
      freeCashFlow: 845.2,
      revenueGrowth: 18.1,
      netProfitGrowth: 19.2,
      epsGrowth: 19.2,
      fcfGrowth: 18.6,
    },
    {
      year: 2024,
      revenue: 1689.4,
      grossProfit: 1423.6,
      netProfit: 823.5,
      freeCashFlow: 952.1,
      revenueGrowth: 12.2,
      netProfitGrowth: 10.1,
      epsGrowth: 10.1,
      fcfGrowth: 12.7,
    },
    {
      year: 2025,
      revenue: 1876.3,
      grossProfit: 1589.2,
      netProfit: 912.4,
      freeCashFlow: 1089.5,
      revenueGrowth: 11.1,
      netProfitGrowth: 10.8,
      epsGrowth: 10.8,
      fcfGrowth: 14.4,
    },
  ];

  const valuation: ValuationMetrics = {
    currentPrice: quote.price,
    dcfIntrinsicValue: quote.price * 0.85, // 模拟 DCF 值
    potentialUpside: -15.2,
    pe: quote.pe,
    pb: quote.pb,
    ps: 8.5,
    evEbitda: 12.3,
    dividendYield: 2.1,
    yieldRate: 6.27,
  };

  const longTermGrowth = {
    revenue3Y: 15.3,
    revenue5Y: 11.4,
    revenue10Y: 18.2,
    netProfit3Y: 13.9,
    netProfit5Y: 14.6,
    netProfit10Y: 16.8,
  };

  return {
    profile,
    quote,
    highlights: fallbackHighlights,
    news: fallbackNews.filter((n) => n.related.includes(symbol)).slice(0, 3),
    financialData,
    valuation,
    longTermGrowth,
  };
}

export async function getDiscoverIdeas() {
  return [
    {
      name: "高增长低估值",
      logic: "过去三年收入复合增速 >20%，PE(TTM) <20x。",
      picks: [
        { symbol: "300750", name: "宁德时代", reason: "新能源车渗透+储能双驱动" },
        { symbol: "002594", name: "比亚迪", reason: "车型矩阵丰富，出口放量" },
      ],
    },
    {
      name: "高分红+稳现金流",
      logic: "自由现金流稳定为正，股息率 5%+。",
      picks: [
        { symbol: "601318", name: "中国平安", reason: "寿险修复 + 分红稳定" },
        { symbol: "600036", name: "招商银行", reason: "零售优势，拨备充足" },
      ],
    },
    {
      name: "行业修复题材",
      logic: "周期底部向上，供需改善带来业绩弹性。",
      picks: [
        { symbol: "000858", name: "五粮液", reason: "高端白酒动销回暖" },
        { symbol: "603160", name: "汇顶科技", reason: "安卓高端机换机周期" },
      ],
    },
  ];
}
