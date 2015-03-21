// includes
var repository = require('../model/repository.js');

var columnDefinitions = {
    'books': ['CreatedOn', 'UpdatedOn'],
    'agendas': ['CreatedOn', 'UpdatedOn', 'Date'],
    'explications': ['CreatedOn', 'UpdatedOn', 'Date'],
    'treaties': ['CreatedOn', 'UpdatedOn', 'Date'],
    'news': ['CreatedOn', 'UpdatedOn', 'Date']
};

collection.find({}).toArray(function (err, docs) {
    for (var collectionName in object.keys(columnDefinitions)) {
        var collection = repository.getCollection(collectionName);
        console.log(collectionName.toUpperCase());
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
        console.log(' ');
        console.log(' ');
    }
    
});