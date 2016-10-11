var express = require('express');
var path    = require("path");
var mongodb = require("mongodb").MongoClient; //required("mongodb").MongoClient
var shortid = require('shortid');
var validUrl= require('valid-url');
var mlab    = process.env.MONGOLAB_URI;
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

app.get('/new/:url(*)', function(req, res) {
    mongodb.connect(mlab,function(err, db){
        if(err) {
            console.log("Unable to connect to server", err);
        } else {
            console.log("Connected to server");
            var collection = db.collection("links");
            var params     = req.params.url;
            var host       = req.get("host");
            var newLink    = function (db, callback){
                collection.findOne({
                    url: params
                }, {
                    short: 1,
                    _id: 0
                },function(err,doc){
                    if(err) throw err;
                    if(doc != null){
                        res.json({ original_url: params, short_url: host +"/"+ doc.short });
                    } else {
                        if(validUrl.isUri(params)){
                            var shortCode =  shortid.generate();
                            var newUrl    = {url: params, short:shortCode};
                            collection.insert([newUrl]);
                            res.json({original_url: params, short_url: host +"/"+ shortCode});
                        } else {
                            res.json({error: "Wrong url format, make sure you have a valid protocol and real site."});
                        }
                    }
                });  
            }
        }
        newLink(db, function(){
            db.close();
        });
        
    });
});

app.get('/:short', function(req, res) {
    mongodb.connect(mlab, function(err, db){
        if(err) {throw err;}
        else{
            var collection = db.collection("links");
            var params = req.params.short;
            var findLink = function(db, callback){
                collection.findOne({
                    short: params
                }, {
                    url: 1,
                    _id: 0
                }, function(err, doc){
                    if(err) 
                        throw err;
                    if(doc != null) 
                        res.redirect(doc.url);
                    else 
                        res.json({ error: "No corresponding shortlink found in the database." });
                })
            }
        }
        findLink(db, function(){
            db.close();
        })
    });
});

app.get('*', function(req, res) {
    res.send("Invalid page");
});

app.listen(port, function () {
  console.log('Example app listening on port!', port);
});