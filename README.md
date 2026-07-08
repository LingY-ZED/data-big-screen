# 数据中心运行监控大屏 DataVisionLab

这是一个用于“大数据专题作业2”的数据中心运行监控大屏项目。项目会读取 `homework/` 文件夹中的作业数据，经过加工处理后写入 MySQL，并通过前后端联动展示 PC 端数据可视化大屏。

## 技术栈

- 前端：Vue 3、Vite、TypeScript、ECharts、Pinia、Axios
- 后端：Node.js、Express、MySQL2
- 数据库：MySQL 8.0
- Mock 与测试：MSW、Vitest、Playwright
- 质量工具：ESLint、Prettier、Stylelint
- 本地环境：Docker Compose

## 功能特性

- 基于作业 `.dat` 数据导入 MySQL
- 数据中心运行监控 PC 大屏
- 主机总数、CPU、内存、磁盘、健康度核心指标
- CPU / 内存 / 网络趋势图
- 机房主机分布图
- 主机负载排名
- 资源健康雷达
- 机房运行态势拓扑
- 实时告警列表
- 支持真实 API 与 mock 数据源切换
- 包含单元测试、E2E 测试和代码质量检查

## 数据文件

作业数据放在本地：

```text
homework/
  disk_tsar.dat
  host_detail.dat
  mod_detail.dat
  pref_tsar.dat
```

`homework/` 默认不提交到 Git 仓库。导入脚本会从该目录读取数据。

## 快速运行

1. 安装依赖：

```bash
npm install
```

2. 启动 MySQL：

```bash
npm run db:up
```

3. 导入作业数据：

```bash
npm run db:seed
```

4. 同时启动后端 API 和前端：

```bash
npm run dev:all
```

5. 浏览器访问：

```text
http://127.0.0.1:5173/
```

## 常用命令

```bash
# 仅启动前端
npm run dev

# 启动后端 API
npm run dev:server

# 同时启动后端和前端
npm run dev:all

# 启动 MySQL
npm run db:up

# 停止 MySQL
npm run db:down

# 初始化表并导入 homework 数据
npm run db:seed

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

## 环境变量

可参考 `.env.example`：

```env
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=datacenter_monitor
DB_USER=datacenter
DB_PASSWORD=datacenter_pass
SERVER_PORT=3001
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=/api
```

数据源切换：

```env
# 使用真实 MySQL API
VITE_DATA_SOURCE=api

# 使用前端 mock 数据
VITE_DATA_SOURCE=mock
```

## API

后端默认运行在：

```text
http://127.0.0.1:3001
```

接口：

- `GET /api/health`：数据库连接健康检查
- `GET /api/dashboard`：返回大屏聚合数据

前端开发服务已配置 `/api` 代理到后端。

## 数据库结构

核心表：

- `hosts`：主机维表，来自 `host_detail.dat`
- `metrics`：指标维表，来自 `mod_detail.dat`
- `metric_points`：统一时序指标表，来自 `disk_tsar.dat` 和 `pref_tsar.dat`

数据库 schema 位于：

```text
server/db/schema.sql
```

## 目录结构

```text
server/
  db/                  # MySQL schema 与连接
  scripts/             # homework 数据导入脚本
  services/            # 数据查询与聚合
  utils/               # TSV 解析工具

src/
  app/                 # 前端应用入口
  assets/              # 静态资源与全局样式
  components/          # 通用展示组件
  charts/              # ECharts 图表组件
  views/               # 大屏页面
  layouts/             # 1920x1080 自适应布局
  services/            # 前端 HTTP 与业务服务
  mocks/               # MSW mock 数据
  stores/              # Pinia 状态管理
  utils/               # 前端工具函数
  logs/                # 日志系统
  types/               # 前端类型定义
  tests/               # 单元测试与 E2E 测试
```

## 测试说明

单元测试覆盖：

- 格式化工具函数
- dashboardService 数据读取
- 后端数据聚合逻辑

E2E 测试覆盖：

- 首页可打开
- 大屏标题存在
- 至少一个核心指标卡片存在
- 至少一个图表容器存在
- 页面无严重运行错误

## Git 提交说明

`homework/` 原始数据被 `.gitignore` 忽略，不会提交到远端仓库。提交内容包括可运行代码、数据库 schema、导入脚本、配置模板和文档。
