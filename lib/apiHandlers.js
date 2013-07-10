var db              = require('./config').db;
var apiHandlers = exports;

apiHandlers.titleList = function(response) {
	var data = db.collection("article");

	data.find({}, {title:1}).toArray(function(err, results){
		response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(results));
        response.end();
	});
};