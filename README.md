# 智能资产问答前端

本项目是一个基于 Vue 3 和 Element Plus 构建的企业级智能问答助手前端界面。它为“数据作战室”提供了一个核心交互窗口，允许业务人员和数据分析师通过自然语言查询指标、维度、数据表等资产信息，并以友好的方式展示查询结果。

## ✨ 核心功能

- **现代化管理后台布局**：采用经典的顶部导航 + 左侧菜单布局，结构清晰，易于扩展。
- **智能问答核心界面**：支持多轮对话、流式响应（打字机效果）和Markdown格式渲染（如表格、列表等）。
- **友好的交互体验**：
  - **猜你想问**：为新会话提供常见问题引导。
  - **加载与中断**：包含精细的加载状态（打字光标）和随时“停止生成”的功能。
  - **自适应输入框**：支持多行输入（`Shift+Enter`换行）和快捷发送（`Enter`发送）。
  - **视觉优化**：对话气泡样式精致，布局紧凑，完美贴合内容。
- **组件化与路由**：基于 `vue-router` 的清晰页面导航和高度组件化的代码结构，可维护性高。

## 💻 技术栈

- **Vue 3** (Composition API)
- **Vite**
- **Element Plus**
- **Vue Router**
- **Markdown-it** (用于渲染AI返回的Markdown内容)

## 📁 项目结构

```
/src
├── assets/         # 静态资源 (全局CSS等)
├── layouts/        # 布局组件 (MainLayout.vue)
├── public/         # 公共静态资源 (logo.svg)
├── router/         # 路由配置 (index.js)
├── views/          # 页面级视图组件 (Chat.vue, ComingSoon.vue)
├── App.vue         # 主应用组件 (路由出口)
└── main.js         # 应用入口文件
```

## 🚀 快速开始

1. **克隆项目到本地**
   ```bash
   git clone <your-repo-url>
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **运行开发服务器**
   ```bash
   npm run dev
   ```
   服务器通常会在 `http://localhost:5173` 启动。

4. **后端接口要求**
   本项目需要一个后端服务提供流式响应接口：
   - **URL**: `/chat-stream`
   - **Method**: `POST`
   - **Request Body**: `{ "query": "用户问题", "history": [...] }`

## 📜 可用脚本

- `npm run dev`: 启动开发服务器并开启热更新。
- `npm run build`: 将项目打包构建为生产环境版本。
- `npm run preview`: 在本地预览生产环境的构建产物。
