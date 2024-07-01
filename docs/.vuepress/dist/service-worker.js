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
    "revision": "c9f153616cace5aec00248079c461511"
  },
  {
    "url": "about/index.html",
    "revision": "dfe0e516a8282c5fc672b599bdcd8901"
  },
  {
    "url": "assets/css/0.styles.056b6a36.css",
    "revision": "6e56625d53ca63807aace8f881f3013a"
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
    "url": "assets/js/1.1d7e4df3.js",
    "revision": "fa27ef1dfc3fcb9bada7f8f965245352"
  },
  {
    "url": "assets/js/10.62abeb8c.js",
    "revision": "78d8324ff4f065222a47ffb8ece407ec"
  },
  {
    "url": "assets/js/11.f603d91c.js",
    "revision": "4b28efb418cf56b6007df5102bea7644"
  },
  {
    "url": "assets/js/14.670067e0.js",
    "revision": "09f13ed6a88039db95fbdecd883ea21c"
  },
  {
    "url": "assets/js/15.cc4f7e26.js",
    "revision": "7e4ac0e6e9212841e1f76ae1bbd88fcd"
  },
  {
    "url": "assets/js/16.5c59ca76.js",
    "revision": "c1e6617ca932524c62d3fa68a072501b"
  },
  {
    "url": "assets/js/17.ae796ec7.js",
    "revision": "9180f90c172ce204563454a718d081a9"
  },
  {
    "url": "assets/js/18.5145e703.js",
    "revision": "fe00ea3354fe9cb9485b85782d341f83"
  },
  {
    "url": "assets/js/19.3521dd7d.js",
    "revision": "ceb10224b071ddeda0ca983b931f6c7f"
  },
  {
    "url": "assets/js/2.b0079b00.js",
    "revision": "6833447f7b4e865b3aa2c934b69bf045"
  },
  {
    "url": "assets/js/20.a9332dfc.js",
    "revision": "6b421e5178ddaa6510dba50945588207"
  },
  {
    "url": "assets/js/21.a7da2c36.js",
    "revision": "b76d1bab95b34e1a44e16b8942f36568"
  },
  {
    "url": "assets/js/22.e3e636b3.js",
    "revision": "dd6d5bb5c8a553a7d6789112e2dfe123"
  },
  {
    "url": "assets/js/23.33c53bb2.js",
    "revision": "cd0e8d0975f7324355c87d0b13d50e09"
  },
  {
    "url": "assets/js/24.b573e73f.js",
    "revision": "dcf4ac4e6dcf5166589e0b460f5ca0e3"
  },
  {
    "url": "assets/js/25.6c422af6.js",
    "revision": "0528b4063d9f560cf2bc7b5c3b2e909a"
  },
  {
    "url": "assets/js/26.813ef582.js",
    "revision": "a2659054cfb1c610f709572653d62171"
  },
  {
    "url": "assets/js/27.6612cea8.js",
    "revision": "7a5cdf5124a7be381fa620c24f4f06b5"
  },
  {
    "url": "assets/js/28.de3b401f.js",
    "revision": "ddd5180dabe947823c5272f6344f4778"
  },
  {
    "url": "assets/js/29.8571ea69.js",
    "revision": "9a60e56f4861dce6eef4ad2d880adf28"
  },
  {
    "url": "assets/js/3.68e991ea.js",
    "revision": "115d49f1a01861333a7d0dbfa4346f36"
  },
  {
    "url": "assets/js/30.bbf5a06d.js",
    "revision": "fb9e7bf4a8eaa56d5f35a797afa4d270"
  },
  {
    "url": "assets/js/31.8a9dd03c.js",
    "revision": "ed1a1faab9557bbcbac4463f6e86bda5"
  },
  {
    "url": "assets/js/32.4590b772.js",
    "revision": "9038e3623a723849282e9e67ff5703af"
  },
  {
    "url": "assets/js/33.10b21a4f.js",
    "revision": "da907516cc8d512087c917fba2264123"
  },
  {
    "url": "assets/js/34.0c156a0a.js",
    "revision": "2da787e286d63acb6e8242da997d7c69"
  },
  {
    "url": "assets/js/35.f669338c.js",
    "revision": "37d8a330bbf22dfe09c61f47a8c4e6d6"
  },
  {
    "url": "assets/js/36.ad5478c0.js",
    "revision": "3c374628b53f31066c99f35dc48f45d5"
  },
  {
    "url": "assets/js/37.3da6a041.js",
    "revision": "c088fdf1832b6211e1f2f61592efa4f3"
  },
  {
    "url": "assets/js/38.7bacf8dc.js",
    "revision": "6fe60097dff7ad263f2202062949a625"
  },
  {
    "url": "assets/js/39.426e3eef.js",
    "revision": "5d267b449917f7ede6ad14892321a753"
  },
  {
    "url": "assets/js/4.6b22b04e.js",
    "revision": "37402ed070cf3235b72cc8c49b6541d0"
  },
  {
    "url": "assets/js/40.edc664c6.js",
    "revision": "ba60875a4b8c94e41b910f1f3ae06527"
  },
  {
    "url": "assets/js/41.94f5b4a2.js",
    "revision": "131a5f4271ac961113b806d6dd572a9c"
  },
  {
    "url": "assets/js/42.9ec668e1.js",
    "revision": "e77860d301082ea452666369ba27e3ed"
  },
  {
    "url": "assets/js/43.753394ca.js",
    "revision": "db4261134746149b7370de3086b1df44"
  },
  {
    "url": "assets/js/44.23c315a7.js",
    "revision": "f8fe10240f482bca46443c9c5bf780e4"
  },
  {
    "url": "assets/js/45.398cea2b.js",
    "revision": "6da0343c36caf4961fa8607a070aa29e"
  },
  {
    "url": "assets/js/46.c5359cce.js",
    "revision": "e893544c2b32514f812ca89f080cde6f"
  },
  {
    "url": "assets/js/47.1e379c7e.js",
    "revision": "3edde4a243d733c1703bcffbc3d7aa69"
  },
  {
    "url": "assets/js/5.7908a9d7.js",
    "revision": "51bd673cbbdb05fb5e5f9b6139c97d95"
  },
  {
    "url": "assets/js/6.07d61664.js",
    "revision": "b31bf0df0edc0754ad27713866d88b44"
  },
  {
    "url": "assets/js/7.b3f59d1f.js",
    "revision": "6480f7cc03d71ed30b9af3c7f4a26939"
  },
  {
    "url": "assets/js/8.7c8f32a4.js",
    "revision": "49d70b2ad9512ec359eaa2a67982857c"
  },
  {
    "url": "assets/js/9.3b4496be.js",
    "revision": "7d5e3db29a215145913494d4a5199051"
  },
  {
    "url": "assets/js/app.a9bed1b2.js",
    "revision": "b8f49fccc1e961611eb0bbbd556e146d"
  },
  {
    "url": "assets/js/vendors~docsearch.d3b9b319.js",
    "revision": "3bc29a44a2ac1a7b1442b18cb75c1c2a"
  },
  {
    "url": "categories/index.html",
    "revision": "716e75fdeac83dc8dd9e77f2f4fdfbf8"
  },
  {
    "url": "categories/前端/index.html",
    "revision": "3cdc10f75ed5906369e0c81d370ac20f"
  },
  {
    "url": "categories/后端/index.html",
    "revision": "014e72bf8401f836d0f9b6a89f3bf880"
  },
  {
    "url": "categories/数据库/index.html",
    "revision": "c8ce47abaff09b7a8609408e0c1e77b1"
  },
  {
    "url": "categories/生活/index.html",
    "revision": "335fcfdb2d1c3cfc4e0de9d0b9ff37bf"
  },
  {
    "url": "categories/脑图/index.html",
    "revision": "425e54171d32e101ab640dff6f70f7bc"
  },
  {
    "url": "fontend/index.html",
    "revision": "5712ffc542aa7dba8827039adc37f427"
  },
  {
    "url": "img/painting.png",
    "revision": "94543a9279530864efb9cc27975cbbe8"
  },
  {
    "url": "index.html",
    "revision": "b405bc1ad0f24b3d0ea888eb19ec925f"
  },
  {
    "url": "java/index.html",
    "revision": "4d726f3ecbd3c5decaa96d96fbe2a7a2"
  },
  {
    "url": "life/index.html",
    "revision": "ff7d9cd2eac9acff342b820cbc8d4c59"
  },
  {
    "url": "MySQL/index.html",
    "revision": "4f8a0a88c2e5724ee4af9d02896277c9"
  },
  {
    "url": "tag/index.html",
    "revision": "cf1d76de003926faa5ec872ff2112141"
  },
  {
    "url": "tag/java/index.html",
    "revision": "cb850ece24cb2bc4bb1a4903ed67e6ae"
  },
  {
    "url": "tag/MySQL/index.html",
    "revision": "be4de8471d6af5532b00abaa27f62e7a"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "c22b486fa3304d01a5ff0fd6d5a435fd"
  },
  {
    "url": "tag/生活/index.html",
    "revision": "91e42d6b4c7fef5fad55250d309c655b"
  },
  {
    "url": "tag/科技/index.html",
    "revision": "9b1e3183353c040d3583b4bde6ae511a"
  },
  {
    "url": "tags/index.html",
    "revision": "5fe786b58b29c4f715ff3f8474f503f4"
  },
  {
    "url": "technology/index.html",
    "revision": "bb8c96417e6d9f19b2e6ae71f30b42ec"
  },
  {
    "url": "timeline/index.html",
    "revision": "ca1f7be147cac8d717bb1245089f5d11"
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
