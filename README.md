# zhuiblog

## 项目介绍

zhuiblog 是一个基于 VuePress 构建的个人技术博客，用于记录生活、分享知识。

## 技术栈

- **框架**：VuePress 1.x
- **主题**：vuepress-theme-reco
- **插件**：
  - @vuepress-reco/vuepress-plugin-pagation（分页功能）
  - @vuepress/plugin-pwa（渐进式 Web 应用）
  - @vuepress/plugin-search（搜索功能）

## 功能特性

- ✅ 简洁至上：以 Markdown 为中心的项目结构，专注于写作
- ✅ Vue 驱动：在 Markdown 中使用 Vue 组件，支持自定义主题
- ✅ 高性能：预渲染生成静态 HTML，页面加载时作为 SPA 运行
- ✅ PWA 支持：可离线访问，提升用户体验
- ✅ 搜索功能：快速查找内容
- ✅ 分页功能：方便浏览大量内容

## 目录结构

```
zhuiblog/
├── docs/             # 文档目录
│   ├── MySQL/        # MySQL 相关文档
│   ├── about/        # 关于相关内容
│   ├── fontend/      # 前端相关内容
│   ├── java/         # Java 相关内容
│   │   ├── collect/  # 集合相关
│   │   ├── jvm/      # JVM 相关
│   │   └── ...
│   ├── js/           # JavaScript 相关内容
│   ├── k8s/          # Kubernetes 相关内容
│   ├── life/         # 生活相关内容
│   ├── mianshi/      # 面试相关内容
│   ├── netty/        # Netty 相关内容
│   ├── tags/         # 标签相关内容
│   ├── technology/   # 技术相关内容
│   └── README.md     # 首页配置
├── .gitignore
├── LICENSE
├── README.en.md      # 英文 README
├── README.md         # 中文 README
├── package-lock.json
├── package.json
└── setup.sh          # 安装脚本
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run docs:dev
```

然后访问 http://localhost:8080 查看博客。

### 构建生产版本

```bash
npm run docs:build
```

构建后的文件会生成在 `docs/.vuepress/dist` 目录中。

## 部署

1. 构建生产版本：`npm run docs:build`
2. 将 `docs/.vuepress/dist` 目录中的内容部署到静态网站托管服务（如 GitHub Pages、Vercel、Netlify 等）

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License

## 联系

- 博客地址：[zhuiblog](http://localhost:8080)（本地开发环境）
- 备案信息：粤ICP备2023123001号