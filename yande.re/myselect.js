function myselect(id, md5) {
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

function logJson() {
    var pUrls = [];
    var re = /\d\w+/;
    var re2 = /([a-fA-F0-9]{32})/;
    for (var i = 0; i < $$('.imgItemChecked').length; i++) {
        var id = (re.exec($$('.imgItemChecked')[i].attributes.onclick.nodeValue)[0]);
        var md5 = (re2.exec($$('.imgItemChecked')[i].querySelectorAll('.directlink, .largeimg')[0].href)[0]);
        pUrls.push({"id": id, "md5": md5});
    }
    console.log(JSON.stringify(pUrls))
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
    console.log(batchCount);

    var ButtonSelectAll = document.getElementById('ButtonSelectAll');
    console.log(ButtonSelectAll);
    if (checked > 1) {
        if (ButtonSelectAll) {
            ButtonSelectAll.innerHTML = "DeselectAll  " + batchCount;
            ButtonSelectAll.onclick = DeselectAll;
        }
    }
    else {
        if (ButtonSelectAll) {
            ButtonSelectAll.innerHTML = "SelectAll  " + batchCount;
            ButtonSelectAll.onclick = SelectAll;
        }
    }
}
