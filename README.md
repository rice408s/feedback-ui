# Ima Studio - 反馈应用

这是一个基于 Figma 设计稿复刻的聊天反馈应用界面。

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **TailwindCSS** - 样式框架

## 项目结构

```
feedback/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx      # 左侧边栏组件
│   │   ├── TopBar.tsx        # 顶部栏组件
│   │   ├── ChatArea.tsx      # 聊天区域组件
│   │   └── InputBox.tsx      # 输入框组件
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── index.html                # HTML 模板
├── tailwind.config.js        # Tailwind 配置
└── package.json              # 项目依赖
```

## 功能特性

- ✅ 侧边栏导航和聊天历史
- ✅ 顶部工具栏
- ✅ 聊天消息显示（支持文本、图片、视频）
- ✅ 消息输入框
- ✅ 响应式设计

## 开发命令

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本
\`\`\`bash
npm run build
\`\`\`

## 访问应用

开发服务器已启动，访问: http://localhost:5174/

## License

MIT
