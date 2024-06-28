module.exports = {
  // base: "/zhuiblog/",
  // 语言
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  title: "笔记展示",
  head: [
    ["link", { rel: "icon", href: "/img/painting.png" }],
    // 主题 移动端优化
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  markdown: {
    //   extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6'], // 提取标题到侧边栏的级别，默认['h2', 'h3']
    // 显示代码行号
    lineNumbers: false,
  },
  theme: "reco",
  themeConfig: {
    cyberSecurityRecord: "粤ICP备2023123001号-1",
    cyberSecurityLink: "https://beian.miit.gov.cn/",
    startYear: 2023,
    type: "blog",
    logo: "/img/painting.png",
    autohor: "zhuib",
    // 个人信息的头像
    authorAvatar: "/img/painting.png",
    // 内置搜索
    search: true,
    searchMaxSuggestions: 10,
    // 子侧边栏
    subSidebar: "auto",
    sidebarDepth: 1,
    // 设置时区偏移量（8小时）
    timezoneOffset: 8 * 60 * 60 * 1000,
    nav: [
      { text: "首页", link: "/" },
      { text: "技术", link: "/technology/" },
      { text: "生活", link: "/life/" },
      { text: "标签库", link: "/tags/" },
      { text: "关于", link: "/about/" },
      { text: "任务", link: "http://zhuib.iaminlearn.top/ql" },
    ],
    sidebar: {
      "/technology/": [
        {
          title: "传统文化",
          collapsable: true,
          children: [{ title: "素书", path: "/life/" }],
        },
      ],
      "/life/": [
        {
          title: "Docker 应用",
          collapsable: true,
          children: [
            {
              title: "使用 Docker Compose 部署 Elasticsearch + Kibana",
              path: "/technology/",
            },
            {
              title: "使用 Dockerfile + Docker Compose 部署 Web 项目",
              path: "/technology/",
            },
          ],
        },
      ],
    },
    lastUpdated: "Last Updated",
  },
  plugins: [
    [
      "@vuepress/search",
      {
        searchMaxSuggestions: 10,
      },
    ],
    ["@vuepress-reco/vuepress-plugin-back-to-top"],
    [
      "@vuepress-reco/vuepress-plugin-pagation",
      {
        perPage: 5, // 每页展示条数
      },
    ],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: {
          message: "发现新内容可用",
          buttonText: "刷新",
        },
      },
    ],
  ],
};
