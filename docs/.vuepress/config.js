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
      { text: "技术栈", link: "/technology/" },
      { text: "生活", link: "/life/" },
      { text: "关于", link: "/about/" },
      { text: "任务", link: "http://zhuib.iaminlearn.top/ql" },
    ],
    sidebar: {
      "/java/": [
        {
          title: "JVM",
          collapsable: true,
          children: [
            { title: "字节码", path: "/java/jvm/byte/" },
            { title: "类的加载", path: "/java/jvm/load/" },
            { title: "运行时内存", path: "/java/jvm/memery/" },
            { title: "对象内存布局", path: "/java/jvm/objectlayout/" },
            { title: "执行引擎", path: "/java/jvm/engine/" },
            { title: "垃圾回收", path: "/java/jvm/collection/" },
            { title: "JVM性能监控", path: "/java/jvm/monitor/" },
          ],
        },
        {
          title: "集合",
          collapsable: true,
          children: [{ title: "集合", path: "/java/collect/" }],
        },
        {
          title: "es同步",
          collapsable: true,
          children: [{ title: "产品数据同步到 Elasticsearch 实现方案", path: "/java/sync_to_es/" }],
        },
            {
          title: "二阶段提交",
          collapsable: true,
          children: [{ title: "TCC", path: "/java/two_sphare_commit/" }],
        },
      ],
      "面试题": [
        {
          title: "Java 面试",
          collapsable: true,
          children: [
            { title: "Java 面试", path: "/mianshi/" }
          ],
        },
      ]
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
