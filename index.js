var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");
var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/post"] = requestHandlers.post;
handle["/save"] = requestHandlers.save;
server.start(router.route, handle);