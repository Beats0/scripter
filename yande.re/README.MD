## yande.re
### usage:

1. copy the ` main.js ` to the  [tampermonkey](http://tampermonkey.net/) script,

2. Visit the yande.re website, select the picture which you want

3. click the ` logJson ` button and open your browser console, it will console an json array

4. copy the json array to the ` pJson.json `

5. edit the ` spider.js` : select which picture vision you want, <b>sample(defaults) || larger(jpg) || original(png)</b>

6. download the picture with [Node](https://nodejs.org/)

```shell
cd yande.re/
npm install request

node ./spider.js
```