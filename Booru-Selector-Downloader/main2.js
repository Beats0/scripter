// ==UserScript==
// @name              Booru-Selector-Downloader
// @namespace         http://tampermonkey.net/
// @version           4.0.0
// @description       A selector and downloader for the various booru imageboards
// @description:en    A selector and downloader for the various booru imageboards
// @description:zh    图站选择下载器
// @author            Beats0
// @match             *://yande.re/post*
// @match             *://konachan.net/*
// @match             *://konachan.com/*
// @match             *://danbooru.donmai.us/*
// @include           *://yande.re/*
// @include           *://konachan.net/*
// @include           *://konachan.com/*
// @include           *://danbooru.donmai.us/*
// @grant             GM_addStyle
// @grant             GM_download
// @grant             GM_openInTab
// ==/UserScript==

(function () {
  'use strict';
  const originUrl = document.location.origin;
  const locationUrl = document.location.protocol + '//' + window.location.host;
  const REyande = /yande/,
    REkonachan = /konachan/,
    REdanbooru = /danbooru/;
  const re1 = /\d\w+/,
    re2 = /([a-fA-F0-9]{32})/,
    re3 =/\.[0-9a-z]+$/i;
  const REyandeResult = REyande.test(originUrl);
  const REkonachanResult = REkonachan.test(originUrl);
  const REdanbooruResult = REdanbooru.test(originUrl);
  let parse = null
  const reTrySvgIcon = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11702" width="20" height="20"><path d="M512 214.016q141.994667 0 242.005333 100.010667t100.010667 240q0 141.994667-100.992 242.005333t-240.981333 100.010667-240.981333-100.010667-100.992-242.005333l86.016 0q0 105.984 75.008 180.992t180.992 75.008 180.992-75.008 75.008-180.992-75.008-180.992-180.992-75.008l0 171.989333-214.016-214.016 214.016-214.016 0 171.989333z" p-id="11703" fill="#ee8887"></path></svg>`

  function $(selector) {
    return document.querySelector(selector)
  }

  function $$(selector) {
    return document.querySelectorAll(selector)
  }

  function domParser(fragment) {
    if(!parse) {
      const range = document.createRange();
      parse = range.createContextualFragment.bind(range);
    }
    return parse(fragment)
  }

  class BooruDownloader {
    constructor() {
      this.batchCount = 0
      this.downloadLimit = 4
      this.init()
      this.initStyle()
      this.initMenuPanel()
      this.initHotKey()
    }

    init() {
      console.log('init BooruDownloader')
      if (REyandeResult || REkonachanResult) {
        this.init_yande_konachan();
      } else if (REdanbooruResult) {
        this.init_danbooru();
      }
    }

    initStyle() {
      const styleCode = `
        :root {
                --primary-backgroundColor: #eee;
                --primary-lineBackgroundColor: #ccc;
                --primary-fontColor: #ee8887;
                --primary-fontColorHover: #ff4342;
                --primary-headerFontColor: #ffffff;
                --primary-border: 1px solid transparent;
            }
      
            [data-theme=light] .darkToggleIcon {
                display: none;
            }
            [data-theme=dark] .lightToggleIcon {
                display: none;
            }
            ul#post-list-posts li {
                float: none
            }
      
            .imgItem:hover, .imgItem:focus {
                outline: 1px solid var(--primary-fontColor);
            }
      
            .imgItemChecked {
                outline: 1px solid var(--primary-fontColor);
            }
      
            article.post-preview {
                float: none;
            }
      
            .helper-board {
                width: 450px;
                height: 320px;
                position: fixed;
                font-size: 12px;
                right: 10px;
                bottom: 0;
                background: var(--primary-backgroundColor);
                color: var(--primary-fontColor);
                border: var(--primary-border);
                border-radius: 5px;
                overflow: hidden;
                transition: all cubic-bezier(.22,.58,.12,.98) .4s;
                box-shadow: 0 2px 12px 0 rgba(246, 150, 149, 0.6);
            }
      
            .helper-board.helper-board-small {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                bottom: 50vh;
                cursor: pointer;
                background: var(--primary-fontColor);
            }
      
            .helper-board.helper-board-small .board-header {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
            .helper-board.helper-board-small .board-header .board-close-button, .helper-board.helper-board-small .board-header .board-header-text, .helper-board.helper-board-small .theme-btn {
                display: none;
            }
            .helper-board.helper-board-small .board-header .board-header-small-tip {
                display: block;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                line-height: 50px;
                text-align: center;
                font-size: 26px;
            }
      
            .board-header {
                height: 30px;
                color: var(--primary-headerFontColor);
                background: var(--primary-fontColor);
                font-size: 16px;
            }
      
            .board-header-inner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 32px;
            }
      
            .board-content {
                overflow-y: auto;
                overflow-x: hidden;
                max-height: 340px;
                padding: 10px 12px;
                height: 100%;
                font-size: 14px;
            }
      
            .board-header-text {
                line-height: 30px;
                padding-left: 10px;
                font-size: 14px;
            }
      
            .board-close-button {
                position: absolute;
                top: 5px;
                right: 3px;
                width: 20px;
                height: 20px;
                margin: 0;
                padding: 0;
                cursor: pointer;
                transition: all .3s;
            }
      
            .board-close-button:hover {
                color: var(--primary-headerFontColor);
            }
            .board-header-small-tip {
                display: none;
            }
      
            .board-content-row {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                height: 20px;
            }
      
            .row-label {
                color: var(--primary-fontColor);
                margin-right: 8px;
            }
            .row-content {
                display: flex;
                align-items: center;
            }
            .hover-item-line {
                color: var(--primary-fontColor);
                text-decoration: underline!important;
                cursor: pointer;
            }
            .hover-item-line:hover {
                color: var(--primary-fontColorHover);
            }
            .hover-item {
                color: var(--primary-fontColor);
                cursor: pointer;
            }
            .hover-item:hover {
                color: var(--primary-fontColorHover);
            }
      
            .download-row-container {
                margin-top: 15px;
            }
            .download-row {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }
            .download-row-title {
                color: var(--primary-fontColor);
                margin-right: 10px;
            }
            .download-row-line {
                flex: 1;
                height: 4px;
                background: var(--primary-lineBackgroundColor);
                margin-right: 10px;
            }
            .download-row-line-active {
                height: 100%;
                background: var(--primary-fontColor);
                transition: width .4s ease;
            }
            .download-row-percent {
                color: var(--primary-fontColor);
                width: 50px;
            }
            .fav-state {
                margin-left: 7px;
                color: var(--primary-fontColor);
            }
            .re-try-icon svg {
                margin-left: 5px;
                cursor: pointer;
                transform: translateY(3px);
            }
      
            .theme-btn {
                background: none;
                border: none;
                color: var(--primary-headerFontColor);
                cursor: pointer;
                font-family: inherit;
                padding: 0;
                align-items: center;
                border-radius: 50%;
                display: flex;
                height: 100%;
                justify-content: center;
                transition: 200ms;
            }
      `
      GM_addStyle(styleCode)
    }

    init_yande_konachan() {
      let posts = $('#post-list-posts');
      if (!posts) return
      let postsItems = posts.querySelectorAll('li');
      for (let i = 0; i < postsItems.length; i++) {
        postsItems[i].classList.add('imgItem');
        postsItems[i].firstElementChild.firstElementChild.setAttribute('onclick', 'return false');
        const template = `<div style="position: relative;text-align: center;"><input type="checkbox" class="checkbox"></div>`
        postsItems[i].insertAdjacentHTML('afterbegin', template);
      }
      posts.addEventListener('click', (e) => this.handleClickImg(e, 'post-list-posts'))
    }

    init_danbooru() {

    }

    initMenuEvent() {
      const headerEl = $('.board-header')
      headerEl.onclick = function (e) {
        const boardEl = headerEl.parentNode
        if(boardEl.classList.contains('helper-board-small')) {
          boardEl.classList.remove('helper-board-small')
        } else {
          if(e.target.className === 'board-close-button') {
            boardEl.classList.add('helper-board-small')
          }
        }
      }
      const theme = localStorage.getItem('h-theme') || 'light'
      this.setTheme(theme)

      $('.theme-btn').addEventListener('click', (e) => this.handleToggleTheme(e))
      $('#buttonSelectAll').addEventListener('click', (e) => this.handleClickMenuAllBtn(e))
      $('#downloadLarger').addEventListener('click', (e) => this.handleDownLoadImg(e, 'larger'))
      $('#downloadOriginal').addEventListener('click', (e) => this.handleDownLoadImg(e, 'original'))
      $('#addFavorite').addEventListener('click', (e) => this.handleFavorite(true))
      $('#removeFavorite').addEventListener('click', (e) => this.handleFavorite(false))
      $('.fav-list-container').addEventListener('click', (e) => this.handleClickFavList(e, 'fav-list-container'))
    }

    initMenuPanel() {
      const template = `
        <div class="helper-board">
         <div class="board-header">
            <div class="board-header-inner">
              <div class="board-header-text">Booru-Selector-Downloader</div>
              <button class="theme-btn"
                      type="button"
                      title="Change Theme">
                <svg viewBox="0 0 24 24" width="20" height="20" class="lightToggleIcon">
                  <path fill="currentColor" d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"></path>
                </svg>
                <svg viewBox="0 0 24 24" width="20" height="20" class="darkToggleIcon">
                  <path fill="currentColor" d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path>
                </svg>
              </button>
            </div>
            <div class="board-close-button" title="close">X</div>
            <div class="board-header-small-tip">H</div>
          </div>
          <div class="board-content">
            <div class="board-content-row">
              <div class="row-label hover-item" id="buttonSelectAll">Select All 0 Image</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="downloadLarger">Download Larger</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="downloadOriginal">Download Origin</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="addFavorite">Add To Favorite</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="removeFavorite">Remove From Favorite</div>
            </div>
            <div class="board-content-row">
              <div class="row-label">Release Note: </div>
              <a class="row-content hover-item-line" href="https://greasyfork.org/zh-CN/scripts/371605-booru-selector-downloader" target="_blank">v4.0.0</a>
            </div>
            <div class="fav-list-container"></div>
            <div class="download-row-container"></div>
          </div>
        </div>
      `
      document.body.insertAdjacentHTML('beforeend', template)
      this.initMenuEvent()
    }

    initHotKey() {
      window.addEventListener('keydown', this.hotKeyHandler, false)
    }

    hotKeyHandler(e) {
      // press key `A` or `D` to paginate
      const pageRight = $('#paginator > div > a.next_page')
      const pageLeft = $('#paginator > div > a.previous_page')
      // `A`, `D`: paginate
      if (e.key === 'd' && pageRight) {
        pageRight.click()
      }
      if (e.key === 'a' && pageLeft) {
        pageLeft.click()
      }

      // `F`: Favorite
      if (e.key === 'f') {
        this.handleFavorite(true)
      }
      // `R`: Remove from favorites
      if (e.key === 'r') {
        this.handleFavorite(false)
      }

      // `S`: Save larger image
      if (e.key === 's') {
        this.handleDownLoadImg(null, 'larger').then(res => {})
      }
    }

    handleToggleTheme(e) {
      const theme = document.body.getAttribute('data-theme')
      theme === 'light' ? this.setTheme('dark') : this.setTheme('light')
    }

    /**
     * @param   {string}    theme  light | dark
     * */
    setTheme(theme) {
      if(theme === 'light') {
        const lightTheme = [
          {key: 'backgroundColor', value: '#eee'},
          {key: 'lineBackgroundColor', value: '#ccc'},
          {key: 'fontColor', value: '#ee8887'},
          {key: 'fontColorHover', value: '#ff4342'},
          {key: 'headerFontColor', value: '#ffffff'},
          {key: 'border', value: '1px solid #c17b7b'},
        ]
        lightTheme.forEach(item => this.setCssVariable(item))
        document.body.setAttribute('data-theme', 'light')
        localStorage.setItem('h-theme', 'light')
      } else {
        const darkTheme = [
          {key: 'backgroundColor', value: '#222'},
          {key: 'lineBackgroundColor', value: '#ccc'},
          {key: 'fontColor', value: '#ee8887'},
          {key: 'fontColorHover', value: '#ffffff'},
          {key: 'headerFontColor', value: '#ffffff'},
          {key: 'border', value: '1px solid #ee8887'},
        ]
        darkTheme.forEach(item => this.setCssVariable(item))
        document.body.setAttribute('data-theme', 'dark')
        localStorage.setItem('h-theme', 'dark')
      }
    }

    setCssVariable({ key, value }) {
      const propertyName = `--primary-${key}`;
      document.documentElement.style.setProperty(propertyName, value);
    }

    handleClickMenuAllBtn(e) {
      const btn = e.target
      if (this.batchCount >= 1) {
        btn.innerHTML = "DeselectAll  " + this.batchCount + " Image";
        this.deselectAll()
      } else {
        btn.innerHTML = "SelectAll  " + this.batchCount + " Image";
        this.selectAll()
      }
    }

    /**
     * @param   {Event}     e
     * @param   {string}   type   larger | original
     * */
    async handleDownLoadImg(e, type = 'larger') {
      const postsItems = $$('.imgItemChecked');
      let imgs = []
      if(postsItems.length) {
        this.updateFetchingProgress(0, postsItems.length)
      }
      for (let i = 0; i < postsItems.length; i++) {
        const id = Number(postsItems[i].getAttribute('id').replace('p', ''))
        const imgInfo = await this.fetchDetailPage(id)
        imgs.push({
          id,
          url: imgInfo[type],
          fileName: `${id}${re3.exec(imgInfo[type])[0]}`
        })
        this.updateFetchingProgress(i + 1, postsItems.length)
      }
      this.createDownloadProgress(imgs)
      // downloadPool
      await this.downloadPool(imgs)
    }

    updateFetchingProgress(i, total) {
      const el = $('#fetching-download-row')
      if(!el) {
        const downloadElContainer = $('.download-row-container')
        const template = `
        <div id="fetching-download-row" class="download-row">
          <div class="download-row-title">Fetching</div>
          <div class="download-row-line">
            <div class="download-row-line-active" style="width: 0%;"></div>
          </div>
          <div class="download-row-percent">${i}/${total}</div>
        </div>
        `
        downloadElContainer.insertAdjacentHTML('afterbegin', template)
      } else {
        const width = (Math.round(i / total * 10000) / 100.00);
        el.querySelector('.download-row-line-active').style.width = `${width}%`
        el.querySelector('.download-row-percent').innerText = `${i}/${total}`
      }
    }

    async downloadPool(imgs = []) {
      for (let i = 0; i < imgs.length; i++) {
        this.updateDownloadProgress(imgs[i])
      }
      let pool = []
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]
        const task = this.downloadHandler(img)
        pool.push(task)
        task
          .then((id) => {
            console.log(`${ id } ok`)
          })
          .catch((id) => {
            console.log(`${ id } error`)
          })
          .finally(() => {
            pool.splice(pool.indexOf(task), 1)
          })
        if (pool.length === this.downloadLimit) {
          await Promise.race(pool)
        }
      }
    }

    downloadHandler(img) {
      // see GM_download:  https://www.tampermonkey.net/documentation.php#GM_download
      return new Promise((resolve, reject) => {
        const arg = {
          url: img.url,
          name: img.fileName,
          onprogress: (xhr) => {
            this.downloadProgress(xhr, img.id, false)
            if(Math.floor(xhr.loaded / xhr.total * 100) >= 100) {
              resolve(img.id)
            }
          },
          onload: () => {
            resolve(img.id)
            this.downloadProgress(null, img.id, true)
          },
          onerror: () => {
            // still resolve
            resolve(img.id)
            this.onDownloadError(img)
          },
          ontimeout: () => {
            // still resolve
            resolve(img.id)
            this.onDownloadError(img)
          }
        }
        GM_download(arg)
      })
    }

    /**
     * @param   {Array}   imgs
     * */
    createDownloadProgress(imgs) {
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]
        const pageUrl = this.getPageUrl(img.id)
        const downloadRowEl = $(`#download-row-${img.id}`)
        if(!downloadRowEl) {
          // create downloadRow
          const downloadList = $('.download-row-container')
          const template = `
            <div id="download-row-${img.id}" class="download-row">
               <a href="${pageUrl}" class="download-row-title hover-item-line" target="_blank">${img.id}</a>
               <div class="download-row-line">
                 <div class="download-row-line-active" style="width: 0%;"></div>
               </div>
               <div class="download-row-percent">0%</div>
            </div>
         `
          downloadList.insertAdjacentHTML('beforeend', template)
        }
      }
    }

    updateDownloadProgress({id, url, fileName}) {
      const downloadRowEl = $(`#download-row-${id}`)
      if(!downloadRowEl) {
        // create downloadRow
        const downloadList = $('.download-row-container')
        const pageUrl = this.getPageUrl(id)
        const template = `
            <div id="download-row-${id}" class="download-row">
               <a href="${pageUrl}" class="download-row-title hover-item-line" target="_blank">${id}</a>
               <div class="download-row-line">
                 <div class="download-row-line-active" style="width: 0%;"></div>
               </div>
               <div class="download-row-percent">0%</div>
            </div>
         `
        downloadList.insertAdjacentHTML('beforeend', template)
      }
    }

    onDownloadError(img) {
      const downloadRowEl = $(`#download-row-${img.id}`)
      const el = downloadRowEl.querySelector('.download-row-percent')
      if(!el.classList.contains('hover-item')) {
        el.classList.add('hover-item')
      }
      el.innerHTML = reTrySvgIcon
      el.onclick = this.downloadHandler(img)
    }

    /**
     * @param     {ProgressEventInit | null}   xhr
     * @param     {number}                      id
     * @param     {boolean}                     isFinished
     * */
    downloadProgress(xhr, id, isFinished = false) {
      let width = 0
      if (xhr === null && isFinished) {
        width = 100
      } else {
        width = xhr.lengthComputable ? Math.floor(xhr.loaded / xhr.total * 100) : 0;
      }

      const downloadRowEl = $(`#download-row-${ id }`)
      if (!downloadRowEl) {
        // create downloadRow
        const downloadList = $('.download-row-container')
        const pageUrl = this.getPageUrl(id)
        const template = `
            <div id="download-row-${ id }" class="download-row">
               <a href="${ pageUrl }" class="download-row-title hover-item-line" target="_blank">${ id }</a>
               <div class="download-row-line">
                 <div class="download-row-line-active" style="width: ${ width }%;"></div>
               </div>
               <div class="download-row-percent">${ width }%</div>
            </div>
         `
        downloadList.insertAdjacentHTML('beforeend', template)
      } else {
        // update downloadRow
        downloadRowEl.querySelector('.download-row-title').innerText = id
        downloadRowEl.querySelector('.download-row-line-active').style.width = `${ width }%`
        downloadRowEl.querySelector('.download-row-percent').innerText = `${ width }%`
      }
    }

    /**
     * @param   {number}    id
     * @return  {string}
     * */
    getPageUrl(id) {
      let pageUrl = ``
      if(REyandeResult || REkonachanResult) {
        pageUrl = `${locationUrl}/post/show/${id}`
      }
      if(REdanbooruResult) {
        pageUrl = `${pageUrl}/post/${id}`
      }
      return pageUrl
    }

    /**
     * @param   {boolean}   isLike
     * */
    handleFavorite(isLike) {
      const postsItems = $$('.imgItemChecked');
      for (let i = 0; i < postsItems.length; i++) {
        const id = Number(postsItems[i].getAttribute('id').replace('p', ''))
        this.fetchFavorite(id, isLike)
      }
    }

    /**
     * @param   {number}      id
     * @param   {boolean}     isLike
     * */
    fetchFavorite(id, isLike) {
      if(REyandeResult || REkonachanResult) {
        const csrfToken = $("meta[name=csrf-token]").content
        fetch(`${locationUrl}/post/vote.json`, {
          "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-csrf-token": csrfToken,
          },
          "body": `id=${ id }&score=${ isLike ? 3 : 2}`,
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        })
          .then(res => {
            if(res.status === 200) {
              const log = {
                id,
                isLike,
                result: 'success',
              }
              this.addFavoriteLog(log)
            }
          })
          .catch(e => {
            const log = {
              id,
              isLike,
              result: 'error',
            }
            this.addFavoriteLog(log)
            console.error('add favorite error')
          })
      }
    }

    handleClickFavList(e, parentClassName) {
      let el = e.target
      let hasEl = false
      while (el !== document && el.className !== parentClassName) {
        // click re-try-icon to re add favorite
        if (el.className === 're-try-icon') {
          hasEl = true
          break;
        }
        el = el.parentNode
      }
      if(!hasEl) return

      const id = Number(el.getAttribute('data-id'))
      const isLike = el.getAttribute('data-isLike') === 'true'
      this.fetchFavorite(id, isLike)
    }

    /**
     * @param   {number}      log.id
     * @param   {boolean}     log.isLike
     * @param   {string}      log.result    success | error
     * */
    addFavoriteLog(log) {
      const { id, isLike, result } = log
      const el = $('.fav-list-container')
      const logItemEl = $(`#favLog${id}`)
      if(!logItemEl) {
        const pageUrl = this.getPageUrl(id)
        const elItem = document.createElement('div')
        elItem.className = 'board-content-row'
        elItem.id = `favLog${id}`
        elItem.innerHTML = `
        <div class="row-label">${isLike ? 'Add' : 'Remove'} Favorites: </div>
        <div class="row-content">
          <a class="hover-item-line" href="${pageUrl}" target="_blank">${id}</a>
          <span class="fav-state">${result === 'success' ? 'Success' : 'Error'}</span>
          ${ result === 'error' ? `<span data-id="${id}" data-isLike="${String(isLike)}" class="re-try-icon">${reTrySvgIcon}</span>` : '' }
        </div>`
        el.appendChild(elItem)
      } else {
        logItemEl.querySelector('.row-label').innerText = isLike ? 'Add Favorites: ' : 'Remove Favorites: '
        logItemEl.querySelector('.fav-state').innerText = result === 'success' ? 'Success' : 'Error'
        let iconEl = logItemEl.querySelector('.re-try-icon')
        if(result === 'success') {
          // remove re-icon
          if(iconEl) iconEl.remove()
        } else if(result === 'error') {
          // create re-icon
          if(!iconEl) {
            logItemEl.querySelector('.row-content').insertAdjacentHTML('beforeend', `<span data-id="${id}" data-isLike="${String(isLike)}" class="re-try-icon">${reTrySvgIcon}</span>`);
          }
        }
      }
    }

    /**
     * @interface     imgInfo
     * @param         {number}      id
     * @return        {Promise<imgInfo | Error>}
     * */
    fetchDetailPage(id) {
      const link = this.getPageUrl(id)
      return new Promise((resolve, reject) => {
        let imgInfo = {
          larger: '',
          original: '',
        }
        if(REyandeResult || REkonachanResult) {
          fetch(link)
            .then(res => res.text())
            .then(res => {
              const bodyText = res
              const dom = domParser(bodyText)
              const largerSrc = dom.querySelector('#highres-show').href
              const originalSrc = dom.querySelector('#highres').href
              imgInfo = {
                larger: largerSrc,
                original: originalSrc,
              }
              console.log(imgInfo);
              resolve(imgInfo)
            }).catch(e => {
            console.log(e)
            reject(e)
          })
        }
        if(REdanbooruResult) {
          fetch(link)
            .then(res => res.text())
            .then(res => {
              const bodyText = res
              const dom = domParser(bodyText)
              const largerSrc = dom.querySelector('#highres-show').href
              const originalSrc = dom.querySelector('#highres').href
              imgInfo = {
                larger: largerSrc,
                original: originalSrc,
              }
              console.log(imgInfo);
              resolve(imgInfo)
            }).catch(e => {
            console.log(e)
            reject(e)
          })
        }
      })
    }

    handleClickImg(e, parentId) {
      let el = e.target
      let hasEl = false
      while (el !== document && el.id !== parentId) {
        if (el.tagName.toLowerCase() === 'li') {
          hasEl = true
          break;
        }
        el = el.parentNode
      }
      if(!hasEl) return;

      // press ctrlKey: open in new window, loadInBackground true, won't auto focus
      if(e.ctrlKey) {
        const link = el.querySelector('a.thumb').href
        GM_openInTab(link, true)
        return;
      }

      // press altKey: open in new window, loadInBackground false, will auto focus
      if(e.altKey) {
        const link = el.querySelector('a.thumb').href
        GM_openInTab(link, false)
        return;
      }
      const cbEl = el.getElementsByClassName('checkbox')[0]
      cbEl.checked = !cbEl.checked
      cbEl.checked ? el.classList.add('imgItemChecked') : el.classList.remove('imgItemChecked')
      this.updateBatchCount()
    }

    updateBatchCount() {
      let checked = 0;
      $$('.checkbox').forEach(function (checkbox) {
        if (checkbox.checked) {
          ++checked;
        }
      });
      this.batchCount = checked;
      const btn = $('#buttonSelectAll')
      if (this.batchCount >= 1) {
        btn.innerHTML = "DeselectAll  " + this.batchCount + " Image";
      } else {
        btn.innerHTML = "SelectAll  " + this.batchCount + " Image";
      }
    }

    selectAll() {
      $$('.checkbox').forEach(function (checkbox) {
        checkbox.checked = true;
        checkbox.parentNode.parentNode.classList.add('imgItemChecked');
      });
      this.updateBatchCount();
    }

    deselectAll() {
      $$('.checkbox').forEach(function (checkbox) {
        checkbox.checked = false;
        checkbox.parentNode.parentNode.classList.remove('imgItemChecked');
      });
      this.updateBatchCount();
    }
  }

  const booruDownloader = new BooruDownloader()
  window.booruDownloader = booruDownloader
})();
