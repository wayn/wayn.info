var fs       = require("fs");
var helper   = require("./helper");
var template = require('./template');
var router   = exports;

router.route = function(handle, pathname, response, request) {
    console.log("About to route a request for " + pathname);

    // file or path or 404.
    if (helper.extname(pathname) != '') {
       fs.readFile(pathname.substring(pathname.indexOf('/') + 1), function(error, file) {
          if (error) throw error;
          response.writeHead(200, {"Content-Type": helper.mime.lookupExtension(helper.extname(pathname))});
          response.write(file);
          response.end();
       });
    } else if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request);
    } else {
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write(template.notFound());
        response.end();
    }
};
