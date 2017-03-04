const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// mongodb connection
mongoose.connect('mongodb://localhost:27017/blog');
const db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// user sessions for tracking logins
app.use(session({
	secret: 'hello from on-site',
  resave: true,
  saveUnitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'));

// view engine setup
// sets up Pug template engine so we don't have to use HTML
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
const router = require('./routes/index');
app.use('/', router);

// catch 404 errors and forward to error handlers
app.use((req, res, next) => {
  const err = new Error("File not found!");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback function
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, () => console.log('Express app listening on port 3000'));
