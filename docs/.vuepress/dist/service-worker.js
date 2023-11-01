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
    "revision": "190a15cccf902e71c8139041a4d351b4"
  },
  {
    "url": "about/index.html",
    "revision": "7a187a8c4fd5045ad2eec99570f6b976"
  },
  {
    "url": "assets/css/0.styles.003c19a0.css",
    "revision": "5f1713d81847122fe14bc31bc83e200b"
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
    "url": "assets/js/40.35bbd163.js",
    "revision": "4c010cc701c1bcf1569d9375394e35c3"
  },
  {
    "url": "assets/js/41.b2e577ef.js",
    "revision": "8b16ef4e77b9d9d0ffd9548af3381947"
  },
  {
    "url": "assets/js/42.a3a4e97e.js",
    "revision": "c3be3d27fe15ddcf3ddb3c8f02d3615d"
  },
  {
    "url": "assets/js/43.249bae20.js",
    "revision": "c0a4f8c2becf9caee5366bf625b666b3"
  },
  {
    "url": "assets/js/44.1553e690.js",
    "revision": "8425821fd53829657eceb6473686cb58"
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
    "url": "assets/js/app.53ac3af9.js",
    "revision": "d52c0302380711244428837d19facd5a"
  },
  {
    "url": "assets/js/vendors~docsearch.4e668273.js",
    "revision": "9de4fca333efc1e38b4478ec4f698f34"
  },
  {
    "url": "categories/index.html",
    "revision": "07da18f17f33493ccc3028f0abbdbeb4"
  },
  {
    "url": "categories/JavaScript文章/index.html",
    "revision": "00ec179072cf5adb351d6878b522eadd"
  },
  {
    "url": "categories/三级目录/index.html",
    "revision": "a74ab8e1e5267637a7fb95a61d1c4d9f"
  },
  {
    "url": "categories/前端/index.html",
    "revision": "a9d956faabce87206d277d58945d840a"
  },
  {
    "url": "img/painting.png",
    "revision": "94543a9279530864efb9cc27975cbbe8"
  },
  {
    "url": "index.html",
    "revision": "c03dab98a8fb2d3af03b3b908f2ed867"
  },
  {
    "url": "java/index.html",
    "revision": "ba39f33c87be369e9b153c3b26347e4d"
  },
  {
    "url": "life/index.html",
    "revision": "c149d2c6921b73616ddd4d1db21d7408"
  },
  {
    "url": "MySQL/index.html",
    "revision": "748256268f4354d4b34df757c6e46676"
  },
  {
    "url": "tag/index.html",
    "revision": "96bedac5920526cbc8424ca5dc8c5d03"
  },
  {
    "url": "tag/生活/index.html",
    "revision": "19067c37980b9b71a930c0a6ee3396c5"
  },
  {
    "url": "tag/科技/index.html",
    "revision": "df1f0a2ff0653f90e8fad2cc1ca9ea53"
  },
  {
    "url": "tags/index.html",
    "revision": "27a0ac513204a5245def226592995205"
  },
  {
    "url": "technology/index.html",
    "revision": "9ed5c7b003dbef1232ea493fd107cc80"
  },
  {
    "url": "timeline/index.html",
    "revision": "6554ea0eddbc2f752e3c20135fd25013"
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
