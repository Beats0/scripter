const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    })
    const page = await browser.newPage()
    // set max page size
    const pageSize = 83
    for (let i = 1; i <= pageSize; i++) {
        await page.goto(`https://www.mygalgame.com/page/${i}`);
        console.log(`======>start page ${i}<======`)
        await page.waitFor(1000)
        let aLinks = await page.evaluate(() => {
            let as = [...document.querySelectorAll(' div.title-article > h1 > a')];
            return as.map((a) => {
                return {
                    href: a.href.trim(),
                    name: a.text
                }
            });
        });
        for (let j = 0; j < aLinks.length; j++) {
            let a = aLinks[j];
            await page.goto(a.href);
            let code = ''
            try {
                let extractedCode = await page.$('div.panel-footer > b:nth-child(1) > span')
                code = await extractedCode.$eval('span', node => node.innerText)
            } catch (e) {
                console.error(`${a.name} ${a.href} has no result`)
            } finally {
                if (code) {
                    console.log(code)
                    await page.type('input.euc-y-i', code);
                    const enter = await page.$('input.euc-y-s')
                    await enter.click()
                    await page.waitFor(1000)
                    const link = await page.evaluate(
                        () => [...document.querySelectorAll('div.panel-body > div > a > button')]
                            .map(element => element.getAttribute('onclick'))
                    );
                    const result = `title: ${a.name}
href: ${a.href}
addr: ${link[0].replace("')", '').replace("window.open('https://www.mygalgame.com/go.php?url=", '').replace("window.open('http://www.mygalgame.com/go.php?url=", '')}
pwd: ${code}\n\n`
                    console.log(result)
                    fs.appendFile('mygal_spider.txt', result, (err) => {
                        if (err) console.error(`failed at ${result}`, err);
                    });
                }
            }
        }
    }
})()