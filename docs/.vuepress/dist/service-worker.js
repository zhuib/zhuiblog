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
    "revision": "217c17686d6960c10e5ebe07eb82bfd6"
  },
  {
    "url": "about/index.html",
    "revision": "b5a75bf78bdc40d917d6c2f0830fd7cf"
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
    "url": "assets/img/image-1.a35d4f72.png",
    "revision": "a35d4f72b57f5d3e585e3291526f84e6"
  },
  {
    "url": "assets/img/image-2.5c1b1f58.png",
    "revision": "5c1b1f5866db20851837a5e1908b3c5f"
  },
  {
    "url": "assets/img/image-3.5c1b1f58.png",
    "revision": "5c1b1f5866db20851837a5e1908b3c5f"
  },
  {
    "url": "assets/img/image-4.5c1ea99e.png",
    "revision": "5c1ea99e1674daebbdf752d1a4de99ac"
  },
  {
    "url": "assets/img/image-5.314c4def.png",
    "revision": "314c4def2b282afe025f42d7b4c610a1"
  },
  {
    "url": "assets/img/image-6.f68b2c4f.png",
    "revision": "f68b2c4f854d08c14a5ab864c7e863e0"
  },
  {
    "url": "assets/img/image-7.b65bf6dc.png",
    "revision": "b65bf6dc848f8632ce52c0928b381728"
  },
  {
    "url": "assets/img/image.a7161997.png",
    "revision": "a716199719f7c607cb97efbb0238432d"
  },
  {
    "url": "assets/img/image.e8b9261a.png",
    "revision": "e8b9261a465b4ef91c9e30fc24928054"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.087ab2a7.js",
    "revision": "f66bd390a812eb77e7b8eb058db88122"
  },
  {
    "url": "assets/js/10.42d54896.js",
    "revision": "ec572d2946be1d1c1e3949e550b565c9"
  },
  {
    "url": "assets/js/11.9d0681e8.js",
    "revision": "a695332bb21ca0d200c9fc85d4466467"
  },
  {
    "url": "assets/js/14.ba49814a.js",
    "revision": "8751b611eab4abeeca04166961be26b6"
  },
  {
    "url": "assets/js/15.d45007f6.js",
    "revision": "72c38d93bdb224658250dde17f134a89"
  },
  {
    "url": "assets/js/16.54599ecd.js",
    "revision": "9ba0f447ba626a324d35e9e27dd3699b"
  },
  {
    "url": "assets/js/17.cbb40c4c.js",
    "revision": "b9c9a100540455d5f8f832e6f9da4e03"
  },
  {
    "url": "assets/js/18.f2bd8a17.js",
    "revision": "0c5535b9fb7179bc2a0740d1d7b596f4"
  },
  {
    "url": "assets/js/19.b5566330.js",
    "revision": "cbc659b26fd0bc01f337f1b95dabf74e"
  },
  {
    "url": "assets/js/2.55262c17.js",
    "revision": "5876c1a3bfacf96f3b0d5c29d837c9d1"
  },
  {
    "url": "assets/js/20.e29e3ac6.js",
    "revision": "2d212e9df5e29f5e6c81991b1075ec5d"
  },
  {
    "url": "assets/js/21.e4198296.js",
    "revision": "2f5659b7471ff6e001af7c491dbf0cfd"
  },
  {
    "url": "assets/js/22.b84e69ad.js",
    "revision": "77117503301a7e7af5fdfa077c03e1b4"
  },
  {
    "url": "assets/js/23.8f3cf5d7.js",
    "revision": "6ded22a4d1adbb219640e03820ea83f7"
  },
  {
    "url": "assets/js/24.b2d9b9e5.js",
    "revision": "dca76459089863924c41cab1011233e4"
  },
  {
    "url": "assets/js/25.80cd84bb.js",
    "revision": "613978010706b1ae603b12f92d7076ce"
  },
  {
    "url": "assets/js/26.1cdb4f22.js",
    "revision": "f3efb91c826a2024d64576b7b7cbde1d"
  },
  {
    "url": "assets/js/27.780035b5.js",
    "revision": "06d1f20ac0a5eb8876bf0959a523fc2c"
  },
  {
    "url": "assets/js/28.5d6853e2.js",
    "revision": "d10bd34b27646d931750b03ee91e6198"
  },
  {
    "url": "assets/js/29.bf9a8003.js",
    "revision": "cde0d19341a904b03abadce9e2f6dddd"
  },
  {
    "url": "assets/js/3.c142c938.js",
    "revision": "ce4088fbc4ff616493e3b41d4f7cfb8b"
  },
  {
    "url": "assets/js/30.3c44452c.js",
    "revision": "2fff453ce19e2907e44a1e80a829b144"
  },
  {
    "url": "assets/js/31.8b43f546.js",
    "revision": "1f9f891fe22b75e61811109661aa02ef"
  },
  {
    "url": "assets/js/32.ebb35780.js",
    "revision": "d4dddc93a2501a592d5c6ef29f049544"
  },
  {
    "url": "assets/js/33.60d8930c.js",
    "revision": "2f497b284164892a54cce492cc4e3046"
  },
  {
    "url": "assets/js/34.ea75fe5e.js",
    "revision": "ee0fe57b9da7c2863cb77dec8faa8d1b"
  },
  {
    "url": "assets/js/35.b20e9175.js",
    "revision": "d9f84d4a637f7eaaba2d3cd94b23e848"
  },
  {
    "url": "assets/js/36.c8283311.js",
    "revision": "2550c01ce64b514d21b803fa6bc799d8"
  },
  {
    "url": "assets/js/37.502b11fe.js",
    "revision": "dde7b483a0cfd0609b02d2d1ec3ea00a"
  },
  {
    "url": "assets/js/38.691657bf.js",
    "revision": "05515b0a6c59c85032dd88e0b770e962"
  },
  {
    "url": "assets/js/39.ee4a6387.js",
    "revision": "41b0d1dce342544bd8f3b4d770b742f6"
  },
  {
    "url": "assets/js/4.d9e23861.js",
    "revision": "8b28c3a5b43b5786c8daba3a54eb837a"
  },
  {
    "url": "assets/js/40.102d3dbe.js",
    "revision": "879bf1f4e440263f19c59957f314e9ef"
  },
  {
    "url": "assets/js/41.811359a7.js",
    "revision": "ed340a414e58b2b76986c5947e29bd70"
  },
  {
    "url": "assets/js/42.8bda3f6a.js",
    "revision": "2729bb3e3dff9b0977e7915eba530793"
  },
  {
    "url": "assets/js/43.3dac5c79.js",
    "revision": "0d1faea45e997303fb3da85f4e9718af"
  },
  {
    "url": "assets/js/44.141210bf.js",
    "revision": "462e591a4b07db4bb48ed54ac6d046c9"
  },
  {
    "url": "assets/js/45.0139b693.js",
    "revision": "b92e894b22171f7d687c97b9b2d30bf9"
  },
  {
    "url": "assets/js/46.a389c55c.js",
    "revision": "273649ed6287a53567b641900312076e"
  },
  {
    "url": "assets/js/47.20719544.js",
    "revision": "b61dd7451b09e065fd9546d7ba631e88"
  },
  {
    "url": "assets/js/5.baf129dc.js",
    "revision": "fca7a2f4914eb0a757c93e7ab8e3c795"
  },
  {
    "url": "assets/js/6.96dd5f3b.js",
    "revision": "6e04b6aab43d753b02d88eb03c1fd1ca"
  },
  {
    "url": "assets/js/7.a6e6962e.js",
    "revision": "72df5788753e90f26b75319afdf9e7f3"
  },
  {
    "url": "assets/js/8.670c471d.js",
    "revision": "3a71c8bc86e18dfda00331325d6443f4"
  },
  {
    "url": "assets/js/9.4c8d90f4.js",
    "revision": "581fd591ebaa91864809d3e7f30b9fe2"
  },
  {
    "url": "assets/js/app.858cea3d.js",
    "revision": "0258f8a76231b5b59b7f09c54c3c8479"
  },
  {
    "url": "assets/js/vendors~docsearch.1105fd69.js",
    "revision": "a3f647052c575459a1896c060c15b198"
  },
  {
    "url": "categories/index.html",
    "revision": "51f1cf64f5acf8649137b3f580320b0c"
  },
  {
    "url": "categories/JavaScript文章/index.html",
    "revision": "465dc8084e815093fa116013b38d18a2"
  },
  {
    "url": "categories/三级目录/index.html",
    "revision": "09809162f8fefde825f1a9e5be73c4bd"
  },
  {
    "url": "categories/前端/index.html",
    "revision": "7e4a75fb448d46802ae5e41b4a5eecf6"
  },
  {
    "url": "categories/后端/index.html",
    "revision": "3380f2c7f2300c1481c9cbbeb013545d"
  },
  {
    "url": "categories/数据库/index.html",
    "revision": "a63cc08661b5564beba909896895505e"
  },
  {
    "url": "categories/生活/index.html",
    "revision": "58612fa5a83365636d0aa7b4483ccbdd"
  },
  {
    "url": "fontend/index.html",
    "revision": "8e3ae0c9376047679f8f43f0dd1e1b12"
  },
  {
    "url": "img/painting.png",
    "revision": "94543a9279530864efb9cc27975cbbe8"
  },
  {
    "url": "index.html",
    "revision": "7e8c0b1a705216684ec9a2f24c098a19"
  },
  {
    "url": "java/index.html",
    "revision": "657ffbe236abea8185a421f28570b6e0"
  },
  {
    "url": "life/index.html",
    "revision": "8113a1366c65937f98a733d8bd12a664"
  },
  {
    "url": "MySQL/index.html",
    "revision": "feae6b1c091fb8cd1578be1dc19f13eb"
  },
  {
    "url": "tag/index.html",
    "revision": "b6593a2c13f84cf592a6acc8db534660"
  },
  {
    "url": "tag/java/index.html",
    "revision": "5485c2e2e5a053ce8a5f961a847a9715"
  },
  {
    "url": "tag/MySQL/index.html",
    "revision": "02244382876c42f5f2072a1411f107c6"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "54b3d5875b5bad9091672cd379eb08e7"
  },
  {
    "url": "tag/生活/index.html",
    "revision": "cf323218cf6dfd70397c7337f8128a3f"
  },
  {
    "url": "tag/科技/index.html",
    "revision": "50427d9f6e175dda26a6df02d436dfeb"
  },
  {
    "url": "tags/index.html",
    "revision": "12935db8c332b1a717811124f15ddcf7"
  },
  {
    "url": "technology/index.html",
    "revision": "540bde1b450471bd6be3a7aadac3c11b"
  },
  {
    "url": "timeline/index.html",
    "revision": "41329d112114208624ffce59ce072e48"
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
