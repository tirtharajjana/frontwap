//requesting login modal
$(document).ready(() => {
    $("#request-login-modal").click((e) => {
        e.preventDefault();
        $("#signup-modal").modal('hide');
        $("#login-modal").modal('show');

    })
})
$(document).ready(() => {
    $("#request-signup-modal").click((e) => {
        e.preventDefault();
        $("#login-modal").modal('hide');
        $("#signup-modal").modal('show');


    })
})

//signup request

$(document).ready(() => {
    $("#signup-form").submit((e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "api/signup",
            data: new FormData(e.target),
            processData: false,
            contentType: false,
            success: (res) => {
                console.log(res);
            }
        })

    })
})