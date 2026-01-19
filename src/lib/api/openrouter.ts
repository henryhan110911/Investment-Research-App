/**
 * OpenRouter API 调用模块
 * 用于调用各种 LLM 模型进行 AI 解读和分析
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type OpenRouterOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

/**
 * 调用 OpenRouter API
 */
export async function callOpenRouter(
  messages: ChatMessage[],
  options: OpenRouterOptions = {}
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.warn("OpenRouter API Key 未配置，返回模拟响应");
    return "（AI 解读功能需要配置 OpenRouter API Key）";
  }

  const {
    model = "anthropic/claude-3.5-sonnet", // 默认使用 Claude 3.5 Sonnet
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // 可选：用于统计
        "X-Title": "投研助手·A股", // 可选：用于统计
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API 调用失败:", errorData);
      throw new Error(`OpenRouter API 错误: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenRouter API 调用异常:", error);
    throw error;
  }
}

/**
 * 生成公司分析报告
 */
export async function generateCompanyAnalysis(companyData: {
  name: string;
  symbol: string;
  sector: string;
  financialData: any[];
  quote: any;
}): Promise<string> {
  const prompt = `你是一位专业的 A 股投资分析师。请基于以下公司数据，生成一份简洁的投资分析报告（300字以内）：

公司名称：${companyData.name}（${companyData.symbol}）
所属行业：${companyData.sector}
当前股价：¥${companyData.quote.price}
市盈率：${companyData.quote.pe}x
市净率：${companyData.quote.pb}x

近5年财务数据：
${companyData.financialData
  .map(
    (d) =>
      `${d.year}年：营收 ${d.revenue}亿元（增长${d.revenueGrowth}%），净利润 ${d.netProfit}亿元（增长${d.netProfitGrowth}%）`
  )
  .join("\n")}

请从以下角度分析：
1. 公司基本面评价（成长性、盈利能力）
2. 估值水平判断（是否合理）
3. 投资建议与风险提示

要求：
- 客观、专业、简洁
- 避免过度乐观或悲观
- 突出关键指标和趋势`;

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "你是一位经验丰富的 A 股投资分析师，擅长基本面分析和价值投资。你的分析客观、专业、有洞察力。",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  return await callOpenRouter(messages, {
    model: "anthropic/claude-3.5-sonnet",
    temperature: 0.7,
    maxTokens: 800,
  });
}

/**
 * 解读新闻对公司的影响
 */
export async function analyzeNewsImpact(
  companyName: string,
  newsTitle: string,
  newsSummary: string
): Promise<string> {
  const prompt = `请用投资人的角度，分析这条新闻对 ${companyName} 的影响（100字以内）：

新闻标题：${newsTitle}
新闻摘要：${newsSummary}

请简要说明：
1. 这条新闻是利好、利空还是中性？
2. 影响程度（短期/长期）
3. 对投资决策的启示`;

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "你是一位专业的财经新闻分析师，善于快速解读新闻对上市公司的影响。",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  return await callOpenRouter(messages, {
    model: "anthropic/claude-3.5-sonnet",
    temperature: 0.6,
    maxTokens: 300,
  });
}

/**
 * 生成投资机会描述
 */
export async function generateInvestmentThesis(
  themeName: string,
  relatedCompanies: string[]
): Promise<string> {
  const prompt = `请为投资主题"${themeName}"生成一份投资逻辑说明（150字以内）：

相关公司：${relatedCompanies.join("、")}

请说明：
1. 为什么这个主题值得关注？
2. 关键驱动因素是什么？
3. 适合什么类型的投资者？`;

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "你是一位主题投资策略分析师，善于发现市场机会和投资逻辑。",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  return await callOpenRouter(messages, {
    model: "anthropic/claude-3.5-sonnet",
    temperature: 0.7,
    maxTokens: 400,
  });
}
