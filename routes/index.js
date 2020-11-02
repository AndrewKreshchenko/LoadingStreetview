var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('_pages/home', { title: 'Express', counter: 3 });
  // res.setLocale(req.cookies.i18n);
  // res.render('main', {
  //   i18n: res
  // })
});

module.exports = router;
