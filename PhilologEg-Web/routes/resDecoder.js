const express = require('express');
const multer = require('multer');
var router = express.Router();

const app = express();
const upload = multer();

app.post('/', upload.array(), function (req, res, next) {
  res.json(req.body);
});

module.exports = router;