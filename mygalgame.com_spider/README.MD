## mygal spider

### for node
```js
npm i puppeteer
node .\mygal_spider.js
```
爬虫结果在 `mygal_spider.txt` 中

### for pytho:
 - python 3.6

#### 依赖:
 - [requests](http://www.python-requests.org/en/master/user/install/#install)
```pyhton
pip install requests
``` 
 - [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
```pyhton
pip install beautifulsoup4
``` 
 - [selenium](http://selenium-python.readthedocs.io/installation.html)
```pyhton
pip install selenium
``` 

#### 工具:
 - webdriver for firefox [geckodriver](https://github.com/mozilla/geckodriver/releases/)
 
#### 说明:
 - 将geckodriver放在python安装目录下
 - 爬取信息默认写入当前目录的 [items.txt](https://github.com/Beats0/scripter/blob/master/mygalgame.com_spider/items.txt) 中
 - 建议不要一次性爬取，会被封ip，处理方法:设置webdriver的proxy
 - 爬虫有点慢，因为selenium不支持多线程，处理方法:将爬虫多复制几份，每份修改对应要爬取的页数，修改默认写入地址(xxx.txt)，然后同时开启多个爬虫，即多进程爬取