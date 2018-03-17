// ==UserScript==
// @name         yande.re img selector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  yande.re img selector,consolog which you want and download the pictures on Node.js
// @author       Beats0
// @match        https://yande.re/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var main_menu = document.getElementById("main-menu");
    var confBord = document.createElement('li');
    confBord.setAttribute('class', 'static');
    confBord.innerHTML = '<a href="#">Download</a> <a class="submenu-button" href="#">■</a> <ul class="submenu" style="display: block;"> <li><a class="help-item post current-menu ManagementButton" id="ButtonSelectAll" onclick="javascript:UpdateBatchCount();" style="color: #ee8887;display: inline;cursor:pointer;">DownloadAll</a> </li><li><a style="color: #ee8887;display: inline;cursor:pointer;" onclick="logJson()">logJson()</a></li> </ul>';
    main_menu.firstElementChild.appendChild(confBord);
    var posts = document.getElementById('post-list-posts');
    var postsItems = posts.querySelectorAll('li');
    var re1 = /\d\w+/;
    var re2 = /([a-fA-F0-9]{32})/;
    for (var i = 0; i < postsItems.length; i++) {
        // push
        postsItems[i].classList.add('imgItem');
        postsItems[i].firstElementChild.firstElementChild.setAttribute('onclick', 'return false');
        var p = (re1.exec(postsItems[i].id)[0]);
        var md5 = (re2.exec(postsItems[i].querySelectorAll('.directlink, .largeimg')[0].href)[0]);

        // insert
        document.getElementById("p" + p).setAttribute('onclick', 'myselect(' + p + ',"' + md5 + '")');
        var checkboxEl = document.createElement('div');
        checkboxEl.setAttribute('position', 'relative');
        checkboxEl.innerHTML = '<input type="checkbox"  class="checkbox" id="cb(' + p + ')" >';
        postsItems[i].insertBefore(checkboxEl, postsItems[i].firstChild);
    }

    function loadCssCode(code) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(code));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

    loadCssCode('ul#post-list-posts li {float:none}.imgItem:hover { border: 1px solid #97c0e3; } .imgItemChecked { border: 1px solid #97c0e3; }');

    // myselect.js
    var HeadEl = document.getElementsByTagName('head').item(0);
    var ScriptEl = document.createElement("script");
    ScriptEl.type = "text/javascript";
    ScriptEl.src = "https://beats0.github.io/scripter/yande.re/myselect.js";
    HeadEl.appendChild(ScriptEl);

})();