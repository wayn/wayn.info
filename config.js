var mongo = require("mongoskin");
var db_url = exports.db_url = "@127.0.0.1:27017/wayn";
exports.db = mongo.db(db_url);