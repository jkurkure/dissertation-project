var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    const imageUrl = 'https://raw.githubusercontent.com/jkurkure/jkurkure.github.io/develop/corpus/corpus.xml';
    req.pipe(request(imageUrl)).pipe(res);
});

module.exports = router;