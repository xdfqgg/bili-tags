# bili-tags — B 站推荐页标签注入扩展（教学项目）

> 目标：亲历一个真实项目的完整生命周期（需求 → 侦察 → 选型 → 开发 → 测试 → 审查 → CI → 文档），巩固知识 + 评估 AI 代码质量。
> 节奏：每步停下确认；全讲解模式（AI 写代码讲原理，用户在决策点拍板）。

## 项目目标

Chrome 扩展（Manifest V3）：
1. 在 bilibili.com 推荐页的视频卡片上注入用户自定义标签 badge；
2. 在页面顶部注入「我的视频卡片面板」（curated panel）。

## 已定决策（2026-08-22）

- 项目位置：`F:\claude111\bili-tags\`（源码在本仓库）
- GitHub：连远程仓库（gh CLI 未装 → git 原生命令，认证方式 Step 1 选）
- 数据来源：从 B 站 API 抓取（合规底线见下）
- 技术栈：TypeScript + esbuild + Shadow DOM + chrome.storage.local（2026-08-23 定，详见 docs/ADR/）
- 节奏：全讲解模式，每步停下确认

## 教学约定（每步固定格式）

1. 🎯 这步在真实项目里的名称
2. ⚖️ 2–3 个方案 + 取舍 → 用户拍板
3. 💡 **零基础讲解**（2026-08-23 用户要求）：每个术语给全称 + 生活类比，不跳过任何前置概念；**不主动输出面试话术**
4. 🔍 代码写完 → Agent 并行审查（正确性/规范/安全/简洁）→ ReportFindings

## 13 步大纲

| 阶段 | 步骤 |
|------|------|
| 地基 | Step 0 需求澄清 / Step 1 Git 工作流 / Step 2 技术选型 + ADR |
| 侦察 | Step 3 B站页面 + API Spike |
| 构建 | Step 4 Walking Skeleton / Step 5 数据层 + options / Step 6 content_script / Step 7 API 接入 + 降级 / Step 8 测试 |
| 质量交付 | Step 9 代码审查 / Step 10 调试实战 / Step 11 CI/CD / Step 12 文档 + 迭代 |

进度见 `任务清单.md`。

## 合规底线

- 不采集用户浏览数据，不上传任何信息，数据仅存 chrome.storage.local
- API 调用只读、限频、缓存、失败降级到手动清单；不伪造请求头

## 需求文档

见 `docs/需求文档.md`（Step 0 产物，已与用户确认）。

**核心需求一句话**：把「按标签关键词从 B 站 API 搜来的视频卡片」以 30% 概率随机混入推荐页首页信息流，带标签 badge 标记，帮用户夺回信息流控制权。

**已砍**：顶部「我的视频卡片」面板、parseVideoId、多页面范围。


## 技术决策记录

见 `docs/ADR/`；侦察笔记见 `docs/侦察笔记/`
