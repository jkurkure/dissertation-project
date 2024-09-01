var express = require('express');
var router = express.Router();
var axios = require('axios');

require('dotenv').config();

router.get ('/:name', async function(req, res, next) {
    res.render('texts_width', { title: 'St Andrews Corpus', currentURL:'/texts/' + req.params.name});
});

router.get  ('/:name/:colwidth', async function(req, res, next) {
    const textUrl = 'http://127.0.0.1:3000/corpus/texts/' + req.params.name;
    
     // Make a POST request to the 'api/trs' endpoint
     axios.post(process.env.REACT_APP_BACKEND_URL + 'api/trs', {
        'file-url': textUrl.replace(".xml", "Tr.txt").replace("texts", "resources"),
        'col-width': req.params.colwidth
    })
    .then(function(response) {
        res.render('texts', { title: 'St Andrews Corpus', currentURL:'/texts/' + req.params.name, data: response.data, textUrl: textUrl });
    })
    .catch(function(error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });

});
module.exports = router;