var phony = require('phony').make_phony();
var Faker = require('./faker.js');

Faker.prototype.fakeTag = function() {
    console.log(phony.lorem_paragraphs(2));    
}