const fs = require('fs');
const request = require('request');
const pJson = require('./pJson');

var dir = './data/';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

/*
   * @yande.re
   *            - sample   {string}     - download post version for .jpg(defaults)
   *            var img_src = 'https://files.yande.re/sample/' + pJson[i].md5 + '/' + pJson[i].id + '.jpg';
   *
   *            - larger   {string}     - download larger version for .jpg
   *            var img_src = 'https://files.yande.re/jpeg/' + pJson[i].md5 + '/' + pJson[i].id + '.jpg';
   *
   *            - original  {string}    - download original version for .png
   *            var img_src = 'https://files.yande.re/image/' + pJson[i].md5 + '/' + pJson[i].id + '.png';
   *
   * @konachan
   *            - image   {string}     - download larger version for .jpg
   *            var img_src = 'https://konachan.com/image/' + pJson[i].md5 + '/' + pJson[i].id + '.jpg';
   *
   *            - original  {string}    - download original version for .png
   *            var img_src = 'https://konachan.com/image/' + pJson[i].md5 + '/' + pJson[i].id + '.png';
   *
   *
   * @danbooru
   *            - original {string}      - download larger version for .jpg
   *            var img_src = 'http://danbooru.donmai.us/data/' + pJson[i].md5 + '.jpg';
   *
   *            - original {string}      - download larger version for .png
   *            var img_src = 'http://danbooru.donmai.us/data/' + pJson[i].md5 + '.png';
   * */

for (var i = 0; i < pJson.length; i++) {
    var img_filename = pJson[i].id + '.jpg';

    // select picture website and version
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