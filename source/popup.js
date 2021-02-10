const MYUCS_PAGE = "http://www.piugame.com/piu.ucs/ucs.my_ucs/ucs.my_upload.php";

function promise_current_ucs_numbers() {
    return new Promise( )


    fetch(MYUCS_PAGE).then((response) => {
        return response.text();
    }).then((html) => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        Array.from(doc.getElementsByClassName("ucs_slot_delete")).forEach(
            (ucs_button) => { ucs_numbers.push(ucs_button.attributes['data-ucs_no'].value); }
        );
    }).catch((err) => {
        console.warn('An Error Occured.', err);
    });

    return ucs_numbers;
}

function custom_add_ucs(ucs_id) {
    $.ajax({
        type: "GET",
        url: "/piu.ucs/ucs.share/ucs.share.ajax.php",
        data: {
            "ucs_id": ucs_id,
            "work_type": "AddtoUCSSLOT"
        },
        cache: false,
        async: false
    });
}

function custom_delete_ucs(ucs_id) {
    $.ajax({
        type: "GET",
        url: "/piu.ucs/ucs.share/ucs.share.ajax.php",
        data: {
            "data_no": ucs_id,
            "work_type": "RemovetoUCSSLOT2"
        },
        cache: false,
        async: false
    });
}

function custom_make_ucs_zip() {
    $.ajax({
        type: "GET",
        url: "/piu.ucs/ucs.share/ucs.share.ajax.php",
        data: {
            "work_type": "MakeUCSPack"
        },
        cache: false,
        async: false
    });
}

function init_document() {
    let current_ucs_div = document.getElementById("current-ucs");
    let ucs_id_inputs = Array(10);    
    let current_ucs_numbers = get_current_ucs_numbers();
    let len = current_ucs_numbers.length;
    console.log(len);

    for (let i = 0; i < 10; i++) {
        ucs_id_inputs[i] = document.createElement("input");

        ucs_id_inputs[i].setAttribute("class", "ucs_id_input");
        ucs_id_inputs[i].setAttribute("type", "number");
        ucs_id_inputs[i].setAttribute("min", "1");
        if (i < len) ucs_id_inputs[i].setAttribute("value", current_ucs_numbers[i]);

        current_ucs_div.appendChild(ucs_id_inputs[i]);
    }
}

init_document();