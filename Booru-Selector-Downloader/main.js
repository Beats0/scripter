// ==UserScript==
// @name         Booru-Selector-Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0
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
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var originUrl = document.location.origin;
    var REyande = /yande/, REkonachan = /konachan/, REdanbooru = /danbooru/;
    var re1 = /\d\w+/, re2 = /([a-fA-F0-9]{32})/;
    var REyandeResult = REyande.test(originUrl);
    var REkonachanResult = REkonachan.test(originUrl);
    var REdanbooruResult = REdanbooru.test(originUrl);
    if (REyandeResult == true) {
        yande();
    } else if (REkonachanResult == true) {
        konachan();
    } else if (REdanbooruResult == true) {
        danbooru();
    }

    function yande() {
        var main_menu = document.getElementById("main-menu");
        var confBord = document.createElement('li');
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = '<a href="#">Download</a> <a class="submenu-button" href="#">■</a> <ul class="submenu" style="display: block;"> <li><a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="javascript:UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a> </li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson()">logJson</a></li></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson();Yande.sample()">sample version</a></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson();Yande.larger()">larger version</a></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson();Yande.original()">original version</a></ul>';
        main_menu.firstElementChild.appendChild(confBord);
        var posts = document.getElementById('post-list-posts');
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
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = '<a href="#">Download</a> <a class="submenu-button" href="#">■</a> <ul class="submenu" style="display: block;"> <li><a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="javascript:UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a> </li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson()">logJson</a></li></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson();Konachan.image()">image for JPG</a></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson();Konachan.original()">original for PNG</a></li></ul>';
        main_menu.firstElementChild.appendChild(confBord);
        var posts = document.getElementById('post-list-posts');
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
        confBord.setAttribute('class', 'static');
        confBord.innerHTML = '<a href="#">Download</a> <a class="submenu-button" href="#">■</a> <ul class="submenu" style="display: block;"> <li><a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="javascript:UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">Select All</a> </li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logDanbooruJson()">logJson</a></li></li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logDanbooruJson();Danbooru.original()">download original(for jpg and png)</a></li></ul>';
        main_menu.firstElementChild.appendChild(confBord);
        var posts = document.getElementById('posts');
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

    loadCssCode('ul#post-list-posts li {float:none}.imgItem:hover { border: 1px solid #97c0e3; } .imgItemChecked { border: 1px solid #97c0e3; } article.post-preview { float:none;}');

    // myselect.js
    var HeadEl = document.getElementsByTagName('head').item(0);
    var ScriptEl = document.createElement("script");
    ScriptEl.type = "text/javascript";
    ScriptEl.src = "https://beats0.github.io/scripter/Booru-Selector-Downloader/myselect.js";
    HeadEl.appendChild(ScriptEl);
})();