var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('static'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.listen(8080);