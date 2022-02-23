const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require("multer");
const multipart = multer().none();


const app = express();

const indexRoute = require("./routes/index.routes");
const signupRoute = require("./routes/signup.routes");
const loginRoute = require("./routes/login.routes");
const userRoute = require("./routes/user.routes");
const companyRoute = require("./routes/company.routes");
const tokenService = require("./services/token.service");
const profileRoute = require("./routes/profile.routes");
const logoutRoute = require("./routes/logout.routes");
const clientsRoute = require("./routes/clients.routes");
const authController = require("./controller/auth.controller");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multipart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", indexRoute);
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);




// implementing api security

app.use((request, response, next) => {
  const token = tokenService.verifyToken(request);
  if (token.isVerified) {
    // user is valid
    next();
  }
  else {
    response.clearCookie("authToken");
    response.status(401); // token not verified
    response.redirect("/");
  }
});

const autoLogger = () => {
  return async (request, response, next) => {
    const isLogged = await authController.checkUserLog(request, response);
    if (isLogged) {
      next();
    }
    else {
      // not authenticated
      response.clearCookie("authToken");
      response.redirect("/");
    }
  }
}

app.use("/api/private/company", companyRoute);
app.use("/api/private/user", userRoute);
app.use("/logout", logoutRoute);
app.use("/clients", clientsRoute);
app.use("/profile", autoLogger(), profileRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
