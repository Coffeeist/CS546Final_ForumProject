// jmcgirr final

// connection settings
const mongoConfig = {
	"serverUrl": "mongodb://localhost:27017/",
	"database": "forumsoftware"
};

const MongoClient = require("mongodb").MongoClient;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
