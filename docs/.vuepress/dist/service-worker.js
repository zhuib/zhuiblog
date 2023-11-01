/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "13f93930dfe7c31461a7fb52da131b4a"
  },
  {
    "url": "about/index.html",
    "revision": "0a952c63807421fab1e7306eddcc5808"
  },
  {
    "url": "assets/css/0.styles.934583fe.css",
    "revision": "e277d3e04921f3b4be965f244e28d476"
  },
  {
    "url": "assets/fonts/iconfont.938fa69e.woff",
    "revision": "938fa69ea89bccb0f20d643cc5f07cbe"
  },
  {
    "url": "assets/fonts/iconfont.ecabaf00.ttf",
    "revision": "ecabaf00c2c5be9907d524bb21a0f0dc"
  },
  {
    "url": "assets/img/bg.2cfdbb33.svg",
    "revision": "2cfdbb338a1d44d700b493d7ecbe65d3"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.ac7a9573.js",
    "revision": "3deaba1f3174deb81578a8713762354b"
  },
  {
    "url": "assets/js/10.90f5bcf5.js",
    "revision": "497464e3af2b818a933256481e2328a8"
  },
  {
    "url": "assets/js/11.83ec692e.js",
    "revision": "c0e2b40e38dff6c0bada5f9c3c0a6d5a"
  },
  {
    "url": "assets/js/14.026874f6.js",
    "revision": "b3bf6b0bd9c6772194c31fbc0638e499"
  },
  {
    "url": "assets/js/15.f1083ccf.js",
    "revision": "138d3888724479d80590c2312c28be03"
  },
  {
    "url": "assets/js/16.f69233f2.js",
    "revision": "fdab465b3f00caea29cb9587ae8e3ebb"
  },
  {
    "url": "assets/js/17.103527c2.js",
    "revision": "6d341cfcec61cb21cdd69dd8229fcb25"
  },
  {
    "url": "assets/js/18.54309a36.js",
    "revision": "fd1107b44f54efdc2ea48700f02d4148"
  },
  {
    "url": "assets/js/19.8d238df6.js",
    "revision": "2dd6be1597d0237b2f7da5cfb4a98c1c"
  },
  {
    "url": "assets/js/2.5c5b2767.js",
    "revision": "bf43d97cf3e41cb9980ed2af3beacadf"
  },
  {
    "url": "assets/js/20.e29e3ac6.js",
    "revision": "2d212e9df5e29f5e6c81991b1075ec5d"
  },
  {
    "url": "assets/js/21.549261b6.js",
    "revision": "82dac3152ebba922a3e61487bfae7656"
  },
  {
    "url": "assets/js/22.79a50ba4.js",
    "revision": "d5177b245fecb7e50011af4ca7a461d1"
  },
  {
    "url": "assets/js/23.ffde438b.js",
    "revision": "c6580b9ecc9466b8c6dd4f7d40a426ab"
  },
  {
    "url": "assets/js/24.b2d9b9e5.js",
    "revision": "dca76459089863924c41cab1011233e4"
  },
  {
    "url": "assets/js/25.1f2e3567.js",
    "revision": "ff233b68b24584ad0254fd26eda7f754"
  },
  {
    "url": "assets/js/26.9dbd5b22.js",
    "revision": "77c5860e74424a691c959f5d554b91c4"
  },
  {
    "url": "assets/js/27.449f7bfc.js",
    "revision": "de770105d1dc1f00e7687ebd3931a0c7"
  },
  {
    "url": "assets/js/28.4e5c9ef0.js",
    "revision": "e08d5eb4de376dc6f83711abbfe9e46e"
  },
  {
    "url": "assets/js/29.fe1032fd.js",
    "revision": "b13c532815a0046b58a4686b06d076cb"
  },
  {
    "url": "assets/js/3.b341fcd0.js",
    "revision": "ef5333dbe3eb885fd58d5fb78a0a6c12"
  },
  {
    "url": "assets/js/30.bdd7164e.js",
    "revision": "69bc4c7224f57c320d6102ed44ac4897"
  },
  {
    "url": "assets/js/31.816fa18c.js",
    "revision": "c34f83a928dec6b7069964f91d805d05"
  },
  {
    "url": "assets/js/32.4be5b6cd.js",
    "revision": "90b86504cbd902914793779a44accb75"
  },
  {
    "url": "assets/js/33.3e6015ed.js",
    "revision": "49483c9190d22c51a772d13beac76208"
  },
  {
    "url": "assets/js/34.8cc85246.js",
    "revision": "ce4e70a9288560b69f2d046e779ccb13"
  },
  {
    "url": "assets/js/35.a2e847dd.js",
    "revision": "319b4edb3f52c0935f94896c69e39174"
  },
  {
    "url": "assets/js/36.f0fed0a2.js",
    "revision": "8cf4a99a61189ea9d5baad1b664c7c6f"
  },
  {
    "url": "assets/js/37.4d7ca8e6.js",
    "revision": "89f7433ecdaf5586d473dcd8f23adfbc"
  },
  {
    "url": "assets/js/38.ea75bbe1.js",
    "revision": "79bb2a3cf3f6f7cc8e873ae268a32e20"
  },
  {
    "url": "assets/js/39.711b69b8.js",
    "revision": "3a06702c1185d924e293cf1c5bf901f2"
  },
  {
    "url": "assets/js/4.20940389.js",
    "revision": "1b1ab26950ca6e48fdfb9d3a70c74cbf"
  },
  {
    "url": "assets/js/40.be74dda5.js",
    "revision": "ad2a94ed3aaf4412fb344b90f6f0f87c"
  },
  {
    "url": "assets/js/41.e0f87d2e.js",
    "revision": "9fa653f31c95ab591cc2cbd8e277365a"
  },
  {
    "url": "assets/js/42.3ad668d8.js",
    "revision": "e683629158f9509da2e44e8d37c93433"
  },
  {
    "url": "assets/js/43.03e46f98.js",
    "revision": "92c19dcf00b0184a4a29eab9a54142e8"
  },
  {
    "url": "assets/js/44.30bc8745.js",
    "revision": "6556584cb81b992c999ffe83e8227b7f"
  },
  {
    "url": "assets/js/45.ccc6ea1a.js",
    "revision": "3cece3790118233ecba8e7186e270a0f"
  },
  {
    "url": "assets/js/46.ac74d14d.js",
    "revision": "cbfe17efc95d5fb02ac8b025dfbdaab6"
  },
  {
    "url": "assets/js/5.b406c96b.js",
    "revision": "632a3d912df9a90ac1c9ca1c1977f976"
  },
  {
    "url": "assets/js/6.dc5d9d0f.js",
    "revision": "cdeb36ac26358af7300db3da974e08f0"
  },
  {
    "url": "assets/js/7.1d5261d9.js",
    "revision": "fd6de84db42eb2d0b0138c552d2b85aa"
  },
  {
    "url": "assets/js/8.65b492f8.js",
    "revision": "06c7d23b0c8f7280d561c88410700caa"
  },
  {
    "url": "assets/js/9.a8bd5f26.js",
    "revision": "e48609a095722f79e7971003c6fc17f5"
  },
  {
    "url": "assets/js/app.90612b62.js",
    "revision": "afa3ef636d38b82bcde31d4eb1c9f07e"
  },
  {
    "url": "assets/js/vendors~docsearch.4e668273.js",
    "revision": "9de4fca333efc1e38b4478ec4f698f34"
  },
  {
    "url": "categories/index.html",
    "revision": "4cbb4760a71af80bef0055a12a25eb0e"
  },
  {
    "url": "categories/JavaScript文章/index.html",
    "revision": "a4da2140a7f8afdb73c09d77f9450129"
  },
  {
    "url": "categories/三级目录/index.html",
    "revision": "a26c3727467c3bf9a80f69507424b127"
  },
  {
    "url": "categories/前端/index.html",
    "revision": "05127e67694787561d41d522c00324bb"
  },
  {
    "url": "img/painting.png",
    "revision": "94543a9279530864efb9cc27975cbbe8"
  },
  {
    "url": "index.html",
    "revision": "16389930eac94ccff81e42410a4a8460"
  },
  {
    "url": "java/index.html",
    "revision": "dcf88943d8264468f0f137242101e55a"
  },
  {
    "url": "life/index.html",
    "revision": "9512612a0b3bd1f288c06dc00919e496"
  },
  {
    "url": "MySQL/index.html",
    "revision": "2da8ea9123e582b892bad00cf07c0fbb"
  },
  {
    "url": "tag/index.html",
    "revision": "58339b280b46ee2b6def2c3509c0818f"
  },
  {
    "url": "tag/生活/index.html",
    "revision": "151d3b8e9b5088ac9aa4059fab909fda"
  },
  {
    "url": "tag/科技/index.html",
    "revision": "7c775e72c51e8b2dd22e962bd069a922"
  },
  {
    "url": "tags/index.html",
    "revision": "58997d33b236dbe7375cddfd47d00afd"
  },
  {
    "url": "technology/index.html",
    "revision": "d4edd762c83f92e29c8afad46958f6db"
  },
  {
    "url": "timeline/index.html",
    "revision": "66136a34ce46ec5eab3531ed6c05e0af"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
