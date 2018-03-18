## Booru-Selector-Downloader
It works for [yande.re](https://yande.re/) and [konachan](https://konachan.com/)

### usage:

1. copy the ` main.js ` to the  [tampermonkey](http://tampermonkey.net/) script,

2. visit the yande.re or konachan website, select the picture which you want

3. open your browser console, click the ` logJson ` button, it will console the json array

4. copy the json array to the ` pJson.json `

5. edit the ` spider.js ` : select which picture vision and website you want, <b>sample(defaults) || larger(jpg) || original(png)</b>

6. download the picture with [Node](https://nodejs.org/)

```shell
cd Booru-Selector-Downloader/
npm install request

node ./spider.js
```