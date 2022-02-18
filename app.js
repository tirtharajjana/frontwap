const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
const multipart = multer().none();



const app = express();


const indexRoute = require('./routes/index.routes');
const signupRoute = require('./routes/signup.routes');
const companyRoute = require('./routes/company.routes');
const userRoute = require('./routes/user.routes');


const tokenService = require('./services/token.service')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multipart)
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRoute);
app.use('/api/signup', signupRoute);

app.use('/api/private/user', userRoute);

//implement api security
app.use((req, res, next) => {
  const token = tokenService.verifyToken(req);
  if (token.isVerified) {
    next();
  } else {
    res.status(401);
    res.json({ message: "permission denied" })
  }
})
app.use('/api/private/company', companyRoute);


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
