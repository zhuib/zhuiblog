# zhuiblog

## Project Introduction

zhuiblog is a personal technical blog built with VuePress, used for recording life and sharing knowledge.

## Technology Stack

- **Framework**: VuePress 1.x
- **Theme**: vuepress-theme-reco
- **Plugins**:
  - @vuepress-reco/vuepress-plugin-pagation (pagination feature)
  - @vuepress/plugin-pwa (progressive web application)
  - @vuepress/plugin-search (search feature)

## Features

- ✅ Simplicity First: Markdown-centered project structure, focusing on writing
- ✅ Vue-driven: Use Vue components in Markdown, support custom themes
- ✅ High Performance: Pre-render static HTML, run as SPA when pages are loaded
- ✅ PWA Support: Offline access, improved user experience
- ✅ Search Function: Quick content lookup
- ✅ Pagination Function: Easy browsing of large content

## Directory Structure

```
zhuiblog/
├── docs/             # Documentation directory
│   ├── MySQL/        # MySQL related documents
│   ├── about/        # About related content
│   ├── fontend/      # Frontend related content
│   ├── java/         # Java related content
│   │   ├── collect/  # Collection related
│   │   ├── jvm/      # JVM related
│   │   └── ...
│   ├── js/           # JavaScript related content
│   ├── k8s/          # Kubernetes related content
│   ├── life/         # Life related content
│   ├── mianshi/      # Interview related content
│   ├── netty/        # Netty related content
│   ├── tags/         # Tags related content
│   ├── technology/   # Technology related content
│   └── README.md     # Home page configuration
├── .gitignore
├── LICENSE
├── README.en.md      # English README
├── README.md         # Chinese README
├── package-lock.json
├── package.json
└── setup.sh          # Installation script
```

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

```bash
npm run docs:dev
```

Then visit http://localhost:8080 to view the blog.

### Build Production Version

```bash
npm run docs:build
```

The built files will be generated in the `docs/.vuepress/dist` directory.

## Deployment

1. Build production version: `npm run docs:build`
2. Deploy the contents of the `docs/.vuepress/dist` directory to a static website hosting service (such as GitHub Pages, Vercel, Netlify, etc.)

## Contribution

Welcome to submit Issues and Pull Requests to improve this project.

## License

MIT License

## Contact

- Blog Address: [zhuiblog](http://localhost:8080) (local development environment)
- ICP Record: 粤ICP备2023123001号