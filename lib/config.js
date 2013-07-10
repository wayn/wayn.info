var mongo  = require("mongoskin");
var db_url = exports.db_url = "localhost:27017/wayn";

exports.db = mongo.db(db_url);