//redirct user if already logged in
if (document.cookie.indexOf('authToken') != -1) {
  window.location = "/profile";
}

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

        if (response.isLogged) {
          window.location = '/profile'
        } else {
          $(".company-password").addClass("border border-danger");
          $(".password-error").html("Wrong Password !");
        }
      },
      error: (error) => {
        $(".before-send").addClass("d-none");
        $(".login-btn").removeClass("d-none");
        if (error.status == 404) {
          $(".username").addClass("border border-danger");
          $(".username-error").html("User not found !");
        } else if (error.status == 401) {
          $(".company-password").addClass("border border-danger");
          $(".password-error").html("Wrong Password !");
        } else {
          alert("Internal server error")
        }
      }
    });
  });
});


function resetValidator(field) {
  $(field).removeClass("border-danger");
  $(field + "-error").html("");
}