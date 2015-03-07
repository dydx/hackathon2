// express server stuffs
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// database stuffs
var Datastore = require('nedb');
var db = new Datastore({
	filename: 'database.json',
	autoload: true
});

// serve our frontend code
app.use(express.static(__dirname + '/public'));
// super secret admin area!
app.use('/admin', express.static(__dirname + '/admin'));


// cross origin stuff, jic
app.use(function crossOrigin(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Header', 'X-Requested-With');
	return next();
});

// for parsing get and posts
app.use(bodyParser.urlencoded({ extended: false }));

// our rest api
app.get('/api/all', function(req, res, next) {
	db.find({}, function(err, docs) {
		// oh jesus god why...
		var originalSend = res.send;
		res.send = function() {
			if(this.headersSent) {
				return;
			} else {
				originalSend.apply(this, arguments);
			}
		}
		// and now back to our regularly scheduled programming
		res.send(docs);
		return next();
	});
});

// I'm proud of this one.
app.post('/api/new', function(req, res, next) {
	var backRedirect = req.header('Referer') || '/';

	// lets build our geojson data
	var message = req.body.msg;
	var lat = req.body.lat;
	var lon = req.body.lon;

	var data = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [+lat, +lon]
		},
		"properties": {
			"name": message
		}
	};

	db.insert(data, function(err, doc) {
		if(!err) {
			console.log('new data: ' + JSON.stringify(doc));
			// lets redirect back
			// maybe have a '/thanks.html'
			// page or something?
			res.header('Location', backRedirect);
			res.sendStatus(302);
			return next();
		}
	})
})

app.get('/api/:id', function(req, res, next) {
	db.find({ _id: req.params.id }, function(err, doc) {
		res.send(doc);
		return next();
	})
})


app.get('/api/delete/:id', function(req, res, next) {
	db.remove({_id: req.params.id}, function(err, doc) {
		var backRedirect = '/admin/'
		res.header('Location', backRedirect);
		res.sendStatus(200);
		return next();
	})
})
// have our server listen and report
app.listen(process.env.PORT || 8000, function() {
	console.log('%s listening at %s', app.name, app.url);
});