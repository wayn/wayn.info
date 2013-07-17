var http  = require("http");
var url   = require("url");
var server = exports;

server.start = function(route, handle) {

    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log(pathname);
        route(handle, pathname, response, request);
    }

    http.createServer(onRequest).listen(8081);
};
