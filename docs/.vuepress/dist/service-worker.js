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
    "revision": "f7196be9eb9180f3f3299fb1910b3835"
  },
  {
    "url": "about/index.html",
    "revision": "1edb386318dc1dd414842896d9cd7c71"
  },
  {
    "url": "assets/css/0.styles.8425e559.css",
    "revision": "434278f047afd2d7ef9b7032eeaa71c0"
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
    "url": "assets/img/image-1.0627572c.png",
    "revision": "0627572ccd96440f115d26d893cf2b5d"
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
    "url": "assets/img/image-2.b4e14823.png",
    "revision": "b4e14823390c2ff203a42ba5cd0ca769"
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
    "url": "assets/img/image.674039e8.png",
    "revision": "674039e87a26d972defc0975bb172156"
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
    "url": "assets/js/1.82431a9b.js",
    "revision": "ad5533c17e973d6b0a0c68ab0599bc56"
  },
  {
    "url": "assets/js/10.494d2577.js",
    "revision": "210bf72b39f7e2777db52d8358e6a242"
  },
  {
    "url": "assets/js/11.21df0983.js",
    "revision": "ff4575b51e60a70edff0d9c91e734cdc"
  },
  {
    "url": "assets/js/14.4be58173.js",
    "revision": "a9e4fc4de6555624108906aae1961028"
  },
  {
    "url": "assets/js/15.cc7c3b63.js",
    "revision": "d54d3715848a0c6c0f4c2b235c613cf8"
  },
  {
    "url": "assets/js/16.12550b4c.js",
    "revision": "9f58304cd029b6567c0630a454c75423"
  },
  {
    "url": "assets/js/17.dec4be3f.js",
    "revision": "1adb41a549125e3368e55aceb4fbebde"
  },
  {
    "url": "assets/js/18.e5f0caa2.js",
    "revision": "937885e46b897b52dbeffad68c39fb1a"
  },
  {
    "url": "assets/js/19.902a411c.js",
    "revision": "ddaaa9bd29e42f93f86466e1b8589442"
  },
  {
    "url": "assets/js/2.dd9855b5.js",
    "revision": "977ff38520571982177df2c99666b9e1"
  },
  {
    "url": "assets/js/20.d8c9a258.js",
    "revision": "1936674bb545d9e944eeaf829b606a04"
  },
  {
    "url": "assets/js/21.c2dc2273.js",
    "revision": "63821095977fca81bfe1e93cb474bff2"
  },
  {
    "url": "assets/js/22.d2a35c3e.js",
    "revision": "ecec88269249dddc36f603f1942eb84d"
  },
  {
    "url": "assets/js/23.98fd2f0c.js",
    "revision": "f2b0f9c07f143573ace6b4bba4576d33"
  },
  {
    "url": "assets/js/24.92d42192.js",
    "revision": "b1171c0f8ec259a5c77c35db5917f04c"
  },
  {
    "url": "assets/js/25.fd0c452d.js",
    "revision": "2f199f3a7904e39614f24e72cabb1dd7"
  },
  {
    "url": "assets/js/26.2b611372.js",
    "revision": "b81d33773280ca3b3cd9e5253c9ee537"
  },
  {
    "url": "assets/js/27.a578a71b.js",
    "revision": "b4d43f92e439464c49d61e98eefe063e"
  },
  {
    "url": "assets/js/28.43cb1874.js",
    "revision": "d2593714e49cda56c554ea68cd651459"
  },
  {
    "url": "assets/js/29.be451120.js",
    "revision": "87b2ee971e2aaecda4dc71630dbedeb9"
  },
  {
    "url": "assets/js/3.566dff65.js",
    "revision": "6d53d9489573f2934e6204d8885bee0c"
  },
  {
    "url": "assets/js/30.60deaa74.js",
    "revision": "3d40cb2f3a152f508ddd25d7ca469b46"
  },
  {
    "url": "assets/js/31.a8cc186f.js",
    "revision": "c44b62af8437823b0c20edc6cd7c63fa"
  },
  {
    "url": "assets/js/32.ec196dda.js",
    "revision": "4bc9d6859ade71ba823407bc30f73c00"
  },
  {
    "url": "assets/js/33.3332ee20.js",
    "revision": "343c6e5dac5cdb3bb9dbe3b8625876f5"
  },
  {
    "url": "assets/js/34.f09fbdfd.js",
    "revision": "d3fa28d9e6649873e0522a069fe25e37"
  },
  {
    "url": "assets/js/35.32280239.js",
    "revision": "8062c56df7d53a0f55d096daf5b7bf05"
  },
  {
    "url": "assets/js/36.9d2435d2.js",
    "revision": "7c02f8950843b927217c0c2f347b9643"
  },
  {
    "url": "assets/js/37.b92f647e.js",
    "revision": "cad0376ae9d80d69db2f02cd9060971d"
  },
  {
    "url": "assets/js/38.f394f741.js",
    "revision": "8e445c9b032bca66a92bf00e1e0e57ce"
  },
  {
    "url": "assets/js/39.e6f1ec16.js",
    "revision": "dcccf5f32dfbe8f47cacc38b21ed1110"
  },
  {
    "url": "assets/js/4.c0a9ddcf.js",
    "revision": "b6bf8045e50dd1f7302ccb446fb66396"
  },
  {
    "url": "assets/js/40.8f129f52.js",
    "revision": "bc1d31e2354b09e97d9714b00a00bcfa"
  },
  {
    "url": "assets/js/41.e7a5e1f8.js",
    "revision": "d4dbe0475e74813164be8485c88641c2"
  },
  {
    "url": "assets/js/42.f5142554.js",
    "revision": "88394e306efad89118381322d34c094b"
  },
  {
    "url": "assets/js/43.f2622184.js",
    "revision": "7931ddeea5b6d365e5e411d57d675d2e"
  },
  {
    "url": "assets/js/44.2e9a76b2.js",
    "revision": "8660e722337bf5a8566288dd55782f20"
  },
  {
    "url": "assets/js/45.ff00e26a.js",
    "revision": "eb99454bf6ad7a54e9ba3920a858aaab"
  },
  {
    "url": "assets/js/46.43491f7f.js",
    "revision": "fe03e5cc585658e3aae529141d17daef"
  },
  {
    "url": "assets/js/47.0c8ff1b9.js",
    "revision": "899de7b13fd2449d8ae0d8aed6096d74"
  },
  {
    "url": "assets/js/48.7bf2dff2.js",
    "revision": "5a351e278360eaddc9f96c808e28ce7f"
  },
  {
    "url": "assets/js/49.91c7db83.js",
    "revision": "695efd7ddd22a4ed937d30104583e677"
  },
  {
    "url": "assets/js/5.b9ec72b3.js",
    "revision": "e46c4eaf23b822eedeb452b0cb03bddb"
  },
  {
    "url": "assets/js/50.70cf5ebf.js",
    "revision": "97e109576cc440af11f40ab8ecaf1ba1"
  },
  {
    "url": "assets/js/51.79fd1936.js",
    "revision": "949bd3cf72ea87de7ef7862168ef4e6d"
  },
  {
    "url": "assets/js/52.eb0387b0.js",
    "revision": "a16406d0f361a4a2e9dd4d7261f88b67"
  },
  {
    "url": "assets/js/53.7da95324.js",
    "revision": "97d6b1affd82a49695c07a5593dd4851"
  },
  {
    "url": "assets/js/54.3ae22d74.js",
    "revision": "66713a65ce7448b8e61d89ac747ab3eb"
  },
  {
    "url": "assets/js/55.6b05f226.js",
    "revision": "0af67805d4e193f235ed63e593cd64cb"
  },
  {
    "url": "assets/js/56.d16a144e.js",
    "revision": "2a5ade525b6e52a02b8fc3023dcb8f41"
  },
  {
    "url": "assets/js/57.18e93f88.js",
    "revision": "bd7b4ace662a8a2c9608f153db014ae6"
  },
  {
    "url": "assets/js/6.501afcc9.js",
    "revision": "b6dcf467380545e8bc745ae44d7439b6"
  },
  {
    "url": "assets/js/7.780561b8.js",
    "revision": "eb71ff0730d59b2cfcd7b8d988037648"
  },
  {
    "url": "assets/js/8.c0d59ad0.js",
    "revision": "38034a9842bcb7a29df52f4a2c7c21a2"
  },
  {
    "url": "assets/js/9.643fcc14.js",
    "revision": "34dd6e624f2ef16f76472c9805c0c511"
  },
  {
    "url": "assets/js/app.160802b5.js",
    "revision": "968ea68fbae3f99d650874f57c3cf605"
  },
  {
    "url": "assets/js/vendors~docsearch.423f0c78.js",
    "revision": "d549b6d18b2d90537f69324fbf2cb45f"
  },
  {
    "url": "categories/index.html",
    "revision": "0ff9bba7c21ee04a3576eba6bd96ad29"
  },
  {
    "url": "categories/前端/index.html",
    "revision": "8a45992575c88cd6bdfdc517c210c5a5"
  },
  {
    "url": "categories/后端/index.html",
    "revision": "40968bb64c4c8140e966af33391764a7"
  },
  {
    "url": "categories/后端/page/2/index.html",
    "revision": "093d7469c5caea554e024aeb365210d0"
  },
  {
    "url": "categories/数据库/index.html",
    "revision": "387dea0ae7ddf4dd4f0cfa497fd89ef7"
  },
  {
    "url": "categories/生活/index.html",
    "revision": "32321e2edc6b458d62a612640978cff9"
  },
  {
    "url": "categories/脑图/index.html",
    "revision": "d0210860a3242c8c5cab9c7d3a3d59fe"
  },
  {
    "url": "fontend/index.html",
    "revision": "ed36a15a5172bb731fa0474abfc20579"
  },
  {
    "url": "img/painting.png",
    "revision": "94543a9279530864efb9cc27975cbbe8"
  },
  {
    "url": "index.html",
    "revision": "54d9add64803d7626b553a57a1703f94"
  },
  {
    "url": "java/collect/index.html",
    "revision": "4d9e9c56732780142506fcfc519b45c5"
  },
  {
    "url": "java/index.html",
    "revision": "5c3e66058b26c90ffeafb4732eb46518"
  },
  {
    "url": "java/jvm/byte/index.html",
    "revision": "2ad982d61340a10b0c5b6fc7aea8095b"
  },
  {
    "url": "java/jvm/collection/index.html",
    "revision": "b285ff345e4c035e27ca2e2015315dc2"
  },
  {
    "url": "java/jvm/engine/index.html",
    "revision": "a70b2ead51bed8626dfa026a26156fe8"
  },
  {
    "url": "java/jvm/index.html",
    "revision": "5e75388488297e2afefb38979fc87dff"
  },
  {
    "url": "java/jvm/load/index.html",
    "revision": "b8b8da25a0b2ddf1d8537259202d53b4"
  },
  {
    "url": "java/jvm/memery/index.html",
    "revision": "4d43649f23f69245de4c8cea277d6f9b"
  },
  {
    "url": "java/jvm/monitor/index.html",
    "revision": "76804edc6907c1c980cd5c52256e5e1a"
  },
  {
    "url": "java/jvm/objectlayout/index.html",
    "revision": "5472b6040651bcfe6fd2b61f26a5b1ac"
  },
  {
    "url": "java/mainshi/index.html",
    "revision": "391641a5dcb044ce7625d8f284d0e831"
  },
  {
    "url": "life/index.html",
    "revision": "a15e674da0ba7e877a98f26110013b49"
  },
  {
    "url": "MySQL/index.html",
    "revision": "1f6b3ec937a4056e32b37b17c56dae64"
  },
  {
    "url": "tag/index.html",
    "revision": "289711955b3ad8d3ce149fbac49475e0"
  },
  {
    "url": "tag/java/index.html",
    "revision": "b488336fe1114c52b5ebffdca0839c79"
  },
  {
    "url": "tag/JVM/index.html",
    "revision": "933aadef29f9998c0d41af7de404473f"
  },
  {
    "url": "tag/MySQL/index.html",
    "revision": "50e215c46f449645699dd57355ba9ee2"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "76b3e68f76f4f821d05f039293899f02"
  },
  {
    "url": "tag/生活/index.html",
    "revision": "786c4ab27d4fe1b7bd12d387b2aee28d"
  },
  {
    "url": "tag/科技/index.html",
    "revision": "e2c93e94488fac8f70cc7eef6050e88f"
  },
  {
    "url": "tag/集合/index.html",
    "revision": "a93efea9feed3be172f51db810e4cbfb"
  },
  {
    "url": "tag/面试/index.html",
    "revision": "501057de0573b3d64ea0d5514b308fa0"
  },
  {
    "url": "tags/index.html",
    "revision": "a3488d7d3ff5efce9fba246c4516356d"
  },
  {
    "url": "technology/index.html",
    "revision": "66cd0318c44f9b6f73071f9e7ecddaf4"
  },
  {
    "url": "timeline/index.html",
    "revision": "92a9fd6be6a6cb5baa39aba3402d99c9"
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
