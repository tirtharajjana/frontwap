//get country phone codes

$(document).ready(function () {
    $("#country").on("input", async function () {
        let keyword = $(this).val().trim().toLowerCase();
        const localData = checkInLs("countryCode");


        if (localData.isExist == true) {
            const countries = localData.data;
            console.log(countries);

            for (const country of countries) {
                if (country.name.toLowerCase().indexOf(keyword) != -1) {
                    let dialCode = country.dial_code;
                    $("#code").html(dialCode)
                }
            }
        } else {
            const req = {
                type: 'GET',
                url: "../json/country-code.json",

            }
            const res = await ajax(req);
            // console.log(res);
            const countryData = JSON.stringify(res);
            localStorage.setItem("countryCode", countryData)
        }


    })
})

function checkInLs(key) {
    if (localStorage.getItem(key) != null) {
        let tmp = localStorage.getItem(key);
        const data = JSON.parse(tmp);
        return { isExist: true, data }
    } else {

        return { isExist: false }

    }
}


function ajax(req) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: req.type,
            url: req.url,
            success: function (res) {
                resolve(res);
            },
            error: function (error) {
                reject(error)
            }
        })
    })

}