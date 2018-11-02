# Arcgis 在线地图瓦片爬虫

最近在进行 Arcgis 地图相关业务, 接入底图时 ArcMap 没有设置好参数导致瓦片缺失, 只能先写一套爬取在线地图做一个演示 demo。

## 展示
[github源码](https://github.com/buildlove/grap-map-tiles)

![image](https://github.com/buildlove/grap-map-tiles/blob/master/images/image.png)

## 使用方法

* 启动服务

```

  npm install
  node app.js || npm run dev

```

* 在本地浏览器中打开 client/index.html

* 在页面中滚动鼠标

## 爬虫

> app.js

* 服务器接收瓦片请求并判断是否存在该瓦片。

* 存在瓦片则返回瓦片, 不存在则加入缓存等待下载。

> downloadMap.js

* 缓存链接到数组内。

* 服务端会每隔1秒检查数组内是否有链接 有则去下载。

## 地图相关

* Arcgis 官方使用插件 dojo.js 来接入地图底图。

* dojo.js 除了展示底图几乎一无是处, dojo.js 和 require.js 有冲突。

* Arcgis 工具分为制作底图的客户端 ArcMap, 服务器 Arcgis Server。

* leaflet 有相当多的接口和插件来制作地图工具。

* ArcMap 在发布服务时一定要设置好参数, 不然 leaflet 不能接入底图。


