var bingSearch=require('bing.search');
var mongodb = require("mongodb").MongoClient; //required("mongodb").MongoClient
var url    = process.env.MONGOLAB_URI || "mongodb://" + process.env.IP + ":27017/url-shortener-huytr";


exports.history = function(req, res){
    mongodb.connect(url, function(err, db){
        if(err) throw err;
        var history = db.collection("history");
        history.find({}, {_id: 0}).limit(10).sort({when:-1}).toArray(function(err, docs){
            if(err) throw err;
            res.json(docs);
        });
        db.close();
    });
};

exports.search = function(req,res){
    var query = req.params.query;
    var searchTearm = {
      "term": query,
      "when": new Date().toLocaleString()
    };
    mongodb.connect(url, function(err, db){
        if(err) throw err;
        var history = db.collection("history");
        history.insert(searchTearm);
    });
    var size = req.query.offset || 10; // Number specified or 10
    var search = new bingSearch('yatQU9UfN+nWc8m0RbuJfJVPB/fl8sYaidAqYG41Qec');
    search.images(query, {
        top: size
    }, function(err, results){
        if(err) throw err;
        res.json(results.map(function(img){
            return {
                "url": img.url,
                "snippet": img.title,
                "thumbnail": img.thumbnail.url,
                "context": img.sourceUrl
            };
        }));
    });

};

