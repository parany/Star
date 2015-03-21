var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'HelloWorld',
    script: require('path').join(__dirname, 'app.js')
});

svc.on('start', function () {
    console.log('Trying to start..');
    console.log('Restart complete.');
});

svc.on('stop', function () {
    console.log('Stopping...');
    console.log('Stopped.');
});

// Uninstall the service.
svc.restart();