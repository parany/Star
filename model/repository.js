var mongodb = require('mongodb');

exports.getCollection = function (collectionName) {
    var db = new mongodb.Db(
        'star',
        new mongodb.Server('127.0.0.1', 27017, { auto_reconnect: true, poolSize: 20 }),
        { w: 1 }
    );
    return db.collection(collectionName);
}
