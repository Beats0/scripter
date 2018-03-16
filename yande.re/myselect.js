var pUrls = [];
function myselect(id) {
    var pitem = document.getElementById("p" + id);
    // cb = document.getElementById("cb"+id);
    var cb = pitem.firstElementChild.firstElementChild;
    cb.checked = !cb.checked;
    if (cb.checked) {
        pitem.classList.add('imgItemChecked');
        pUrls.push(id);
    } else {
        pitem.classList.remove('imgItemChecked');
        pUrls.pop(id);
    }
    console.log(pUrls);
    BatchCount();
    checkboxMode(id)
}

function checkboxMode(id) {

}

var batchCount = 0;
var batchCountArr = [];

function BatchCount() {
    var checked = 0;
    $$('.checkbox').forEach(function (checkbox) {
        if (checkbox.checked) {
            ++checked;
        }
    });
    batchCount = checked;
}
function $$(id) {
    return !id ? null : document.querySelectorAll(id);
}