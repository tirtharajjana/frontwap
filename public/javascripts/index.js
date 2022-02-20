// requesting login modal
$(document).ready(() => {
  $("#request-login-modal").click((e) => {
    e.preventDefault();
    $("#signup-modal").modal('hide');
    $("#login-modal").modal('show');
  });
});

// requesting signup modal
$(document).ready(() => {
  $("#request-signup-modal").click((e) => {
    e.preventDefault();
    $("#login-modal").modal('hide');
    $("#signup-modal").modal('show');
  });
});

// signup request
$(document).ready(() => {
  $("#signup-form").submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/signup",
      data: new FormData(e.target),
      processData: false,
      contentType: false,
      beforeSend: () => {
        $(".before-send").removeClass("d-none");
        $(".signup-btn").addClass("d-none");
      },
      success: (response) => {
        $(".before-send").addClass("d-none");
        $(".signup-btn").removeClass("d-none");
        const data = JSON.parse(response.text);
        if (data.isCompanyCreated) {
          //redirect user to profile page
        } else {
          const field = "." + data.message.field;
          const message = data.message.label;

          $(field).addClass("border border-danger");
          $(field + "-error").html(message);
          setTimeout(() => {
            resetValidator(field);

          }, 3000);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  });
});

//login request
$(document).ready(() => {
  $("#login-form").submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/login",
      data: new FormData(e.target),
      processData: false,
      contentType: false,
      beforeSend: () => {
        $(".before-send").removeClass("d-none");
        $(".login-btn").addClass("d-none");
      },
      success: (response) => {

        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  });
});


function resetValidator(field) {
  $(field).removeClass("border-danger");
  $(field + "-error").html("");
}