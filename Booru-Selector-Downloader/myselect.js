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

function $$(id) {
    return !id ? null : document.querySelectorAll(id);
}

function download() {
    var pUrls = [];
    var re = /\d\w+/;
    var re2 = /([a-fA-F0-9]{32})/;
    for (var i = 0; i < $$('.imgItemChecked').length; i++) {
        var id = (re.exec($$('.imgItemChecked')[i].attributes.onclick.nodeValue)[0]);
        var md5 = (re2.exec($$('.imgItemChecked')[i].querySelectorAll('.directlink, .largeimg')[0].href)[0]);
        pUrls.push({"id": id, "md5": md5});
    }
    console.log(JSON.stringify(pUrls));
    downloadImg(pUrls);
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
    if (checked > 1) {
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

function downloadImg(pUrls) {
    for (var i = 0; i < pUrls.length; ++i) {
        var img_filename = pUrls[i].id + '.jpg';
        var img_src = 'https://files.yande.re/sample/' + pUrls[i].md5 + '/' + pUrls[i].id + '.jpg';
        downloadURI(img_src, img_filename);
    }
}