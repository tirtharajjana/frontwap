// admin layout control
$(document).ready(function () {
  $(".toggler").click(function () {
    const state = $(".sidenav").hasClass("sidenav-open");
    if (state) {
      $(".sidenav").removeClass("sidenav-open");
      $(".sidenav").addClass("sidenav-close");

      // section control
      $(".section").removeClass("section-open");
      $(".section").addClass("section-close");
    }
    else {
      $(".sidenav").removeClass("sidenav-close");
      $(".sidenav").addClass("sidenav-open");

      // section control
      $(".section").removeClass("section-close");
      $(".section").addClass("section-open");
    }
  });
});

$(document).ready(function () {
  count = 1;
  var x = setInterval(function () {
    if (document.cookie.indexOf("authToken") != -1) {
      count++;
      // console.log(count);
    }
    else {
      clearInterval(x);
      console.log("done");
    }
  }, 1000);
});
