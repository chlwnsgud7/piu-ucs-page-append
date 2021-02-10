console.log("popup.js start");

const MYUCS_PAGE = "http://www.piugame.com/piu.ucs/ucs.my_ucs/ucs.my_upload.php";

fetch(MYUCS_PAGE).then(function(response) {
    return response.text();
}).then(function (html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');

    for (const myucs in doc.getElementsByClassName("ucs_slot_delete")) {
        console.log(myucs.attributes['data-ucs_no'].value);
    }
}).catch(function (err) {
    console.warn('Sonething went wrong.', err);
})