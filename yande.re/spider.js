const fs = require('fs');
const request = require('request');
const pJson = require('./pJson');

var dir = './data/';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

/*
   *
   * @sample   {string}     - download post version for .jpg(defaults)
   * var img_src = 'https://files.yande.re/sample/' + pJson[i].md5 + '/' + pJson[i].id + '.jpg';
   *
   * @larger   {string}     - download larger version for .jpg
   * var img_src = 'https://files.yande.re/jpeg/' + pJson[i].md5 + '/' + pJson[i].id + '.jpg';
   *
   * @original  {string}    - download original version for .png
   * var img_src = 'https://files.yande.re/image/' + pJson[i].md5 + '/' + pJson[i].id + '.png';
   *
   * */

for (var i = 0; i < pJson.length; i++) {
    var img_filename = pJson[i].id + '.jpg';
    // picture version
    var img_src = 'https://files.yande.re/sample/' + pJson[i].md5 + '/' + pJson[i].id + '.jpg';
    console.log('download: ' + img_src);
    download(img_src, dir, img_filename)
}

function download(url, dir, filename) {
    request.head(url, function (err, res, body) {
        if (err) console.error(err);
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
}