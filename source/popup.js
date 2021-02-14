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
        console.warn('An error occured in async function: promise_current_ucs_numbers()', err);
    }
}

async function promise_ucs_info(ucs_id) {
    try {
        const response = await fetch(`http://www.piugame.com/bbs/board.php?bo_table=ucs&wr_id=${ucs_id}`);
        const html = await response.text();

        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let ucs_info = new Object();

        let table_step_info = doc.getElementsByClassName("step_info")[0];
        let table_step_info_td = table_step_info.getElementsByTagName("td");

        ucs_info['song_title'] = doc.getElementsByClassName('song_title')[0].innerText;
        ucs_info['song_artist'] = doc.getElementsByClassName('song_artist')[0].innerText;
        ucs_info['song_artist'] = ucs_info['song_artist'].substring(1, ucs_info['song_artist'].length-1);

        ucs_info['stepmaker'] = table_step_info_td[0].innerText.trim();
        ucs_info['step_id'] = table_step_info_td[1].innerText;
        ucs_info['upload'] = table_step_info_td[2].innerText;
        ucs_info['step_mode'] = table_step_info_td[3].innerText;
        ucs_info['players'] = table_step_info_td[4].innerText;
        ucs_info['step_level'] = table_step_info_td[6].innerText;

        return ucs_info;
    } catch (err) {
        console.warn('An error occured in async function: promise_ucs_info()', err);
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
            Array.from(document.getElementsByClassName("ucs-id-input")).forEach((input) => { if (input.value) custom_add_ucs(input.value); });
            custom_make_ucs_zip();
            alert("UCS Pack이 등록되었습니다.");
        });
    }
}

function init_document() {
    chrome.tabs.executeScript(null, { file: "jquery.js" });
    
    let ucs_input_list = document.getElementById("ucs-input-list");
    
    for (let i = 0; i < 10; i++) {
        let ucs_input_list_item = document.createElement("li");
        ucs_input_list.appendChild(ucs_input_list_item);

        let ucs_id_input = document.createElement("input");
        ucs_input_list_item.appendChild(ucs_id_input);

        ucs_id_input.setAttribute("class", "ucs-id-input w3-input w3-padding-small");
        ucs_id_input.setAttribute("type", "number");
        ucs_id_input.setAttribute("min", "1");

        ucs_id_input.oninput = (ev) => {

        }
    }

    let ucs_pack_build_button = document.getElementById("build-ucs-pack");
    ucs_pack_build_button.onclick = build_ucs_pack;
}

init_document();
