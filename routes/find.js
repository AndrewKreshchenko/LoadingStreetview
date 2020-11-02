var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.i18n.changeLanguage('uk'); // will not load that!!! assert it was preloaded
  console.log('User changing language: ', req.language);
  res.render('_pages/find', { title: 'Find', counter: 3 });
  // res.send('respond with a find');
});

module.exports = router;
