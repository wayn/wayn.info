var querystring     = require("querystring");
var formidable      = require("formidable");
var fs              = require("fs");
var url             = require("url");
var md              = require("marked");
var db              = require('./config').db;
var helper          = require("./helper");
var template        = require('./template');
var requestHandlers = exports;

requestHandlers.index = function(response) {
    var frontTpl = template.front();
    var pageTpl = template.page();

    var page = pageTpl.replace("{content}", frontTpl);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(page);
    response.end();
};

// Start function for /start or / request.
requestHandlers.blog = function(response) {
    // Connect article db.
    var data = db.collection("article");

    // Read the template file synchronously.
    var articleTpl = template.article();
    var pageTpl    = template.page();
    var sideTpl = template.side();

    data.find().sort({date: -1}).toArray(function(err, articles) {
		var articleItems = '';

        for (var i = 0; i < articles.length; i++) {
            var date = new Date(articles[i].date);
            // Fill article data to template.
            var articleItem = articleTpl.replace("{article:title}", articles[i].title);

            articleItem = articleItem.replace("{article:body}", md.parser(md.lexer(articles[i].body)));
            articleItem = articleItem.replace("{article:month}", helper.formatMonth(date));
            articleItem = articleItem.replace("{article:day}", date.getDate());
            articleItem = articleItem.replace("{article:year}", date.getFullYear());
            articleItem = articleItem.replace("{article:hour}", date.getHours());
            articleItem = articleItem.replace("{article:minute}", date.getMinutes());

            articleItems += articleItem;
        }
        // Fill article items to page template.
        var page = pageTpl.replace("{content}", articleItems);
        page = page.replace("{side}", sideTpl);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(page);
        response.end();
	});
};

// Post function for /post request.
requestHandlers.post = function(response, request) {
	// Post form.
    var postTemplate = '<form action="/save" method="post">'+
                            '<input type="text" name="title"/><br>'+
                            '<textarea cols="120" rows="25" name="body"></textarea>'+
                            '<input type="submit" value="Save"/>'+
                        '</form>';
    // Read the page template file asynchronously.
    var pageTpl = template.page();

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(pageTpl.replace("{content}", postTemplate));
    response.end();
};

// Save function for /save request.
requestHandlers.save = function(response, request) {
	// Connect article db.
    var article = db.collection("article");
    var body = '';
    if (request.method == 'POST') {

        request.addListener("data", function(data) {
            body += data;
        });

        request.addListener("end", function() {
            var POST = querystring.parse(body);
            var id = POST.id;
            if (id != null) {
                article.update({_id:db.bson_serializer.ObjectID.createFromHexString(id)},
                    {title: POST.title, body: POST.body, date: Date()},
                    function(error, docs) {
                        response.statusCode = '302';
                        response.setHeader('Location', '/');
                        response.end();
                    });
            } else {
                // Save post to database.
                article.save({title: POST.title, body: POST.body, date: Date() }, function(error, docs) {
                    // Redrcit to home page.
                    response.statusCode = '302';
                    response.setHeader('Location', '/');
                    response.end();
                });
            }
        });
    }
};

// Edit function for /edit request.
requestHandlers.edit = function(response, request) {
	// Post form.
    var postTemplate = '<form action="/save" method="post">'+
                            '<input type="hidden" name="id" value="{article:_id}"/><br>'+
                            '<input type="text" name="title" value="{article:title:value}"/><br>'+
                            '<textarea cols="100" rows="15" name="body">{article:body:value}</textarea>'+
                            '<input type="submit" value="Save"/>'+
                        '</form>';
    // Get article id from request url.
    var id = querystring.parse(url.parse(request.url).query).id;
    // Read the template file synchronously.
    var pageTpl = template.page();
    // Connect article db.
    var data = db.collection("article");
    data.findOne({_id:db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, article) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error, "/n");
            response.end();
        } else {
            var output = postTemplate.replace("{article:_id}", id);
            output = output.replace("{article:title:value}", article.title);
            output = output.replace("{article:body:value}", article.body);
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(pageTpl.replace("{content}", output));
            response.end();
        }
    });
};

// Remove function for /remove request.
requestHandlers.remove = function(response, request) {
    // Get article id from request url.
    var id = querystring.parse(url.parse(request.url).query).id;

    var data = db.collection("article");
    data.remove({_id:db.bson_serializer.ObjectID.createFromHexString(id)}, {w:1}, function (error, number) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error, "/n");
            response.end();
        } else {
            // Redrcit to home page.
            response.statusCode = '302';
            response.setHeader('Location', '/');
            response.end();
        }
    });
};

// Manage article function for manageArticle request.
requestHandlers.manageArticle = function(response, request) {
	// Connect article db.
	var data = db.collection("article");
	// Read the template file synchronously.
	var pageTpl = template.page();
	data.find({}, {"_id": true, "title": true}).toArray(function(error, articles) {
		if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error, "/n");
            response.end();
        } else {
            var items = '';
            for(var i = 0; i < articles.length; i++) {

                var titleLink = '<a href="edit?id=' + articles[i]._id + '">'+articles[i].title +'</a>';
                var removeLink = '<a href="remove?id=' + article[i]._id + '">Remove</a>';
                items += '<li>' + titleLink + removeLink + '</li>';
            }
            // Fill post form to page template.
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(pageTpl.replace("{content}", '<ul class="title_list">' + items + '</ul>'));
            response.end();
        }
	});
};

requestHandlers.upload = function(response, request) {
    var uploadTemplate = '<form action="/store" method="post" enctype="multipart/form-data">'+
                            '<input type="file" name="image"/><br>'+
                            '<input type="submit" value="Upload"/>'+
                         '</form>';
    // Read the page template file asynchronously.
    var pageTpl = template.page();

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(pageTpl.replace("{content}", uploadTemplate));
    response.end();
};

requestHandlers.store = function(response, request) {
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
        fs.renameSync(files.image.path, __dirname + "/../tmp/" + files.image.name);
        response.writeHead(200, {"Content-Type":"text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
};

requestHandlers.show = function(response) {
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
};
