var originUrl = document.location.origin;
var REyande = /yande/,
    REkonachan = /konachan/,
    REdanbooru = /danbooru/;
var REyandeResult = REyande.test(originUrl);
var REkonachanResult = REkonachan.test(originUrl);
var REdanbooruResult = REdanbooru.test(originUrl);

function myselect(id) {
    var pitem;
    if(REdanbooruResult) {
        pitem = document.getElementById('post_'+id);
    } else {
        pitem = document.getElementById("p" + id);
    }
    var cb = pitem.firstElementChild.firstElementChild;
    cb.checked = !cb.checked;
    if (cb.checked) {
        pitem.classList.add('imgItemChecked');
    } else {
        pitem.classList.remove('imgItemChecked');
    }
    UpdateBatchCount();
}

function $$(id) {
    return !id ? null : document.querySelectorAll(id);
}

var pUrls = [];

var re = /\d\w+/,
    re2 = /([a-fA-F0-9]{32})/;

function pJson() {
    let pUrls = [];
    let checkedPics = $$('.imgItemChecked')
    for (let i = 0; i < checkedPics.length; i++) {
        let pic = checkedPics[i]
        var id = (re.exec(pic.attributes.onclick.nodeValue)[0]);
        var md5 = (re2.exec(pic.querySelectorAll('.directlink')[0].href)[0]);
        var largeFileUrl = pic.querySelectorAll('.directlink')[0].href
        pUrls.push({id, md5, largeFileUrl});
    }
    window.pUrls = pUrls
}

var directlinks = [];

function DanboorupJson() {
    let pUrls = [];
    var postsItems = posts.querySelectorAll('.imgItemChecked');
    for (let i = 0; i < postsItems.length; i++) {
        var id = postsItems[i].dataset.id;
        var md5 = postsItems[i].dataset.md5;
        var largeFileUrl = postsItems[i].dataset.largeFileUrl;
        var fileUrl = postsItems[i].dataset.fileUrl
        pUrls.push({id, md5, largeFileUrl, fileUrl});
    }
    window.pUrls = pUrls
}

function logDanbooruJson() {
    DanboorupJson();
    console.log(JSON.stringify(pUrls));
}

function logJson() {
    pJson();
    console.log(JSON.stringify(pUrls));
}

function SelectAll() {
    $$('.checkbox').forEach(function (checkbox) {
        checkbox.checked = true;
        checkbox.parentNode.parentNode.classList.add('imgItemChecked');
    });
    UpdateBatchCount();
    return false;
}

function DeselectAll() {
    $$('.checkbox').forEach(function (checkbox) {
        checkbox.checked = false;
        checkbox.parentNode.parentNode.classList.remove('imgItemChecked');
    });
    UpdateBatchCount();
    return false;
}

var batchCount = 0;

function UpdateBatchCount() {
    var checked = 0;
    $$('.checkbox').forEach(function (checkbox) {
        if (checkbox.checked) {
            ++checked;
        }
    });
    batchCount = checked;

    var ButtonSelectAll = document.getElementById('ButtonSelectAll');
    if (checked >= 1) {
        if (ButtonSelectAll) {
            ButtonSelectAll.innerHTML = "DeselectAll  " + batchCount + " items";
            ButtonSelectAll.onclick = DeselectAll;
        }
    }
    else {
        if (ButtonSelectAll) {
            ButtonSelectAll.innerHTML = "SelectAll  " + batchCount + " items";
            ButtonSelectAll.onclick = SelectAll;
        }
    }
    return false;
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}


// jpg 和 png 下载自动切换
function downloadImg(hostUrl,pUrls) {
    for (let i = 0; i < pUrls.length; i++) {
        var img_filename = pUrls[i].id + '.jpg';
        var img_src = hostUrl + pUrls[i].md5 + '.jpg';
        checkImg(img_src).then(status => {
            downloadURI(img_src, img_filename);
        }).catch(e => {
            console.log(`download jpg error: ${img_src}`)
            img_filename = pUrls[i].id + '.png';
            img_src = hostUrl + pUrls[i].md5 + '.png';
            checkImg(img_src).then(status => {
                downloadURI(img_src, img_filename);
            }).catch(e => {
                console.log(`download png error: ${img_src}`)
            })
        })
    }
}

// 检查图片是否存在
function checkImg(src) {
    console.log('checking img...')
    return new Promise((resolve, reject) => {
        var image = new Image;
        image.onload = function () {
            if ('naturalHeight' in this) {
                if (this.naturalHeight + this.naturalWidth === 0) {
                    this.onerror();
                    return;
                }
            } else if (this.width + this.height === 0) {
                this.onerror();
                return;
            }
            // success
            // document.body.appendChild(image);
            resolve('success')
        };
        // error
        image.onerror = function () {
            reject('error')
        };
        image.src = src;
    })
}
