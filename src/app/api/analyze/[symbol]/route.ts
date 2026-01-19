import { NextRequest, NextResponse } from "next/server";
import { getCompanySnapshot } from "@/lib/data/a-share";
import { generateAIAnalysis } from "@/lib/data/a-share-live";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    // 获取公司数据
    const snapshot = await getCompanySnapshot(symbol);

    // 生成 AI 分析
    const analysis = await generateAIAnalysis(snapshot);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("AI 分析失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: "生成分析失败",
      },
      { status: 500 }
    );
  }
}
