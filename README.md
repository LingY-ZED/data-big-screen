# 数据大屏 DataVisionLab

一个公开开源的教学型数据可视化大屏项目，用于帮助学生和初学者从 0 到 1 学习如何使用现代前端技术搭建完整的数据大屏。

项目当前阶段是纯前端实现，所有业务数据来自 mock。后续可以通过统一数据源配置平滑切换到真实 API。

## 技术栈

- Vue 3
- Vite
- TypeScript
- ECharts
- Pinia
- Axios
- MSW
- Vitest
- Playwright
- ESLint
- Prettier
- Stylelint

## 功能特性

- 1920x1080 风格科技感数据大屏
- 自适应浏览器窗口缩放
- 顶部标题、当前时间、数据更新时间
- 核心指标卡片
- 访问趋势折线图
- 分类占比饼图
- 城市排名柱状图
- 能力雷达图
- 中心态势总览图
- 实时动态列表
- mock 数据与真实 API 数据源切换机制
- 统一日志系统
- 单元测试与 E2E 测试
- 代码质量检查与格式化配置

## 快速开始

```bash
npm install
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5173/
```

## 常用命令

```bash
# 启动开发服务
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview

# 代码质量检查
npm run lint

# 格式化代码
npm run format

# 单元测试
npm run test

# E2E 测试
npm run test:e2e
```

首次运行 Playwright E2E 测试前，如果本机没有浏览器二进制，需要执行：

```bash
npx playwright install chromium
```

## 数据源切换

项目默认使用 mock 数据：

```env
VITE_DATA_SOURCE=mock
```

切换到真实 API：

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=https://your-api.example.com/api
```

页面组件不会直接读取 mock 文件，统一通过 `src/services/dashboardService.ts` 获取数据。

## 目录结构

```text
src/
  app/                 # 应用入口
  assets/              # 静态资源与全局样式
  components/          # 通用展示组件
  charts/              # ECharts 图表组件
  views/               # 页面视图
  layouts/             # 大屏布局
  services/            # HTTP 与业务服务
  mocks/               # MSW mock 数据与接口处理
  stores/              # Pinia 状态管理
  utils/               # 工具函数
  logs/                # 日志系统
  types/               # TypeScript 类型定义
  tests/
    unit/              # Vitest 单元测试
    e2e/               # Playwright E2E 测试
```

## 日志系统

日志入口位于：

```text
src/logs/logger.ts
```

当前支持：

- `logger.info`
- `logger.warn`
- `logger.error`
- `logger.debug`

开发环境会输出到 console，后续可以在这里扩展 Sentry、OpenTelemetry 或其他日志平台。

## Mock 数据

mock 数据入口：

```text
src/mocks/dashboardMock.ts
```

MSW 接口处理：

```text
src/mocks/handlers.ts
```

当前 mock 数据包含：

- summary metrics
- trend data
- category distribution
- ranking data
- radar data
- activity list
- map overview data

## 测试说明

单元测试覆盖：

- 格式化工具函数
- mock 模式下的 dashboardService 数据读取

E2E 测试覆盖：

- 首页可打开
- 大屏标题存在
- 至少一个核心指标卡片存在
- 至少一个图表容器存在
- 页面无严重运行错误

## 教学建议

推荐学习顺序：

1. 从 `src/views/DashboardView.vue` 理解整体页面结构。
2. 查看 `src/services/dashboardService.ts`，理解组件如何通过服务层获取数据。
3. 查看 `src/mocks/dashboardMock.ts` 和 `src/mocks/handlers.ts`，理解 mock 数据流。
4. 查看 `src/charts/useEChart.ts`，理解 ECharts 在 Vue 组件中的初始化、更新和销毁。
5. 查看 `src/stores/dashboardStore.ts`，理解 Pinia 如何管理页面状态。
6. 运行 `npm run test` 和 `npm run test:e2e`，理解测试系统如何保护项目质量。

## 许可

本项目用于教学演示，可按你的开源计划补充具体 License。
