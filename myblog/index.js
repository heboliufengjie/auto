var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('hello, express 刘凤杰制学习作');
});

app.listen(3000);
