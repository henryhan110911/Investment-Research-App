# API 接入配置说明

本项目已集成 **OpenRouter**（LLM AI）和 **Tushare**（A 股数据）API。

## 1. OpenRouter API 配置

### 获取 API Key
1. 访问 [OpenRouter](https://openrouter.ai/keys)
2. 注册/登录账号
3. 创建 API Key
4. 充值余额（按使用量付费）

### 配置到项目
编辑 `investor-assistant/.env.local` 文件：

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxx
```

### 使用的模型
- 默认：`anthropic/claude-3.5-sonnet`（推荐）
- 备选：`openai/gpt-4o`、`google/gemini-pro` 等

### 功能
- 生成公司投资分析报告
- 解读新闻对公司的影响
- 生成投资主题逻辑说明

---

## 2. Tushare API 配置

### 获取 Token
1. 访问 [Tushare](https://tushare.pro/register) 注册账号
2. 登录后进入 [用户中心](https://tushare.pro/user/token)
3. 复制你的 Token
4. 积分获取方式：
   - 注册即送 100 积分
   - 每日签到 +1 积分
   - 完成任务（如论坛发帖）可获得更多积分

### 配置到项目
编辑 `investor-assistant/.env.local` 文件：

```env
TUSHARE_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 接口权限说明
| 接口 | 所需积分 | 用途 |
|-----|---------|------|
| `stock_basic` | 免费 | 股票基本信息 |
| `daily` | 免费 | 日线行情 |
| `daily_basic` | 120 | 每日指标（PE/PB等） |
| `income` | 120 | 利润表 |
| `balancesheet` | 120 | 资产负债表 |
| `cashflow` | 120 | 现金流量表 |
| `fina_indicator` | 120 | 财务指标 |

免费版（100积分）可以使用基础行情接口，需要 120 积分才能获取财务数据。

### 积分不足时的替代方案
如果积分不够，可以：
1. 完成 Tushare 论坛任务获取积分
2. 或者只接入免费的行情接口，财务数据继续使用 mock 数据
3. 或者使用其他免费数据源（如新浪财经，但稳定性较差）

---

## 3. 完整配置示例

创建或编辑 `investor-assistant/.env.local`：

```env
# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxx

# Tushare API
TUSHARE_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**重要提示：**
- `.env.local` 文件已被 `.gitignore` 忽略，不会提交到 Git
- 请勿将 API Key 和 Token 泄露给他人
- 配置完成后需要重启开发服务器

---

## 4. 使用 API

### 在公司详情页查看真实数据
1. 配置好 API Key 和 Token
2. 重启开发服务器：`npm run dev`
3. 访问 `http://localhost:3000/company/600519`
4. 点击"生成分析"按钮，查看 AI 投资分析

### 切换到真实数据源
当前默认使用 mock 数据（`a-share.ts`），如需切换到真实 API：

编辑 `src/app/company/[symbol]/page.tsx`：

```typescript
// 替换这一行
import { getCompanySnapshot } from "@/lib/data/a-share";

// 改为
import { getCompanySnapshotLive as getCompanySnapshot } from "@/lib/data/a-share-live";
```

---

## 5. API 调用限制

### OpenRouter
- 按使用量计费
- Claude 3.5 Sonnet: ~$3/百万 tokens
- 建议充值 $5-10 用于开发测试

### Tushare
- 免费版：200 次/天
- 如果超出限制，会返回错误，系统会自动降级到 mock 数据

---

## 6. 故障排查

### OpenRouter 报错
- 检查 API Key 是否正确
- 检查账户余额是否充足
- 查看浏览器控制台的错误信息

### Tushare 报错
- 检查 Token 是否正确
- 检查积分是否足够（访问 https://tushare.pro/user/token 查看）
- 检查网络连接（Tushare 服务器在国内）

### 都配置好了但还是返回 mock 数据
- 确认 `.env.local` 文件在正确的位置（`investor-assistant/.env.local`）
- 确认环境变量名称拼写正确
- 重启开发服务器

---

## 7. 下一步

配置完成后，可以：
1. 在公司页面点击"生成分析"，测试 AI 功能
2. 切换到真实数据源，查看实际的 A 股行情和财务数据
3. 根据需要调整 AI prompt（在 `src/lib/api/openrouter.ts`）
4. 扩展更多功能（如新闻爬取、研报解读等）
