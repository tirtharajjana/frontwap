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

// open modal
$(document).ready(function () {
    $("#add-client-btn").click(function () {
        $("#clientForm").addClass("add-client-form");
        $("#clientForm").removeClass("update-client-form");
        $(".add-client-submit").html("Submit");
        $(".add-client-submit").removeClass("btn-danger px-3");
        $(".add-client-submit").addClass("btn-primary");
        $("#clientModal").modal('show');
        addClient();
    });
});

// add client
function addClient() {
    $(".add-client-form").submit(async function (e) {
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
            const dataRes = await ajax(request);
            const client = dataRes.data;
            $("#clientModal").modal('hide');
            const tr = dynamicTr(client);
            $("table").append(tr);
            // activate edit delete or share
            clientAction();
        }
        catch (error) {
            $("#addClientEmail").addClass("animate__animated animate__shakeX text-danger");
            $("#addClientEmail").click(function () {
                $(this).removeClass("animate__animated animate__shakeX text-danger");
                $(this).val("");
            });
        }
    });
};

// update client
function updateClient(oldTr) {
    $(".update-client-form").submit(async function (e) {
        e.preventDefault();
        const id = $(this).data("id");
        const token = getCookie("authToken");
        const formdata = new FormData(this);
        formdata.append("token", token);
        formdata.append("updatedAt", new Date());
        const request = {
            type: "PUT",
            url: "/clients/" + id,
            isLoader: true,
            commonBtn: ".add-client-submit",
            loaderBtn: ".add-client-loader",
            data: formdata
        }
        const response = await ajax(request);
        const client = response.data;
        const tr = dynamicTr(client);
        const updatedTd = $(tr).html();
        $(oldTr).html(updatedTd);
        $("#clientModal").modal('hide');
        clientAction();
    });
};

// show clients
$(document).ready(function () {
    let from = 0;
    let to = 5;
    showClients(from, to);
    getPaginationList();
});

async function showClients(from, to) {
    $("table").html(`
      <tr>
        <th>Client</th>
        <th>Email</th>
        <th>Mobile</th>
        <th>Status</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    `);
    const request = {
        type: "GET",
        url: `/clients/${from}/${to}`,
        isLoader: true,
        commonBtn: ".tmp",
        loaderBtn: ".clients-skeleton"
    }
    const response = await ajax(request);
    console.log(response);
    if (response.data.length > 0) {
        for (let client of response.data) {
            const tr = dynamicTr(client);
            $("table").append(tr);
        }
        clientAction();
    }
    else {
        alert("client not found");
    }
}

function clientAction() {
    // delete clients
    $(document).ready(function () {
        $(".delete-client").each(function () {
            $(this).click(async function () {
                let tr = this.parentElement.parentElement.parentElement;//div->td->tr
                const id = $(this).data("id");
                const token = getCookie("authToken");
                const request = {
                    type: "DELETE",
                    url: "/clients/" + id,
                    data: {
                        token: token
                    }
                }

                const response = await ajax(request);
                $(tr).removeClass("animate__animated animate__fadeIn");
                $(tr).addClass("animate__animated animate__fadeOut");
                setTimeout(function () {
                    $(tr).remove();
                }, 500)
            });
        });
    });

    // edit clients
    $(document).ready(function () {
        $(".edit-client").each(function () {
            $(this).click(function () {
                let tr = this.parentElement.parentElement.parentElement;
                const id = $(this).data("id");
                const clientString = $(this).data("client");
                let clientData = clientString.replace(/'/g, '"');
                let client = JSON.parse(clientData);
                for (let key in client) {
                    let value = client[key];
                    $(`[name=${key}]`, "#clientForm").val(value);
                }
                $("#clientForm").attr("data-id", id);
                $("#clientForm").removeClass("add-client-form");
                $("#clientForm").addClass("update-client-form");
                $(".add-client-submit").html("Save");
                $(".add-client-submit").removeClass("btn-primary");
                $(".add-client-submit").addClass("btn-danger px-3");
                $("#clientModal").modal('show');
                updateClient(tr);
            });
        });
    });
}

function dynamicTr(client) {
    let clientString = JSON.stringify(client);
    let clientData = clientString.replace(/"/g, "'");

    const tr = `
      <tr class="animate__animated animate__fadeIn">
        <td>
          <div class="d-flex align-items-center">
            <i class="fa fa-user-circle mr-3" style="font-size:45px"></i>
            <div>
              <p class="p-0 m-0 text-capitalize">${client.clientName}</p>
              <small class="text-uppercase">${client.clientCountry}</small>
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
          <span class="badge badge-danger">Offline</span>
        </td>
        <td>
          ${formatDate(client.createdAt)}
        </td>
        <td>
          <div class="d-flex">
            <button class="icon-btn-primary mr-3 edit-client" data-id="${client._id}" data-client="${clientData}">
              <i class="fa fa-edit"></i>
            </button>
  
            <button class="icon-btn-danger mr-3 delete-client" data-id="${client._id}">
              <i class="fa fa-trash"></i>
            </button>
  
            <button class="icon-btn-info share-client" data-id="${client._id}">
              <i class="fa fa-share-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    return tr;
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
        let options = {
            type: request.type,
            url: request.url,
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
        }

        if (request.type == "POST" || request.type == "PUT") {
            options['data'] = request.data;
            options['processData'] = false;
            options['contentType'] = false;
        }

        if (request.type == "DELETE") {
            options['data'] = request.data;
        }

        $.ajax(options);
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

function formatDate(dateString) {
    const date = new Date(dateString);
    let dd = date.getDate();
    // insert 0 before date
    if (dd < 10) {
        dd = '0' + dd;
    }
    let mm = date.getMonth() + 1;
    // insert 0 before month
    if (mm < 10) {
        mm = '0' + mm;
    }
    const yy = date.getFullYear();
    // get time
    const time = date.toLocaleTimeString();
    return dd + "-" + mm + "-" + yy + " " + time;
}

async function getPaginationList() {
    const request = {
        type: "GET",
        url: "/clients/count-all"
    }
    const response = await ajax(request);
    const totalClient = response.data;
    let length = totalClient / 5;
    let dataSkip = 0;
    let i;
    if (length.toString().indexOf(".") != -1) {
        length = length + 1;
    }
    for (i = 1; i <= length; i++) {
        let button = `
        <button class="btn border paginate-btn ${i == 1 ? 'active' : ''}" data-skip="${dataSkip}">
            ${i}
        </button>
        `;
        $("#client-pagination").append(button);
        dataSkip = dataSkip + 5;
    }
    getPaginationData();

}

function getPaginationData() {
    $(".paginate-btn").each(function (index) {
        $(this).click(function () {
            controlPrevAndNext(index);
            removeClasses("active");
            $(this).addClass("active");
            const skip = $(this).data("skip");
            showClients(skip, 5);
        });
    });
}

function removeClasses(className) {
    $("." + className).each(function () {
        $(this).removeClass(className);
    });
}

$(document).ready(function () {
    $("#next").click(function () {
        let currentIndex = 0;
        $(".paginate-btn").each(function () {
            if ($(this).hasClass("active")) {
                currentIndex = $(this).index();
            }
        });
        $(".paginate-btn").eq(currentIndex + 1).click();
        controlPrevAndNext(currentIndex + 1);
    });
});

$(document).ready(function () {
    $("#prev").click(function () {
        let currentIndex = 0;
        $(".paginate-btn").each(function () {
            if ($(this).hasClass("active")) {
                currentIndex = $(this).index();
            }
        });
        $(".paginate-btn").eq(currentIndex - 1).click();
        controlPrevAndNext(currentIndex - 1);
    });
});

function controlPrevAndNext(currentIndex) {
    const totalBtn = $(".paginate-btn").length - 1;
    if (currentIndex == totalBtn) {
        $("#next").prop("disabled", true);
    }
    else if (currentIndex > 0) {
        $("#prev").prop("disabled", false);
    }
    else {
        $("#prev").prop("disabled", true);
        $("#next").prop("disabled", false);
    }
}
