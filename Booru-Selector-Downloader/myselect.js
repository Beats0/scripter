function myselect(id) {
    var pitem = document.getElementById("p" + id);
    var cb = pitem.firstElementChild.firstElementChild;
    cb.checked = !cb.checked;
    if (cb.checked) {
        pitem.classList.add('imgItemChecked');
    } else {
        pitem.classList.remove('imgItemChecked');
    }
    UpdateBatchCount();
}

function Danboorumyselect(id) {
    var pitem = document.getElementById('post_'+id);
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

function pJson() {
    try {
        pUrls = [];
        var re = /\d\w+/;
        var re2 = /([a-fA-F0-9]{32})/;
        for (var i = 0; i < $$('.imgItemChecked').length; i++) {
            var id = (re.exec($$('.imgItemChecked')[i].attributes.onclick.nodeValue)[0]);
            var md5 = (re2.exec($$('.imgItemChecked')[i].querySelectorAll('.directlink, .largeimg')[0].href)[0]);
            pUrls.push({"id": id, "md5": md5});
        }
        return pUrls;
    } catch (e) {
        console.error(e)
    }
}
function DanboorupJson() {
    try {
        pUrls = [];
        var posts = document.getElementById('posts');
        var postsItems = posts.querySelectorAll('.imgItemChecked');
        for (var i = 0; i < postsItems.length; i++) {
            var id = postsItems[i].dataset.id;
            var md5 = postsItems[i].dataset.md5;
            pUrls.push({"id": id, "md5": md5});
        }
        return pUrls;
    } catch (e) {
        console.error(e)
    }
}
function logDanbooruJson() {
    DanboorupJson();
    console.log(JSON.stringify(pUrls));
}

function logJson() {
    pJson();
    console.log(JSON.stringify(pUrls));
}

var Yande = {
    sample: function () {
        downloadImg('https://files.yande.re/sample/', pUrls, '.jpg');
    },
    larger: function () {
        downloadImg('https://files.yande.re/jpeg/', pUrls, '.jpg');
    },
    original: function () {
        downloadImg('https://files.yande.re/image/', pUrls, '.png');
    }
};
Yande.sample();

var Konachan = {
    image: function () {
        downloadImg('https://konachan.com/image/', pUrls, '.jpg');
    },
    original: function () {
        downloadImg('https://konachan.com/image/', pUrls, '.png');
    }
};

var Danbooru = {
    original: function () {
        downloadDanbooruImg('http://danbooru.donmai.us/data/', pUrls, '.jpg');
        downloadDanbooruImg('http://danbooru.donmai.us/data/', pUrls, '.png');
    }
};

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

function downloadImg(hostUrl, pUrls, fileName) {
    for (var i = 0; i < pUrls.length; i++) {
        var img_filename = pUrls[i].id + '.jpg';
        var img_src = hostUrl + pUrls[i].md5 + '/' + pUrls[i].id + fileName;
        downloadURI(img_src, img_filename);
    }
}
function downloadDanbooruImg(hostUrl,pUrls,fileName) {
    for (var i = 0; i < pUrls.length; i++) {
        var img_filename = pUrls[i].id + '.jpg';
        var img_src = hostUrl + pUrls[i].md5 + fileName;
        downloadURI(img_src, img_filename);
    }
}