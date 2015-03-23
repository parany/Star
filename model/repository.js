var mongodb = require('mongodb');
var config = require('../config.json');

exports.getCollection = function (collectionName) {
    var db = new mongodb.Db(
        config.db.name,
        new mongodb.Server(config.db.host, config.db.port, { auto_reconnect: true, poolSize: 20 }),
        { w: 1 }
    );
    return db.collection(collectionName);
}
