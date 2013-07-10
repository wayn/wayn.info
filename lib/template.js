var fs       = require("fs");
var template = exports;

// Read the template files.
// Every function returns templeate html string.

template.page = function() {
	return fs.readFileSync(__dirname + "/../views/index.html", "utf8");
};

template.front = function() {
	return fs.readFileSync(__dirname + "/../views/front.html", "utf8");
};

template.article = function() {
	return fs.readFileSync(__dirname + "/../views/article.html", "utf8");
};

template.side = function() {
	return fs.readFileSync(__dirname + "/../views/article_list.html", "utf8");
};

template.notFound = function() {
	return fs.readFileSync(__dirname + "/../views/404.html", "utf8");
};