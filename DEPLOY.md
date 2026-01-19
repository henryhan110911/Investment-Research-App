# 部署到 Vercel 指南

## 步骤 1：推送代码到 GitHub

### 1.1 在 GitHub 创建新仓库
1. 访问 https://github.com/new
2. 仓库名称：`investor-assistant`（或任意名称）
3. 设置为 **Private**（私有，保护你的项目）
4. **不要**勾选 "Initialize with README"
5. 点击 "Create repository"

### 1.2 推送代码
复制 GitHub 给你的命令，在项目目录下运行：

```bash
cd C:\Users\Admin\Desktop\Cursor\investor-assistant

# 添加远程仓库（替换成你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/你的用户名/investor-assistant.git

# 推送代码
git branch -M main
git push -u origin main
```

输入 GitHub 账号密码（或使用 Token）完成推送。

---

## 步骤 2：在 Vercel 部署

### 2.1 注册/登录 Vercel
1. 访问 https://vercel.com/signup
2. 选择 "Continue with GitHub" 使用 GitHub 账号登录
3. 授权 Vercel 访问你的 GitHub 仓库

### 2.2 导入项目
1. 登录后点击 "Add New..." → "Project"
2. 找到你的 `investor-assistant` 仓库
3. 点击 "Import"

### 2.3 配置环境变量（重要！）
在部署配置页面，展开 "Environment Variables" 部分，添加：

| Name | Value |
|------|-------|
| `OPENROUTER_API_KEY` | `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` |
| `TUSHARE_API_TOKEN` | （如果有就填，没有就先不填） |

### 2.4 部署
1. 点击 "Deploy" 按钮
2. 等待 2-3 分钟构建完成
3. 部署成功后会显示线上地址，如：`https://investor-assistant-xxx.vercel.app`

---

## 步骤 3：访问你的线上应用

部署完成后：

1. 点击 Vercel 给的域名
2. 访问 `/research` 页面
3. 输入股票代码（如 600519）
4. 测试 AI 分析功能

---

## 常见问题

### Q: 推送到 GitHub 时要求输入密码？
A: GitHub 已不支持密码登录，需要使用 Personal Access Token：
1. 访问 https://github.com/settings/tokens
2. 生成新 Token（选择 `repo` 权限）
3. 使用 Token 代替密码

### Q: Vercel 构建失败？
A: 检查：
- 环境变量是否正确配置
- 项目根目录是否有 `package.json`
- 是否推送了 `node_modules`（不应该推送）

### Q: 部署成功但功能不工作？
A: 检查：
- Vercel 环境变量是否正确配置
- OpenRouter API Key 是否有效
- 浏览器控制台是否有错误信息

### Q: 如何更新线上代码？
A: 只需推送新代码到 GitHub：
```bash
git add .
git commit -m "Update features"
git push
```
Vercel 会自动重新部署。

---

## 下一步

- 绑定自定义域名（在 Vercel 项目设置中）
- 添加更多功能（新闻爬取、研报解读等）
- 优化性能和 UI
