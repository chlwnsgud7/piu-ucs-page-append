var params = function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}();

if (params.wr_id) {
    let ul_title_menu = document.getElementsByClassName("title_menu")[0];

    let li_title_menu_sub2 = document.createElement("li");
    li_title_menu_sub2.className = "title_menu_sub2";

    let addSlotButton = document.createElement("a");
    addSlotButton.href = "javascript:AddtoUCSSLOT(" + params.wr_id + ")";
    addSlotButton.innerHTML = "SLOT";

    li_title_menu_sub2.appendChild(addSlotButton);
    ul_title_menu.appendChild(li_title_menu_sub2);
}