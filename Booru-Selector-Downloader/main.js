// ==UserScript==
// @name         Booru-Selector-Downloader
// @namespace    http://tampermonkey.net/
// @version      3.2
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
    var REyande = /yande/,
        REkonachan = /konachan/,
        REdanbooru = /danbooru/;
    var re1 = /\d\w+/,
        re2 = /([a-fA-F0-9]{32})/,
        re3 =/\.[0-9a-z]+$/i;
    var REyandeResult = REyande.test(originUrl);
    var REkonachanResult = REkonachan.test(originUrl);
    var REdanbooruResult = REdanbooru.test(originUrl);
    if (REyandeResult === true) {
        yandeInit();
    } else if (REkonachanResult === true) {
        konachanInit();
    } else if (REdanbooruResult === true) {
        danbooruInit();
    }

    function yandeInit() {
        var main_menu = document.getElementById("main-menu");
        var confBord = document.createElement('li');
        var posts = document.getElementById('post-list-posts');
        if (!posts) return
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = `<a href="#">Download</a>
 <a class="submenu-button" href="#">■</a> 
 <ul class="submenu" style="display: block;">
  <li>
  <a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a>
   </li>
   <li>
    <a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson()">logJson</a>
   </li>
   <li>
    <a style="color: #ee8887;display: inline;cursor:pointer;">press X download larger version</a>
   </li>
   </ul>`;
        main_menu.firstElementChild.appendChild(confBord);
        var postsItems = posts.querySelectorAll('li');
        for (let i = 0; i < postsItems.length; i++) {
            postsItems[i].classList.add('imgItem');
            postsItems[i].firstElementChild.firstElementChild.setAttribute('onclick', 'return false');
            var p = (re1.exec(postsItems[i].id)[0]);
            // var md5 = (re2.exec(postsItems[i].querySelectorAll('.directlink, .largeimg')[0].href)[0]);
            document.getElementById("p" + p).setAttribute('onclick', `myselect('${p}')`);
            var checkboxEl = document.createElement('div');
            checkboxEl.style.position = 'relative'
            checkboxEl.style.textAlign = 'center'
            checkboxEl.innerHTML = '<input type="checkbox"  class="checkbox" id="cb(' + p + ')" >';
            postsItems[i].insertBefore(checkboxEl, postsItems[i].firstChild);
        }
    }

    /* konachan */
    function konachanInit() {
        var main_menu = document.getElementById("main-menu");
        var confBord = document.createElement('li');
        var posts = document.getElementById('post-list-posts');
        if (!posts) return
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = '<a href="#">Download</a> <a class="submenu-button" href="#">■</a> <ul class="submenu" style="display: block;"> <li><a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a> </li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson()">logJson</a></li><li><a style="color: #ee8887;display: inline;cursor:pointer;">press X download larger version</a></li></ul>';
        main_menu.firstElementChild.appendChild(confBord);
        var postsItems = posts.querySelectorAll('li');
        for (let i = 0; i < postsItems.length; i++) {
            postsItems[i].classList.add('imgItem');
            postsItems[i].firstElementChild.firstElementChild.setAttribute('onclick', 'return false');
            var p = (re1.exec(postsItems[i].id)[0]);
            document.getElementById("p" + p).setAttribute('onclick', `myselect('${p}')`);
            var checkboxEl = document.createElement('div');
            checkboxEl.style.position = 'relative'
            checkboxEl.style.textAlign = 'center'
            checkboxEl.innerHTML = '<input type="checkbox"  class="checkbox" id="cb(' + p + ')" >';
            postsItems[i].insertBefore(checkboxEl, postsItems[i].firstChild);
        }
    }

    /* danbooru */
    function danbooruInit() {
        var main_menu = document.getElementById('nav');
        var confBord = document.createElement('li');
        var posts = document.getElementById('posts');
        if (!posts) return;
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = '<a href="#">Download</a> <a class="submenu-button" href="#">■</a> <ul class="submenu" style="display: block;"> <li><a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a> </li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logDanbooruJson()">logJson</a></li></ul>';
        main_menu.firstElementChild.appendChild(confBord);
        var postsItems = posts.querySelectorAll('article');
        for (let i = 0; i < postsItems.length; i++) {
            postsItems[i].classList.add('imgItem');
            postsItems[i].firstElementChild.setAttribute('onclick', 'return false');
            var p = postsItems[i].dataset.id;
            postsItems[i].setAttribute('onclick', `myselect('${p}')`);
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

    loadCssCode('ul#post-list-posts li {float:none}.imgItem:hover, .imgItem:focus { outline: 1px solid Highlight;outline: 1px auto -webkit-focus-ring-color; } .imgItemChecked { outline: 1px solid Highlight;outline: 1px auto -webkit-focus-ring-color; } article.post-preview { float:none;}');

    var removeFav = document.getElementById('remove-from-favs')
    var addFav = document.getElementById('add-to-favs')

    function downloadLarger() {
        pUrls.map(pic => {
            GMDownload(`${pic.largeFileUrl}`, `${pic.id}${re3.exec(pic.largeFileUrl)[0]}`)
        })
    }

    function downloadOriginal() {
        pUrls.map(pic => {
            GMDownload(`${pic.fileUrl}`, `${pic.id}${re3.exec(pic.fileUrl)[0]}`)
        })
    }

    // GM downloader
    function GMDownload(url, fileName) {
        var arg = {
            url,
            name: fileName,
            onprogress: downloadProgress
        }
        console.log(arg)
        GM_download(arg)
    }

    // press key 'Left' or 'Right' to paginate
    var pageRight = document.querySelector('#paginator > div > a.next_page')
    var pageLeft = document.querySelector('#paginator > div > a.previous_page')

    // in single page
    var largerImage = document.getElementById('highres-show')

    function GMhandler(e) {
        // danbooru
        if(REdanbooruResult) {
            GMhandlerDanbooru(e)
            return;
        }
        // yande.re || konachan
        // larger
        if (e.key === 'x') {
            if (largerImage) {
                GMDownload(largerImage.href, largerImage.href.match(re2)[0])
            } else {
                logJson()
                downloadLarger()
            }
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

    function GMhandlerDanbooru(e) {
        // larger
        if (e.key === 'x') {
            logDanbooruJson()
            downloadLarger()
        }
        // original
        if (e.key === 's') {
            logDanbooruJson()
            downloadOriginal()
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