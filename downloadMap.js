// 下载链接保存到对应目录 downloadMap.js

var request = require('request')
var fs = require('fs')
var path = require('path')

let dirname = 'org'
let hostdir = __dirname.replace(/\\/g, "/") + "/"
let urls = [];
let setDownload = null;

/**
 * 判断目录是否存在, 不存在创建目录
 * @param {string} dirPath 目录路径
 */
function mkdirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirPath))) {
      fs.mkdirSync(dirPath);
      return true;
    }
  }
  return false
}

/**
 * 添加链接到数组
 * @param {string} url 
 */
function JoinTheDownLoadQueue(url){
  urls.push(url);
}

/**
 * 下载单条链接
 * @param {string} url 
 */
function downloadUrl(url) {
  const first = url.indexOf(dirname)
  const last = url.lastIndexOf('/')
  if (last > 0) {
    const name = url.substr(last + 1)
    const dir = url.substr(first, last - first)
    const dstpath = hostdir + dir + '/' + name

    if (name.length && dir.length && !fs.existsSync(dstpath)) {
      if (mkdirSync(hostdir + dir)) {
        
        try{
          let httpStream = request({
            method: 'GET',
            url: url
          });

          let writeStream = fs.createWriteStream(dstpath);

          request(url).pipe(writeStream)

          let totalLength = 0;

          // 当获取到第一个HTTP请求的响应获取
          httpStream.on('response', (response) => {
            // console.log('response headers is: ', response.headers);
          });

          httpStream.on('data', (chunk) => {
            totalLength += chunk.length;
            // console.log('recevied data size: ' + totalLength + 'KB');
          });

          writeStream.on("close", function (err) {
            urls.splice(0, 1);
            console.log(`${url} [${totalLength}KB]下载完毕, 还剩${urls.length}条链接`);
            download_s()
          });
        }catch(err){
          download_s()
        }
      }
    }
  }
}

function download_s(){
  setDownload = setTimeout(function(params) {
    if (setDownload) { clearTimeout(setDownload)}
    // 下载任务完成后下载下一个任务
    if (urls.length){
      downloadUrl(urls[0])
    }else{
      download_s()
    }
  },1000)
}

download_s()

module.exports = JoinTheDownLoadQueue
// downloadUrl(["https://b.tile.openstreetmap.org/2/4/0.png"])