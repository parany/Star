var ObjectId = require('mongodb').ObjectID;

Object.prototype.toAnyFilter = function (collectionName, author) {
    var collectionNames = ['agendas', 'explications', 'treaties', 'news', 'tweets'];
    var filters = this;
    if (collectionNames.indexOf(collectionName) > -1) {
        filters.CreatedBy = author;
        filters.projection.CreatedBy = 1;
    }
    Object.keys(filters).forEach(function(filter) {
        if (filter.indexOf('Id') > 0 && filter !== 'VerseId') {
            filters[filter] = new ObjectId(filters[filter]);
        }
        if (filters[filter] instanceof Object) {
            var subFilters = filters[filter];
            Object.keys(subFilters).forEach(function(subFilter) {
                if (subFilter === 'lte') {
                    subFilters.$lte = subFilters[subFilter];
                    delete subFilters.lte;
                }
                if (subFilter === 'gte') {
                    subFilters.$gte = subFilters[subFilter];
                    delete subFilters.gte;
                }
                if (subFilter === 'regex') {
                    subFilters.$regex = subFilters[subFilter];
                    delete subFilters.regex;
                }
            });
        }
    });
    return filters;
};