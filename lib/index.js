var server          = require("./server");
var router          = require("./route");
var requestHandlers = require("./requestHandlers");
var handle          = {};

handle["/"]              = requestHandlers.blog;
handle["/blog"]          = requestHandlers.blog;
handle["/post"]          = requestHandlers.post;
handle["/save"]          = requestHandlers.save;
handle["/edit"]          = requestHandlers.edit;
handle["/remove"]        = requestHandlers.remove;
handle["/upload"]        = requestHandlers.upload;
handle["/store"]         = requestHandlers.store;
handle["/show"]          = requestHandlers.show;
handle['/emptyDB']       = requestHandlers.emptyDB;
handle["/manageArticle"] = requestHandlers.manageArticle;

server.start(router.route, handle);