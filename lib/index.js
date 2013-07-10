var server          = require("./server");
var router          = require("./route");
var requestHandlers = require("./requestHandlers");
var apiHandlers     = require("./apiHandlers");
var handle          = {};

handle["/"]              = requestHandlers.blog;
handle["/blog"]          = requestHandlers.blog;
handle["/post"]          = requestHandlers.post;
handle["/save"]          = requestHandlers.save;
handle["/edit"]          = requestHandlers.edit;
handle["/upload"]        = requestHandlers.upload;
handle["/store"]         = requestHandlers.store;
handle["/show"]          = requestHandlers.show;
handle['/emptyDB']       = requestHandlers.emptyDB;
handle["/manageArticle"] = requestHandlers.manageArticle;
handle["/api/titleList"] = apiHandlers.titleList;

server.start(router.route, handle);