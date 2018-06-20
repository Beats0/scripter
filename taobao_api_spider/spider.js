const mysql = require('mysql')
const axios = require('axios')
const config = require('./config')
const q = config.query.q
const pages = config.query.maxPage
const maxRatePage = config.query.maxRatePage
const db = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port
})

/*
* search 商品搜索
* @param {String} q 商品的名称
* @param {Number} page 页数
* */
for (let page = 1; page <= pages; page++) {
    axios.get(`https://s.m.taobao.com/search?&q=${q}&m=api4h5&page=${page}`)
        .then(res => {
            itemlists = res.data.listItem;
            let len = itemlists.length;
            for (let i = 0; i < len; i++) {
                let item = itemlists[i],
                    item_id = item.item_id,
                    title = item.title,
                    userId = item.userId,
                    nick = item.nick,
                    price = item.price,
                    originalPrice = item.originalPrice,
                    sold = item.sold,
                    shipping = item.shipping,
                    fastPostFee = item.fastPostFee,
                    img2 = item.img2,
                    location = item.location,
                    area = item.area;
                if (sold == 0) sold = item.act;
                let commentCount = item.commentCount;
                if (commentCount === undefined) commentCount = 0;
                db.query(`REPLACE INTO \`item\` VALUES (${item_id}, '${title}', ${userId}, '${nick}', ${price}, ${originalPrice}, ${sold}, ${shipping}, ${fastPostFee}, '${img2}', '${location}', '${area}', ${commentCount});`, (err, data) => {
                    if (err) console.log(err)
                })
                getComments(item_id, maxRatePage)
            }
            console.log(`save success=> https://s.m.taobao.com/search?&q=${q}&m=api4h5&page=${page}`)
        }, err => {
            console.log(err)
        })
}

/*
* rate 商品详情和评价
* @param {String} itemId 商品id
* @param {Number} maxRatePage 最大评价页数
* */
const getComments = (itemId, maxRatePage) => {
    for (let ratePage = 1; ratePage <= maxRatePage; ratePage++) {
        axios.get(`https://rate.taobao.com/feedRateList.htm?auctionNumId=${itemId}&currentPageNum=${ratePage}`)
            .then(res => {
                let data = res.data.replace('(', '').replace(/(.*)\)/, '$1')
                let comments = JSON.parse(data).comments
                let len = comments.length;
                if (comments.length !== 0) {
                    for (let i = 0; i < len; i++) {
                        let comment = comments[i],
                            rateId = comment.rateId,
                            rateDate = comment.date,
                            rateContent = comment.content,
                            photos = comment.photos;
                        let dateString = rateDate.replace('年', '-').replace('月', '-').replace('日', '')
                        let date = Date.parse(dateString), photosUrls = [], photosUrlsStr = '';
                        if (photos.length === 0) {
                            photosUrlsStr = null
                        } else {
                            for (let i = 0; i < photos.length; i++) {
                                photosUrls.push({url: photos[i].url.replace(/jpg(.*)/, 'jpg')})
                            }
                            photosUrlsStr = JSON.stringify(photosUrls)
                        }
                        let user = {
                            nick: comment.user.nick,
                            avatar: comment.user.avatar.replace(/&width(.*)/, ''),
                            userId: rateId
                        }
                        // save rate table
                        db.query(`REPLACE INTO \`rate\` VALUES (${itemId}, ${rateId}, ${date}, '${rateContent}', '${photosUrlsStr}');`)
                        // // save user table
                        db.query(`REPLACE INTO \`user\` VALUES (${user.userId}, '${user.nick}', '${user.avatar}');`)
                    }
                    console.log(`save rateList ${itemId} ${ratePage} success`)
                }
            }, err => {
                console.log(err)
            })
    }
}