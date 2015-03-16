// includes
var repository = require('../model/repository.js');

var columnDefinitions = {
    'agendas': [ 'CreatedOn', 'UptatedOn', 'Date']
};

var args = process.argv.slice(2);
var collectionName = args[0];

if (collectionName == undefined) {
    console.log('No collection name provided');
    process.exit(0);
}

console.log("You're working on the " + collectionName + " collection.");
var collection = repository.getCollection(collectionName);

collection.find({}).toArray(function (err, docs) {
    for (var i = 0; i < docs.length; i++) {
        for (var j = 0; j < columnDefinitions[collectionName].length; j++) {
            var column = columnDefinitions[collectionName][j];
            var value = docs[i][column];
            console.log(column + ' : ' + value);
            if (value == undefined)
                continue;
            docs[i][column] = value.getTime();
        }
        collection.save(docs[i], { safe: false });
    }
});