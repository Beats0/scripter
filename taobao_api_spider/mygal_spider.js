const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage();
    await page.goto('http://mygalgame.com/');

    // 点击搜索框拟人输入 鬼才会想起
    // const musicName = '鬼才会想';
    // await page.type('.txt.j-flag', musicName, {delay: 0});

    // 回车
    // await page.keyboard.press('Enter');
    //
    // // 获取歌曲列表的 iframe
    // await page.waitFor(2000);
    // let iframe = await page.frames().find(f => f.name() === 'contentFrame');
    // const SONG_LS_SELECTOR = await iframe.$('.srchsongst');
    //
    // // 获取歌曲 鬼才会想起 的地址
    // const selectedSongHref = await iframe.evaluate(e => {
    //     const songList = Array.from(e.childNodes);
    //     const idx = songList.findIndex(v => v.childNodes[1].innerText.replace(/\s/g, '') === '鬼才会想起');
    //     return songList[idx].childNodes[1].firstChild.firstChild.firstChild.href;
    // }, SONG_LS_SELECTOR);
    //
    // // 进入歌曲页面
    // await page.goto(selectedSongHref);
    //
    // // 获取歌曲页面嵌套的 iframe
    // await page.waitFor(2000);
    // iframe = await page.frames().find(f => f.name() === 'contentFrame');
    //
    // // 点击 展开按钮
    // const unfoldButton = await iframe.$('#flag_ctrl');
    // await unfoldButton.click();
    //
    // // 获取歌词
    // const LYRIC_SELECTOR = await iframe.$('#lyric-content');
    // const lyricCtn = await iframe.evaluate(e => {
    //     return e.innerText;
    // }, LYRIC_SELECTOR);
    //
    // console.log(lyricCtn);
    //
    // // 截图
    // await page.screenshot({
    //     path: '歌曲.png',
    //     fullPage: true,
    // });
    //
    // // 写入文件
    // let writerStream = fs.createWriteStream('歌词.txt');
    // writerStream.write(lyricCtn, 'UTF8');
    // writerStream.end();
    //
    // // 获取评论数量
    // const commentCount = await iframe.$eval('.sub.s-fc3', e => e.innerText);
    // console.log(commentCount);
    //
    // // 获取评论
    // const commentList = await iframe.$$eval('.itm', elements => {
    //     const ctn = elements.map(v => {
    //         return v.innerText.replace(/\s/g, '');
    //     });
    //     return ctn;
    // });
    // console.log(commentList);
})()