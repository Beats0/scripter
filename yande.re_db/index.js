window.onload = function () {
  const downloadHandler = {
    // 创建blob对象
    downloadBlob: function (url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';

        xhr.onload = function () {
          if (xhr.status === 200) {
            resolve(xhr);
          } else {
            reject(new Error(xhr.statusText || 'Download failed.'));
          }
        };
        xhr.onerror = function () {
          reject(new Error('Download failed.'));
        };
        xhr.send();
      });
    },

    downloadURL: function (url, name = '') {
      const link = document.createElement('a');
      link.download = name;
      link.href = url;
      if ('download' in document.createElement('a')) {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // 对不支持download进行兼容
        this.downloadClick(link, (link.target = '_blank'));
      }
    },

    // clone https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js
    downloadClick: function (node) {
      try {
        node.dispatchEvent(new MouseEvent('click'));
      } catch (e) {
        const evt = document.createEvent('MouseEvents');
        evt.initMouseEvent(
          'click',
          true,
          true,
          window,
          0,
          0,
          0,
          80,
          20,
          false,
          false,
          false,
          false,
          0,
          null
        );
        node.dispatchEvent(evt);
      }
    },

    // 以 blob 形式载文件
    downloadFileBlob: function (url, fileName = '') {
      return this.downloadBlob(url, fileName)
        .then(res => {
          const resp = res.response
          if (resp.blob) {
            return resp.blob();
          } else {
            return new Blob([resp]);
          }
        })
        .then(blob => URL.createObjectURL(blob))
        .then(url => {
          this.downloadURL(url, fileName);
          URL.revokeObjectURL(url);
        })
        .catch(err => {
          throw new Error(err.message);
        });
    },
  }

  const app = new Vue({
    el: '#app',
    data: {
      pages: 1,
      currentPage: 1,
      jumpPage: 1,
      showR: false,
      showCheck: false,
      allPics: [],
      pics: [],
      checkedArr: [],
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let picType = ''
        picType = this.showR ? './r.json' : './public.json'
        axios.get(picType).then(res => {
          this.currentPage = 1
          this.pages = Math.ceil(res.data.pics.length / 50)
          this.allPics = res.data.pics
          this.pics = res.data.pics.slice(0, 50)
        })
      },
      handleShowPublic() {
        if (!this.showR) return
        this.showR = false
        this.checkedArr = []
        this.fetchData()
      },
      handleShowR() {
        if (this.showR) return
        this.showR = true
        this.checkedArr = []
        this.fetchData()
      },
      handleCheck(index, item) {
        if (!this.showCheck) {
          window.open(`https://steamuserimages-a.akamaihd.net/ugc/${ item }`, '_blank')
          return
        }
        if (this.checkedArr.includes(index)) {
          this.checkedArr = this.checkedArr.filter(item => item !== index).sort((a, b) => a - b)
        } else {
          this.checkedArr = Array.from(new Set([...this.checkedArr, index])).sort((a, b) => a - b)
        }
      },
      isChecked(index) {
        return this.checkedArr.includes(index)
      },
      handleSelectAll() {
        checkedArr = this.checkedArr.length === this.pics.length ? [] : Array.from({ length: this.pics.length }, (v, i) => i)
        this.checkedArr = checkedArr
      },
      handleDownload() {
          const re = /([a-fA-F0-9]{40})/;
          this.checkedArr.forEach(i => {
              const picCode = this.pics[i]
              const url = `https://steamuserimages-a.akamaihd.net/ugc/${picCode}`
              const fileName = `${picCode.match(re)[0]}.png`
              downloadHandler.downloadFileBlob(url, fileName).then(res => {}).catch(e => {
                  console.log(`pic download failed: ${picCode}`)
              })
          })
      },
      go(page) {
        if (page > this.pages) return
        if (page === this.currentPage) return
        this.currentPage = page < 1 ? 1 : page
        this.checkedArr = []
        this.jumpPage = this.currentPage
        this.pics = this.allPics.slice(50 * (this.currentPage - 1), 50 * (this.currentPage))
      }
    },
    computed: {
      pagesArr() {
        let pageNum = this.pages,
          index = this.currentPage,
          arr = []
        if (pageNum <= 5) {
          for (let i = 1; i <= pageNum; i++) {
            arr.push(i)
          }
          return arr
        }
        if (index <= 2) return [1, 2, 3, 0, pageNum]
        if (index >= pageNum - 1) return [1, 0, pageNum - 2, pageNum - 1, pageNum]
        if (index === 3) return [1, 2, 3, 4, 0, pageNum]
        if (index === pageNum - 2) return [1, 0, pageNum - 3, pageNum - 2, pageNum - 1, pageNum]
        return [1, 0, index - 1, index, index + 1, 0, pageNum]
      },
      isSelectAll() {
        return this.checkedArr.length === this.pics.length ? 'deSelectAll' : 'selectAll'
      }
    },
    watch: {
      currentPage(newVal) {
        this.jumpPage = newVal
      }
    }
  })
}
