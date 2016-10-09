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
    function validURL(str) {
        var expression = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/gi;
        var regex = new RegExp(expression);
        return str.match(regex);
    }
    var url = req.params.url;
    var response = {};
    console.log(validURL(url));
    if(validURL(url) == null){
        response.error = "Wrong url format, make sure you have a valid protocol and real site.";
        res.json(response);
    }
    else {
        response['original_url'] = url;
        res.json(response);
    }
    //res.redirect('http://google.com');
});

app.get('*', function(req, res) {
    res.send("Invalid page");
})

app.listen(port, function () {
  console.log('Example app listening on port!');
});