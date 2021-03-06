var express = require('express');
var path    = require("path");
var app     = express();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var port    = process.env.PORT || 8080;

var ts      = require("./api/timestamp"); //timestamp
var rhp     = require("./api/requestheaderparser"); //request header parser
var shortUrl= require("./api/urlshortener");
var img     = require("./api/imgsearch");

app.use(express.static(path.join(__dirname, 'startbootstrap-creative')));

app.post('/file', upload.single('yolo'), function(req, res, next) {
   res.json({size: req.file.size});
});

app.get('/api/whoami', function(req,res){
    res.json(rhp.rhp(req.headers));  
});



app.get('/api/:date', function (req, res) {
    res.json(ts.timestamp(req.params.date));
});



app.get('/new/:url(*)', function(req, res) {
    shortUrl.getsUrl(req,res);
});

app.get('/:short', function(req, res) {
    shortUrl.redirectShort(req,res);
});

app.get('/api/latest/imagesearch', function(req, res) {
    img.history(req,res);
});

app.get('/api/imagesearch/:query',function(req, res) {
    img.search(req,res);
});


app.get('*', function(req, res) {
    res.send("Invalid page");
});

app.listen(port, function () {
  console.log('Example app listening on port!', port);
});