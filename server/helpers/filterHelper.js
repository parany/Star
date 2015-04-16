var ObjectId = require('mongodb').ObjectID;

Object.prototype.toAnyFilter = function () {
    var filters = this;
    for (var filter in filters) {
        if (filter.indexOf('Id') > 0 && filter != 'VerseId') {
            filters[filter] = new ObjectId(filters[filter]);
        }
        if (filters[filter] instanceof Object) {
            var subFilters = filters[filter];
            for (var subFilter in subFilters) {
                if (subFilter == 'lte') {
                    subFilters.$lte = subFilters[subFilter];
                    delete subFilters.lte;
                }
                if (subFilter == 'gte') {
                    subFilters.$gte = subFilters[subFilter];
                    delete subFilters.gte;
                }
                if (subFilter == 'in') {
                    subFilters.$in = subFilters[subFilter].map(function (s) { return new ObjectId(s); });
                    delete subFilters.in;
                }
                if (subFilter == 'regex') {
                    subFilters.$regex = subFilters[subFilter];
                    delete subFilters.regex;
                }
            }
        }
    }
    return filters;
}