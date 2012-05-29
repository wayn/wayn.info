var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");
    db = require('./config').db;
    helper = require("./helper");
    
function start(response) {
    var data = db.collection("article");

    var articleTpl = fs.readFileSync("article.tpl.html", "utf8");
    
    fs.readFile("page.tpl.html", "utf8", function(error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error, "/n");
            response.end();
        } else {
        
        	data.find().toArray(function(err, articles) {
        		var articleItems = '';
        		
			    for (var i = 0; i < articles.length; i++) {
			        var article = articles[i];
			        var date = new Date(article.date);
			        var articleItem = articleTpl.replace("{article:title}", article.title);
			        articleItem = articleItem.replace("{article:body}", article.body);
			        articleItem = articleItem.replace("{article:month}", helper.formatMonth(date));
			        articleItem = articleItem.replace("{article:day}", date.getDate());
			        articleItem = articleItem.replace("{article:year}", date.getFullYear());
			        articleItems += articleItem;
		        }
		        
		        var page = file.replace("{content}", articleItems);
	            response.writeHead(200, {"Content-Type": "text/html"});
	            response.write(page);
	            response.end();
			});
        }
    });
}

function upload(response, request) {
    console.log("Request handle 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, "/tmp/test.png");
        response.writeHead(200, {"Content-Type":"text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function post(response, request) {
    var postTemplate = '<form action="/save" method="post">'+
                            '<input type="text" name="title"/><br>'+
                            '<textarea cols="100" rows="15" name="body"></textarea>'+
                            '<input type="submit" value="Save"/>'+
                        '</form>';                    
    
    fs.readFile("page.tpl.html", "utf8", function(error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error, "/n");
            response.end();
        } else {
            var page = file.replace("{content}", postTemplate);
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(page);
            response.end();
        }
    });
}

function save(response, request) {
    var article = db.collection("article");
    var body = '';
    if (request.method == 'POST') {
        request.addListener("data", function(data) {
            body += data;
        });
        request.addListener("end", function() {
            var POST =  querystring.parse(body);
            article.save({title: POST.title, body: POST.body, date: Date() }, function(error, docs) {
            	response.statusCode = '302';
	            response.setHeader('Location', '/');
	            response.end();
            });
        });
    }
}

function show(response) {
    console.log("Request handle 'show' was called");
    fs.readFile("/tmp/test.png", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error, "/n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.post = post;
exports.save = save;