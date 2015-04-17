// includes
var repository = require('../model/repository.js');

var columnDefinitions = {
    books: ['CreatedOn', 'UpdatedOn'],
    cultures: ['CreatedOn', 'UpdatedOn'],
    dicos: ['CreatedOn', 'UpdatedOn'],
    tags: ['CreatedOn', 'UpdatedOn'],
    testaments: ['CreatedOn', 'UpdatedOn'],
    users: ['CreatedOn', 'UpdatedOn'],
    verses: ['CreatedOn', 'UpdatedOn'],
    versions: ['CreatedOn', 'UpdatedOn'],
    sources: ['CreatedOn', 'UpdatedOn'],
    agendas: ['CreatedOn', 'UpdatedOn', 'Date'],
    explications: ['CreatedOn', 'UpdatedOn', 'Date'],
    treaties: ['CreatedOn', 'UpdatedOn', 'Date'],
    news: ['CreatedOn', 'UpdatedOn', 'Date']
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
            if (value == undefined || !(value instanceof Date))
                continue;
            docs[i][column] = value.getTime();
        }
        collection.save(docs[i], { safe: false });
    }
});