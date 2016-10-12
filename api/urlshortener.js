var mongodb = require("mongodb").MongoClient; //required("mongodb").MongoClient
var shortid = require('shortid');
var validUrl= require('valid-url');
var url    = process.env.MONGOLAB_URI || "mongodb://" + process.env.IP + ":27017/url-shortener-huytr";

exports.getsUrl = function(req, res){
    mongodb.connect(url,function(err, db){
        if(err) throw err;
        var collection = db.collection("links");
        var params     = req.params.url;
        var host       = req.get("host");
        
        collection.find({
            url: params
        }, {
            short: 1,
            _id: 0
        }).toArray(function(err,doc){
            if(err) throw err;
            if(doc != null){
                res.json({ original_url: params, short_url: "https://" + host +"/"+ doc.short });
            } else {
                if(validUrl.isUri(params)){
                    var shortCode =  shortid.generate();
                    var newUrl    = {url: params, short:shortCode};
                    collection.insert([newUrl]);
                    res.json({original_url: params, short_url: "https://" + host +"/"+ shortCode});
                } else {
                    res.json({error: "Wrong url format, make sure you have a valid protocol and real site."});
                }
            }
        });
        db.close();
    });
};
    
exports.redirectShort = function(req,res){
    mongodb.connect(url, function(err, db){
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
}