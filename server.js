
/**
 * Module dependencies.
 */
var express = require('express')
  , mongoose = require('mongoose');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Model

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Memo = new Schema({
  content : String,
  date : Date
});

Memo.pre('save', function(next) {
  this.date = new Date();
  next();
});

mongoose.model('memo', Memo);

var db = mongoose.createConnection('mongodb://localhost/memo');
var Memo = db.model('memo');

app.configure(function() {
  app.set('db', db);
});


// Routes

app.get('/memo', function(req, res, next) {
  console.log("get memolist");
  Memo.find({}, function(err, data) {
    if(err) return next(err);
    res.json(data);
  });
});

app.get('/memo/:id', function(req, res, next) {
  console.log("get memo : " + req.params.id);
  Memo.findById(req.params.id, function(err, data) {
    if(err) return next(err);
    res.json(data);
  });
});

app.post('/memo', function(req, res, next) {
  console.log("post memo : " + req.body.content);
  var memo = new Memo();
  memo.content = req.body.content;
  memo.save(function(err) {
    if(err) return next(err);
    res.json(memo);
  });
});

app.put('/memo/:id', function(req, res, next) {
  console.log("put memo : " + req.params.id);
  console.log(req.body.content);
  Memo.findById(req.params.id, function(err, data) {
    if(err) return next(err);
    data.content = req.body.content;
	  data.save(function(err) {
	    if(err) return next(err);
	    res.json(data);
	  });
  });
});

app.del('/memo/:id', function(req, res, next) {
  console.log("delete memo : " + req.params.id);
  Memo.findById(req.params.id, function(err, data) {
    if(err) return next(err);
    data.remove(function(err) {
      console.log("memo remove!");
	    res.json(data);
    });
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
