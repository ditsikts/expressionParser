var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('static'));

app.get('/editor', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/edit.html'));
});

app.get('/elements', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/elem.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.listen(8080);