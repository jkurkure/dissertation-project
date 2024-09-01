var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'PhilogEg', currentURL:'/kings/'});
});

module.exports = router;