window.onload = function () {
    var app = new Vue({
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
                if(!this.showCheck) {
                    window.open(`https://steamuserimages-a.akamaihd.net/ugc/${item}`, '_blank')
                    return
                }
                if (this.checkedArr.includes(index)) {
                    this.checkedArr = this.checkedArr.filter(item => item !== index).sort((a, b) => a - b)
                } else {
                    this.checkedArr = Array.from(new Set([...this.checkedArr, index])).sort((a, b) => a - b)
                }
            },
            handleSave() {
                let dbArr = []
                const pics = this.pics
                this.checkedArr.map((item, index) => {
                    dbArr.push(pics[item])
                })
                console.log(dbArr)
                localStorage.setItem('yande.re_db', JSON.stringify(dbArr))
            },
            handleClear() {
                localStorage.setItem('yande.re_db', JSON.stringify([]))
                window.alert('localStorage was cleared!')
            },
            isChecked(index) {
                return this.checkedArr.includes(index)
            },
            handleSelectAll() {
                checkedArr = this.checkedArr.length === this.pics.length ? [] : Array.from({length: this.pics.length}, (v, i) => i)
                this.checkedArr = checkedArr
            },
            go(page) {
                if(page > this.pages) return
                if(page === this.currentPage) return
                this.currentPage = page < 1 ? 1 : page
                this.checkedArr = []
                this.jumpPage = this.currentPage
                this.pics = this.allPics.slice(50 * (this.currentPage-1), 50 * (this.currentPage))
            }
        },
        computed: {
            pagesArr() {
                let pageNum = this.pages,
                    index = this.currentPage,
                    arr = []
                if (pageNum <= 5) {
                    for(let i = 1; i <= pageNum; i++) {
                        arr.push(i)
                    }
                    return arr
                }
                if (index <= 2) return [1,2,3,0,pageNum]
                if (index >= pageNum -1) return [1,0, pageNum -2, pageNum -1, pageNum]
                if (index === 3) return [1,2,3,4,0,pageNum]
                if (index === pageNum -2) return [1,0, pageNum-3, pageNum-2, pageNum-1, pageNum]
                return [1,0, index-1, index, index + 1, 0, pageNum]
            },
            isSelectAll() {
                return this.checkedArr.length === this.pics.length ? 'deSelectAll': 'selectAll'
            }
        },
        watch: {
            currentPage (newVal) {
                this.jumpPage = newVal
            }
        }
    })
}
