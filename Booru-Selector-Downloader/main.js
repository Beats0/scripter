// ==UserScript==
// @name         Booru-Selector-Downloader
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  selector the pictures, consolog which you want and download the pictures online or use Node.js
// @author       Beats0
// @match          *://yande.re/post*
// @match          *://konachan.com/*
// @match          *://danbooru.donmai.us/*
// @include     *://yande.re/*
// @include     *://konachan.com/*
// @include     *://konachan.net/*
// @include     *://konachan.com/*
// @include     *://danbooru.donmai.us/*
// @grant        GM_download
// @grant        GM_info
// @grant       GM.download
// @grant       GM.info
// ==/UserScript==

(function () {
    'use strict';
    var originUrl = document.location.origin;
    var REyande = /yande/, REkonachan = /konachan/, REdanbooru = /danbooru/;
    var re1 = /\d\w+/, re2 = /([a-fA-F0-9]{32})/;
    var REyandeResult = REyande.test(originUrl);
    var REkonachanResult = REkonachan.test(originUrl);
    var REdanbooruResult = REdanbooru.test(originUrl);
    if (REyandeResult === true) {
        yande();
    } else if (REkonachanResult === true) {
        konachan();
    } else if (REdanbooruResult === true) {
        danbooru();
    }


    function yande() {
        var main_menu = document.getElementById("main-menu");
        var confBord = document.createElement('li');
        var posts = document.getElementById('post-list-posts');
        if (!posts) return
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = `<a href="#">Download</a>
 <a class="submenu-button" href="#">■</a> 
 <ul class="submenu" style="display: block;">
  <li>
  <a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="javascript:UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a>
   </li>
   <li>
   <a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson()">logJson</a>
   </li>
   </li>
   <li>
   <a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson();Yande.sample()">sample version</a>
   </li>
   <li>
   <a style="color: #ee8887;display: inline;cursor:pointer;" onclick="directlinkArr();Yande.larger()">larger version</a>
   </li>
   <li>
   <a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson();Yande.original()">original version</a>
   </li>
   </ul>`;
        main_menu.firstElementChild.appendChild(confBord);
        var postsItems = posts.querySelectorAll('li');
        for (var i = 0; i < postsItems.length; i++) {
            postsItems[i].classList.add('imgItem');
            postsItems[i].firstElementChild.firstElementChild.setAttribute('onclick', 'return false');
            var p = (re1.exec(postsItems[i].id)[0]);
            var md5 = (re2.exec(postsItems[i].querySelectorAll('.directlink, .largeimg')[0].href)[0]);
            document.getElementById("p" + p).setAttribute('onclick', 'myselect(' + p + ',"' + md5 + '")');
            var checkboxEl = document.createElement('div');
            checkboxEl.setAttribute('position', 'relative');
            checkboxEl.innerHTML = '<input type="checkbox"  class="checkbox" id="cb(' + p + ')" >';
            postsItems[i].insertBefore(checkboxEl, postsItems[i].firstChild);
        }
    }

    /* konachan */
    function konachan() {
        var main_menu = document.getElementById("main-menu");
        var confBord = document.createElement('li');
        var posts = document.getElementById('post-list-posts');
        if (!posts) return
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = '<a href="#">Download</a> <a class="submenu-button" href="#">■</a> <ul class="submenu" style="display: block;"> <li><a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="javascript:UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a> </li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson()">logJson</a></li></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="directlinkArr();Konachan.larger()">larger version</a></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson();Konachan.original()">original for PNG</a></li></ul>';
        main_menu.firstElementChild.appendChild(confBord);
        var postsItems = posts.querySelectorAll('li');
        for (var i = 0; i < postsItems.length; i++) {
            postsItems[i].classList.add('imgItem');
            postsItems[i].firstElementChild.firstElementChild.setAttribute('onclick', 'return false');
            var p = (re1.exec(postsItems[i].id)[0]);
            var md5 = (re2.exec(postsItems[i].querySelectorAll('.directlink, .largeimg')[0].href)[0]);
            document.getElementById("p" + p).setAttribute('onclick', 'myselect(' + p + ',"' + md5 + '")');
            var checkboxEl = document.createElement('div');
            checkboxEl.setAttribute('position', 'relative');
            checkboxEl.innerHTML = '<input type="checkbox"  class="checkbox" id="cb(' + p + ')" >';
            postsItems[i].insertBefore(checkboxEl, postsItems[i].firstChild);
        }
    }

    /* danbooru */
    function danbooru() {
        var main_menu = document.getElementById('nav');
        var confBord = document.createElement('li');
        var posts = document.getElementById('posts');
        if (!posts) return;
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = '<a href="#">Download</a> <a class="submenu-button" href="#">■</a> <ul class="submenu" style="display: block;"> <li><a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="javascript:UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a> </li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logDanbooruJson()">logJson</a></li></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logDanbooruJson();Danbooru.original()">download original(for jpg and png)</a></li></ul>';
        main_menu.firstElementChild.appendChild(confBord);
        var postsItems = posts.querySelectorAll('article');
        for (var i = 0; i < postsItems.length; i++) {
            postsItems[i].classList.add('imgItem');
            postsItems[i].firstElementChild.setAttribute('onclick', 'return false');
            var p = postsItems[i].dataset.id;
            var md5 = postsItems[i].dataset.md5;
            postsItems[i].setAttribute('onclick', 'Danboorumyselect(' + p + ',"' + md5 + '")');
            var checkboxEl = document.createElement('div');
            checkboxEl.setAttribute('position', 'relative');
            checkboxEl.innerHTML = '<input type="checkbox"  class="checkbox" id="cb(' + p + ')" >';
            postsItems[i].insertBefore(checkboxEl, postsItems[i].firstChild);
        }
    }

    function loadCssCode(code) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(code));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

    loadCssCode('ul#post-list-posts li {float:none}.imgItem:hover, .imgItem:focus { outline: 1px solid Highlight;outline: 1px auto -webkit-focus-ring-colo; } .imgItemChecked { outline: 1px solid Highlight;outline: 1px auto -webkit-focus-ring-colo; } article.post-preview { float:none;}');

    var removeFav = document.getElementById('remove-from-favs')
    var addFav = document.getElementById('add-to-favs')

    var flag = false

    // sample version
    function downloadSample() {
        for (let i = 0; i < pUrls.length; i++) {
            let url = ''
            if (REyandeResult) {
                url = 'https://files.yande.re/sample/' + pUrls[i].md5 + '/' + pUrls[i].id + '.jpg';
                GMDownload(url, pUrls[i].id)
            } else if (REkonachanResult) {
                url = 'https://konachan.com/sample/' + pUrls[i].md5 + '/' + pUrls[i].id + '.jpg';
                GMDownload(url, pUrls[i].id)
            }
        }
    }

    // larger version
    let largerArr = Array.from(document.querySelectorAll('.largeimg')).map((pic, index) => pic.href)
    let unMathArr = []

    function downloadLarger() {
        for (let i = 0; i < pUrls.length; i++) {
            let re = new RegExp(pUrls[i].md5, 'i')
            largerArr.map((pic, index) => {
                if (re.test(pic)) {
                    GMDownload(pic, pUrls[i].md5)
                } else {
                    unMathArr = [...unMathArr, `${pUrls[i].id}/${pUrls[i].md5}`]
                }
            })
        }
        unMathArr.map((pic, index) => {
            console.warn(`${pic} dosen't match`)
        })
    }

    // GM downloader
    function GMDownload(url, name) {
        var arg = {
            url,
            name: name + '.jpg',
            onprogress: downloadProgress
        }
        console.log(arg)
        GM_download(arg)
    }

    // press key 'Left' or 'Right' to paginate
    var pageRight = document.querySelector('#paginator > div > a.next_page')
    var pageLeft = document.querySelector('#paginator > div > a.previous_page')

    function GMhandler(e) {
        // sample
        if (e.key === 'z') {
            flag = true
            logJson()
            downloadSample()
        }
        // larger
        if (e.key === 'x') {
            flag = true
            logJson()
            downloadLarger()
        }
        // change fav
        if (e.key === 'c' && removeFav && addFav) {
            var addLink = addFav.firstElementChild
            var removeLink = removeFav.firstElementChild
            removeFav.style.display === 'none' ? addLink.click() : removeLink.click()
        }
        // paginate
        if (e.key === 'd' && pageRight) {
            pageRight.click()
        }
        if (e.key === 'a' && pageLeft) {
            pageLeft.click()
        }
    }

    window.addEventListener('keydown', GMhandler, false)

    // create progress
    var body = document.getElementsByTagName('body')[0];
    var progressEl = document.createElement('div');
    progressEl.innerHTML = `
    <div id='stripe' style="
    position: fixed;
    height: 2px;
    width: 0;
    margin: 0 -3em;
    top: 0;
    background: #ee8887;
    box-shadow: 0 0 10px rgba(249,144,141,0.7);
    transition: width .4s ease;
"></div>`
    body.appendChild(progressEl)

    // downloader progress
    function downloadProgress(xhr) {
        try {
            if (!xhr.lengthComputable)
                return;
            var stripe = document.getElementById('stripe'),
                width = Math.floor(xhr.loaded / xhr.total * 100);
            width === 100 ? stripe.style.width = 0 : stripe.style.width = `${width}%`
        } catch (e) {
            console.error(e);
        }
    }

    // myselect.js
    var HeadEl = document.getElementsByTagName('head').item(0);
    var ScriptEl = document.createElement("script");
    ScriptEl.type = "text/javascript";
    ScriptEl.src = "https://beats0.github.io/scripter/Booru-Selector-Downloader/myselect.js";
    HeadEl.appendChild(ScriptEl);
})();