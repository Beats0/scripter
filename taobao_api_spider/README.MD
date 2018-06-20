## taobao api spider save to mysql
爬取淘宝api并进行数据存储,主要用于后台数据调用测试

### 使用
 1. 数据库初始化:

执行 `taobao.sql` 语句初始化数据

 2. 配置 `config.js` 数据

 ```js
module.exports = {
    db: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'taobao',
        port: '3306'
    },
    query: {
        q: 'bilibili',  // 查询物品名称
        maxPage: 2,     // 最大搜索页数
        maxRatePage: 3  // 最大评论页数
    }
}
 ```

 3. 运行

```js
cd 
npm install
npm run spider
```

#### 表结构

> item 商品表


名 | 类型 | 长度 | 小数 | not null | primary key| 备注 |
-----|-----|-----|-----|----------|------------|-----|
item_id	    |bigint	        |  20	    | 0	  | ✔    | key1   | Key 商品id
title	    |varchar	    |  255	    | 0   | ✔    |    | 商品名
userId	    |int	        |  15	    | 0   | ✔    |    | 店铺id
nick	    |varchar	    |  255	    | 0   |        |    | 店铺名
price	    |decimal	    |  10	    | 2   | ✔    |    | 现价
originalPrice	|decimal	|  10	    | 2   |        |    | 原价
sold	    |int	        |  15	    | 0   |        |    | 销量
shipping	|decimal	    |  8	    | 2   |        |    | 运费
fastPostFee	|decimal	    |  8	    | 2   |        |    | 运费
img2	    |varchar	    |  255	    | 0   |        |    | 商品大图
location	|varchar	    |  15	    | 0   |        |    | 生产地址
area	    |varchar	    |  15	    | 0   |        |    | 销售区域
commentCount|int	        |  10	    | 0	  |     	|    | 评价数量

sql
```sql
REPLACE INTO `item` VALUES (item_id, title, userId, nick, price, originalPrice, sold, shipping, fastPostFee, img2, location, area, commentCount);
```
--------------------------------------------------------------

> user 用户表


名 | 类型 | 长度 | 小数 | not null |  primary key | 备注|
-----|-----|-----|-----|----------|------------|-----|
userId	    |bigint	        |15 	|0	    |✔     |  key1 | Key 用户id(实际为rateId)
nick	    |varchar	    |20	    |0	    |✔     |        | 名字
avatar	    |varchar	    |255	|0	    |        |      | 头像(图片参数&width=40&height=40)

sql
```sql
REPLACE INTO `user` VALUES (userId, nick, avatar);
```

--------------------------------------------------------------

> rate 评价表


名 | 类型 | 长度 | 小数 | not null | primary key| 备注|
-----|-----|-----|-----|----------|------------|-----|
itemId	        |bigint	       |15	    | 0	    |✔	    |      |商品id
rateId	        |bigint	       |15	    | 0	    |✔      | key1   |交易id(用户id)
rateDate	    |bigint	       |13	    | 0	    |✔      |      |评价时间
rateContent	    |text	       |0	    | 0	    |         |      |评价内容
photos	        |text	       |0	    | 0	    |	      |      |交易返图(图片参数_400x400.jpg)

sql
```sql
REPLACE INTO `rate` VALUES (itemId, rateId, rateDate, rateContent, photos);
```

delete all data 清空所有表
```sql
DELETE FROM `item`;
DELETE FROM `rate`;
DELETE FROM `user`;
```

#### 视图
![view](https://ws1.sinaimg.cn/large/006nOlwNgy1fshgz74sn8j30vr09lq3o.jpg)

#### 查询所有
```sql
SELECT
item.item_id,
rate.photos,
rate.rateContent,
rate.rateDate,
rate.rateId,
`user`.userId,
`user`.nick,
`user`.avatar,
item.title,
item.userid,
item.nick,
item.price,
item.originalPrice,
item.sold,
item.shipping,
item.fastPostFee,
item.img2,
item.location,
item.area,
item.commentCount
FROM
item
INNER JOIN rate ON item.item_id = rate.itemId
INNER JOIN `user` ON rate.rateId = `user`.userId
WHERE
item.item_id = 529501838768
```
