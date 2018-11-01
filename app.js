let http = require('http');
let fs = require('fs');
let url = require('url');
let JoinTheDownLoadQueue = require('./downloadMap.js')

/**
 * 二进制方式异步读取图片流
 * @param {string} path 文件路径
 * @param {Function} fn 回调文件信息
 * @return 以二进制返回图片数据
 */
let readImg = (path, fn) => {  //异步读取图片
  fs.readFile(path, 'binary', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (typeof fn === 'function') {
        fn(data);
      }
    }
  });
}

// 判断请求文件是否为图片
let imgOrOther = function (filename, response){
  // 获取后缀名
  let index1 = filename.lastIndexOf(".");
  let type = filename.substr(index1 + 1).toLowerCase();

  // 匹配以下格式 能匹配上则为图片
  let imgFormat = ["jpg", "png", "gif", "jpeg"];
  let isImage = false
  for(let i=0;i<imgFormat.length;i++){
    let format = imgFormat[i];
    if (type === format){
      isImage = true;
      break;
    }
  }

  return isImage
}

// 创建服务
http.createServer(function (request, response) {

  var pathname = url.parse(request.url).pathname;
  // console.log("request path: ", pathname);
  if (pathname === '/'){
    pathname = '/index.html'
  }

  // 如果是图片格式 返回浏览器可见图片给浏览器;
  let isImage = imgOrOther(pathname.substr(1), response);
  
  if (isImage) {
    let localPath = __dirname + pathname;

    fs.exists(localPath, function (exists) {
      if (!exists) { // 不存在去下载
        let position = pathname.split("/");
        let href = `https://b.tile.openstreetmap.org/${position[2]}/${position[3]}/${position[4]}`;
        JoinTheDownLoadQueue(href);
        response.write("200");
        response.end();
      }else{
        // 读取文件返回给前端
        readImg(pathname.substr(1), (data) => {
          response.write(data, 'binary');
          response.end();
        });
      }
    });
  }
}).listen(3000);