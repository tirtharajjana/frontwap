// get country phone codes
$(document).ready(function () {
    $("#country").on("input", async function () {
        let keyword = $(this).val().trim().toLowerCase();
        const localData = checkInLs("countryCode");
        if (localData.isExist) {
            const countries = localData.data;
            for (let country of countries) {
                if (country.name.toLowerCase().indexOf(keyword) != -1) {
                    let dialCode = country.dial_code;
                    $("#code").html(dialCode);
                }
            }
        }
        else {
            const request = {
                type: "GET",
                url: "../json/country-code.json"
            }
            const response = await ajax(request);
            const countryData = JSON.stringify(response);
            localStorage.setItem("countryCode", countryData);
        }
    });
});

// add client
$(document).ready(function () {
    $("#addClientForm").submit(async function (e) {
        e.preventDefault();
        const token = getCookie("authToken");
        const formdata = new FormData(this);
        formdata.append("token", token);

        const request = {
            type: "POST",
            url: "/clients",
            data: formdata,
            isLoader: true,
            commonBtn: ".add-client-submit",
            loaderBtn: ".add-client-loader"
        }
        try {
            await ajax(request);
            $("#clientModal").modal('hide');
        }
        catch (error) {
            $("#addClientEmail").addClass("animate__animated animate__shakeX text-danger");
            $("#addClientEmail").click(function () {
                $(this).removeClass("animate__animated animate__shakeX text-danger");
                $(this).val("");
            });
        }
    });
});

//show clients
$(document).ready(function () {
    let from = 0;
    let to = 5;
    showClients(from, to);
})

async function showClients(from, to) {
    const request = {
        type: 'GET',
        url: `/clients/${from}/${to}`,
        isLoader: true,
        commonBtn: ".tmp",
        loaderBtn: ".clients-skeleton"
    }
    const response = await ajax(request);
    console.log(response);
    if (response.data.length > 0) {
        for (const client of response.data) {
            const tr = `
            <tr class="animate__animated animate__fadeIn" >
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fa fa-user-circle mr-3" style="font-size:45px" ></i>
                        <div>
                            <p class="p-0 m-0 text-capitilaize" >${client.clientName}</p>
                            <small class="text-uppercase" >${client.clientCountry}</small>
                        </div>
                    </div>
                </td>
                <td>
                    ${client.clientEmail}
                </td>
                <td>
                    ${client.clientMobile}
                </td>
                <td>
                    <span class="badge badge-danger" >Offline</span>
                </td>
                <td>
                    ${client.updatedAt}
                </td>
                <td>
                    <div class="d-flex" >
                        <button class="icon-btn-primary mr-3 edit-client    " data-id="${client._id}" >
                            <i class="fa fa-edit" ></i>
                        </button>
                        
                        <button class="icon-btn-danger mr-3 delete-client"  data-id="${client._id}">
                            <i class="fa fa-trash" ></i>
                        </button>
                        
                        <button class="icon-btn-info share-client " data-id="${client._id}">
                            <i class="fa fa-share-alt" ></i>
                        </button>
                    </div>
                </td>
            </tr>
            `;
            $("table").append(tr);
        }
        clientAction()
    } else {
        alert("Data not found")
    }
}

function clientAction() {
    //delete clients
    $(document).ready(function () {
        $(".delete-client").each(function () {
            $(this).click(function () {
                const id = $(this).data("id");
                alert(id)
            })
        })
    })
}

function checkInLs(key) {
    if (localStorage.getItem(key) != null) {
        let tmp = localStorage.getItem(key);
        const data = JSON.parse(tmp);
        return {
            isExist: true,
            data: data
        }
    }
    else {
        return {
            isExist: false
        }
    }

}

function ajax(request) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: request.type,
            url: request.url,
            data: request.type == "GET" ? {} : request.data,
            processData: request.type == "GET" ? true : false,
            contentType: request.type == "GET" ? "application/json" : false,
            beforeSend: function () {
                if (request.isLoader) {
                    $(request.commonBtn).addClass("d-none");
                    $(request.loaderBtn).removeClass("d-none");
                }
            },
            success: function (response) {
                if (request.isLoader) {
                    $(request.commonBtn).removeClass("d-none");
                    $(request.loaderBtn).addClass("d-none");
                }
                resolve(response);
            },
            error: function (error) {
                if (request.isLoader) {
                    $(request.commonBtn).removeClass("d-none");
                    $(request.loaderBtn).addClass("d-none");
                }
                reject(error);
            }
        });
    });

}

function getCookie(cookieName) {
    const allCookie = document.cookie;
    let cookies = allCookie.split(";");
    let cookieValue = "";
    for (let cookie of cookies) {
        let currentCookie = cookie.split("=");
        if (currentCookie[0] == cookieName) {
            cookieValue = currentCookie[1];
            break;
        }
    }
    return cookieValue;
}
