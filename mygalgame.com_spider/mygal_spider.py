# -*- coding:utf-8 -*-
from selenium import webdriver
import time
import requests
from bs4 import BeautifulSoup


'''
@driver Firefox
'''
firefox_profile = webdriver.FirefoxProfile()
firefox_profile.set_preference("permissions.default.stylesheet",2)  #禁用样式表文件
firefox_profile.set_preference("permissions.default.image",2)       #不加载图片
firefox_profile.set_preference("javascript.enabled",False)          #禁止JS
'''
用于webdriver proxy与处理SSL错误: ssl_error_rx_record_too_long

@proxy type1  手动配置代理
'''
# # 开启
# firefox_profile.set_preference("network.proxy.type", 1)
# firefox_profile.set_preference("network.proxy.share_proxy_settings", True)
# firefox_profile.set_preference("network.http.use-cache", False)
# # HTTP代理
# firefox_profile.set_preference("network.proxy.http", "122.72.18.35")
# firefox_profile.set_preference("network.proxy.http_port", int(80))
## SSL代理
# firefox_profile.set_preference('network.proxy.ssl', agent_IP)
# firefox_profile.set_preference('network.proxy.ssl_port', int(agent_Port))
## 自定义UserAgent
# firefox_profile.set_preference("general.useragent.override","whater_useragent")#自定义
'''
@proxy type2  自动代理配置(PAC)
'''
# firefox_profile.setPreference("network.proxy.type", 2)
# firefox_profile.setPreference("network.proxy.autoconfig_url", "http://proxy.myweb.com:8083")

firefox_profile.update_preferences()            #更新设置
driver = webdriver.Firefox(firefox_profile)     #创建driver

# 建议不设置
# driver.implicitly_wait(20)                ##设置超时时间
# driver.set_page_load_timeout(20)          ##设置超时时间

# requests处理
def get_html(url):
    try:
        r = requests.get(url)
        return r.content
    except:
        return " ERROR "

# BeautifulSoup处理 返回page中的urls,最要是为了提高提取速度
def get_url(url):
    urls = []
    html = get_html(url)
    soup = BeautifulSoup(html, 'lxml')

    divItem =  soup.find_all('div', attrs={'class': 'title-article'})
    for item in divItem:
        comment = {}
        try:
            comment['link'] = item.find('h1').find('a')['href']
            urls.append(comment)
        except:
            # 异常直接忽略
            # print("something error")
            ...
    return urls

# 处理get_url()函数返回值为空数组的情况
def check(page_url):
    while (1):
        flag = False
        print("restart page url >>>" + page_url)
        urls = get_url(page_url)
        if urls.__len__() != 0:
            flag = True
            return urls
        if flag == True:
            break

# 主函数 用于提取资源 最后返回items数组
def getInfor(url):
    driver.get(url)
    start_time = time.time()
    # 等待一定时间，让js脚本加载完毕
    driver.implicitly_wait(2)
    items = []
    item = {}
    flag = 0
    try:
        # 是否有提取码
        ExtractedCode = driver.find_element_by_xpath('//div[@class = "panel-footer"]/b/span/span')
        # 是否有输入框
        text = driver.find_element_by_class_name('euc-y-i')
        if ExtractedCode is not None:
            if text is not None:
                flag = True
                # print(ExtractedCode.text)
                # 找到提取框
                # 清空提取框内文字
                text.clear()
                # 填写提取码
                text.send_keys(ExtractedCode.text)
                # 找到submit按钮
                button = driver.find_element_by_class_name('euc-y-s')
                # 提交
                button.submit()
                driver.implicitly_wait(5)
                time.sleep(3)
                pwd = driver.find_element_by_xpath('//div[@class = "panel panel-primary"]/div[@class = "panel-footer"]/b/span/span')
                addrPath = driver.find_element_by_xpath('//div[@class = "panel panel-primary"]/div[@class = "panel-body"]/div[@class="e-secret"]/a/button')
                title = driver.find_element_by_xpath('//div[@class = "title-article"]/h4/a')
                addr1 = addrPath.get_attribute('onclick')
                addr=addr1.replace("https://","").replace("http://","").replace("window.open('www.mygalgame.com/go.php?url=","").replace("')","")
                datePath = driver.find_elements_by_xpath('//span[@class = "label label-zan"]')
                print('title:',title.text,'\ndata:',datePath[0].text,'\naddr:',addr,'\npwd:',pwd.text,'\nurl:',title.get_attribute('href'))
                print("time used  : ", "%.3f" % (time.time()-start_time), "s")

                item['title'] = title.text
                item['date'] = datePath[0].text
                item['addr'] = addr
                item['pwd'] = pwd.text
                item['url'] = title.get_attribute('href')
                items.append(item)
                return items
            else:
                print("field at >>>>>>>" + url)
    except:
        print(url+" has no item")
        if flag == True:
            processorField(url)
            return items

# 处理函数
def processor(page_url):
    print("\nstart page>>>>>>>>>>>>>>>>>>" + page_url + "<<<<<<<<<<<<<<<<<<<<<<<")
    urls = check(page_url)
    print(urls)
    for url in urls:
        print("\nstart >>> " + url['link'] + "\n")
        items = getInfor(url['link'])
        # 因为网络延迟和浏览器动作处理问题，适当调整停滞时间
        time.sleep(2)
        if items is not None:
            Out2File(items)


# 单独处理因网络问题而导致爬取失败的url,完成后直接写入
def processorField(url):
    print("re processor >>> "+url)
    items = getInfor(url)
    # 因为网络延迟和浏览器动作处理问题，适当调整停滞时间
    time.sleep(2)
    if items is not None:
        Out2File(items)

# 写入到items.txt
def Out2File(dict):
    with open('items.txt', 'a+',encoding='utf-8') as f:
        for item in dict: f.write(' title：{} \n date：{} \n addr：{} \n pwd：{} \n url： {} \n\n'.format(item['title'],item['date'],item['addr'], item['pwd'],item['url']))

# 查看百度云链接是否失效
# def checkAlive(list):
#     for url in list:
#        urls = []
#     html = get_html(url)
#     soup = BeautifulSoup(html, 'lxml')

# 开始爬取
# page_urls = []
page_urls = ["https://www.mygalgame.com/"]
# 设置爬虫页数(ip封锁时设置proxy)
page_number = 80
for i in range(2, page_number + 1):
    page_urls.append("https://www.mygalgame.com/page/" + str(i) + "/")
for page_url in page_urls:
    processor(page_url)

# 处理某个单独链接
# url = 'https://www.mygalgame.com/kanon.html'
# processorField(url)