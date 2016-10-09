var express = require('express');
var path    = require("path");
var app     = express();
var port    = process.env.PORT || 8080;

var ts      = require("./api/timestamp"); //timestamp
var rhp     = require("./api/requestheaderparser"); //request header parser

app.use(express.static(path.join(__dirname, 'startbootstrap-creative')));

app.get('/api/whoami', function(req,res){
    res.json(rhp.rhp(req.headers));  
});

app.get('/api/:date', function (req, res) {
    res.json(ts.timestamp(req.params.date));
});

app.get('/new/:url', function(req, res) {
    
})

app.get('*', function(req, res) {
    res.send("Invalid page");
})

app.listen(port, function () {
  console.log('Example app listening on port!');
});