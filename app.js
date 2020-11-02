var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const uikit = require('uikit');

/**
 * Set routes
 */

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const findRouter = require('./routes/find');

const app = express();

const i18next = require('i18next');
// const i18nextMiddleware = require('i18next-express-middleware');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-node-fs-backend');

// var lngDetector = new middleware.LanguageDetector()
// lngDetector.addDetector(myDetector)

// i18next.use(lngDetector).init({
//   detection: options
// })

// process.title = process.argv[2];


/**
 * Provide localization
 */

var i18n_opts = {
  backend: {
    loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
  },
  fallbackLng: ['uk'],
  preload: ['en', 'uk'],
  detection: {
    order: [/*'path', 'session', */ 'querystring', 'cookie', 'header'],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupHeader: 'accept-language',
    // lookupHeaderRegex: /(([a-z]{2})-?([A-Z]{2})?)\s*;?\s*(q=([0-9.]+))?/gi,
    lookupSession: 'lng',
    lookupPath: 'lng',
    lookupFromPathIndex: 0,

    // cache user language
    caches: ['cookie'], // false
    ignoreCase: true, // ignore case of detected language
  }
};

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(i18n_opts);

app.use(i18nextMiddleware.handle(i18next));


// TEST START
app.use('/uk', function(req, res) {
  var lng = req.language // 'de-CH'
  // if (i18next.language == 'uk') return;
  req.i18n.changeLanguage('uk') // will not load that!!! assert it was preloaded

  console.log(lng, ' ex');
  console.log('Lang button pressed!', i18next.language);
  res.render('_pages/home', { title: 'Express', counter: 3 });
});
app.use('/en', function(req, res) {
  var lng = req.language // 'de-CH'
  if (i18next.language == 'en') return;

  req.i18n.changeLanguage('en')
  console.log('Lang button pressed!', lng, i18next.language);
  res.redirect('/');
});
app.post('/lang', function(req, res) {
  req.i18n.changeLanguage('uk')
  console.log('User changing language !', req.language, i18next.language, ' TEST ', req.i18n);
});
// TEST END


/**
 * Configure public directory
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


/**
 * Mount middlewares
 */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', indexRouter);
// app.use('/users', usersRouter);
app.use('/find', findRouter);

// app.use((req, res, next) => {
//   console.log('req.language', req.language);
//   //i18next.changeLanguage(req.language);
// });


/**
 * Error handlers
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
