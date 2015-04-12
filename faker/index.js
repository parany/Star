var Faker = require('./faker.js');
require('./fakeTag.js');

var args = process.argv.slice(2);
if (!args.length) {
    console.log('No arguments provided! Exit 0');
    process.exit(0);
}

var faker = new Faker();
var method = "fake" + args[0];
faker[method]();