const MYUCS_PAGE = "http://www.piugame.com/piu.ucs/ucs.my_ucs/ucs.my_upload.php";

async function promise_current_ucs_numbers() {
    try {
        const response = await fetch(MYUCS_PAGE);
        const html = await response.text();

        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let ucs_numbers = Array();
        Array.from(doc.getElementsByClassName("ucs_slot_delete")).forEach(
            (ucs_button) => { ucs_numbers.push(ucs_button.attributes['data-ucs_no'].value); }
        );

        return ucs_numbers;
    } catch (err) {
        console.warn('An Error Occured.', err);
    }
}

function custom_add_ucs(ucs_id) {
    chrome.tabs.executeScript({
        code: `$.ajax({
            type: "GET",
            url: "/piu.ucs/ucs.share/ucs.share.ajax.php",
            data: {
                "ucs_id": ${ucs_id},
                "work_type": "AddtoUCSSLOT"
            },
            cache: false,
            async: false
        });`
    });
}

function custom_delete_ucs(ucs_id) {
    chrome.tabs.executeScript({
        code: `$.ajax({
            type: "GET",
            url: "/piu.ucs/ucs.share/ucs.share.ajax.php",
            data: {
                "data_no": ${ucs_id},
                "work_type": "RemovetoUCSSLOT2"
            },
            cache: false,
            async: false
        });`
    });
}

function custom_make_ucs_zip() {
    chrome.tabs.executeScript({
        code: `$.ajax({
            type: "GET",
            url: "/piu.ucs/ucs.share/ucs.share.ajax.php",
            data: {
                "work_type": "MakeUCSPack"
            },
            cache: false,
            async: false
        });`
    });
}

function build_ucs_pack() {
    if (confirm("UCS 팩을 빌드하시겠습니까? 원래 등록되어있던 UCS는 모두 삭제됩니다.")) {
        promise_current_ucs_numbers().then((ucs_numbers) => {
            ucs_numbers.forEach((ucs_id) => { custom_delete_ucs(ucs_id) });
            Array.from(document.getElementsByClassName("ucs_id_input")).forEach((input) => { if (input.value) custom_add_ucs(input.value); });
            custom_make_ucs_zip();
            Array.from(document.getElementsByClassName("ucs_id_input")).forEach((input) => { input.value = ""; });
            alert("UCS Pack이 등록되었습니다.");
        });
    }
}

function init_document() {
    chrome.tabs.executeScript(null, { file: "jquery.js" });
    
    let current_ucs_div = document.getElementById("current-ucs");
    let ucs_id_inputs = Array(10);

    for (let i = 0; i < 10; i++) {
        ucs_id_inputs[i] = document.createElement("input");
        current_ucs_div.appendChild(ucs_id_inputs[i]);
        current_ucs_div.appendChild( document.createElement("br") );

        ucs_id_inputs[i].setAttribute("class", "ucs_id_input");
        ucs_id_inputs[i].setAttribute("type", "number");
        ucs_id_inputs[i].setAttribute("min", "1");
    }

    let ucs_pack_build_button = document.getElementById("build-ucs-pack");
    ucs_pack_build_button.onclick = build_ucs_pack;
}

init_document();