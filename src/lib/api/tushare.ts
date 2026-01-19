/**
 * Tushare API 调用模块
 * 用于获取 A 股数据（行情、财务、公告等）
 */

const TUSHARE_API_TOKEN = process.env.TUSHARE_API_TOKEN;
const TUSHARE_API_URL = "http://api.tushare.pro";

export type TushareParams = {
  [key: string]: any;
};

/**
 * 调用 Tushare API
 */
async function callTushareAPI(
  apiName: string,
  params: TushareParams = {},
  fields?: string[]
): Promise<any> {
  if (!TUSHARE_API_TOKEN) {
    console.warn("Tushare API Token 未配置，返回模拟数据");
    return null;
  }

  try {
    const response = await fetch(TUSHARE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_name: apiName,
        token: TUSHARE_API_TOKEN,
        params: params,
        fields: fields?.join(","),
      }),
    });

    if (!response.ok) {
      throw new Error(`Tushare API 错误: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 0) {
      console.error("Tushare API 返回错误:", data.msg);
      return null;
    }

    // 将返回数据转换为对象数组
    const fields_list = data.data.fields;
    const items = data.data.items;

    return items.map((item: any[]) => {
      const obj: any = {};
      fields_list.forEach((field: string, index: number) => {
        obj[field] = item[index];
      });
      return obj;
    });
  } catch (error) {
    console.error("Tushare API 调用异常:", error);
    return null;
  }
}

/**
 * 获取股票基本信息
 */
export async function getStockBasic(tsCode: string) {
  const result = await callTushareAPI("stock_basic", {
    ts_code: tsCode,
  });
  return result?.[0] || null;
}

/**
 * 获取实时行情（日线数据）
 */
export async function getDailyQuote(tsCode: string, tradeDate?: string) {
  const result = await callTushareAPI("daily", {
    ts_code: tsCode,
    trade_date: tradeDate,
  });
  return result?.[0] || null;
}

/**
 * 获取最新日线行情
 */
export async function getLatestQuote(tsCode: string) {
  // 获取最近10个交易日的数据，取第一条
  const result = await callTushareAPI(
    "daily",
    {
      ts_code: tsCode,
    },
    ["ts_code", "trade_date", "open", "high", "low", "close", "pre_close", "change", "pct_chg", "vol", "amount"]
  );

  if (!result || result.length === 0) {
    return null;
  }

  // 返回最新一条
  return result[0];
}

/**
 * 获取每日指标（市盈率、市净率等）
 */
export async function getDailyBasic(tsCode: string, tradeDate?: string) {
  const result = await callTushareAPI("daily_basic", {
    ts_code: tsCode,
    trade_date: tradeDate,
  });
  return result?.[0] || null;
}

/**
 * 获取利润表数据
 */
export async function getIncomeStatement(tsCode: string, reportType: string = "1") {
  // report_type: 1-合并报表 2-单季报表
  const result = await callTushareAPI("income", {
    ts_code: tsCode,
    report_type: reportType,
  });
  return result || [];
}

/**
 * 获取资产负债表数据
 */
export async function getBalanceSheet(tsCode: string, reportType: string = "1") {
  const result = await callTushareAPI("balancesheet", {
    ts_code: tsCode,
    report_type: reportType,
  });
  return result || [];
}

/**
 * 获取现金流量表数据
 */
export async function getCashFlowStatement(tsCode: string, reportType: string = "1") {
  const result = await callTushareAPI("cashflow", {
    ts_code: tsCode,
    report_type: reportType,
  });
  return result || [];
}

/**
 * 获取财务指标数据
 */
export async function getFinancialIndicator(tsCode: string) {
  const result = await callTushareAPI("fina_indicator", {
    ts_code: tsCode,
  });
  return result || [];
}

/**
 * 获取公司公告
 */
export async function getCompanyAnnouncement(tsCode: string, startDate?: string, endDate?: string) {
  const result = await callTushareAPI("anns", {
    ts_code: tsCode,
    start_date: startDate,
    end_date: endDate,
  });
  return result || [];
}

/**
 * 获取新闻
 */
export async function getNews(startDate?: string, endDate?: string, src?: string) {
  const result = await callTushareAPI("news", {
    start_date: startDate,
    end_date: endDate,
    src: src, // 来源：sina, 10jqka等
  });
  return result || [];
}

/**
 * 转换股票代码格式
 * 例如：600519 -> 600519.SH, 000858 -> 000858.SZ, 300750 -> 300750.SZ
 */
export function convertToTsCode(symbol: string): string {
  // 如果已经是 TS 格式，直接返回
  if (symbol.includes(".")) {
    return symbol;
  }

  // 6开头是上海主板
  if (symbol.startsWith("6")) {
    return `${symbol}.SH`;
  }
  // 0开头是深圳主板
  else if (symbol.startsWith("0")) {
    return `${symbol}.SZ`;
  }
  // 3开头是创业板
  else if (symbol.startsWith("3")) {
    return `${symbol}.SZ`;
  }
  // 默认上海
  return `${symbol}.SH`;
}

/**
 * 获取完整的公司数据（行情+基本面+财务）
 */
export async function getFullCompanyData(symbol: string) {
  const tsCode = convertToTsCode(symbol);

  const [stockBasic, latestQuote, dailyBasic, incomeStatements, financialIndicators] =
    await Promise.all([
      getStockBasic(tsCode),
      getLatestQuote(tsCode),
      getDailyBasic(tsCode),
      getIncomeStatement(tsCode),
      getFinancialIndicator(tsCode),
    ]);

  return {
    stockBasic,
    latestQuote,
    dailyBasic,
    incomeStatements: incomeStatements.slice(0, 5), // 只取最近5期
    financialIndicators: financialIndicators.slice(0, 5),
  };
}
