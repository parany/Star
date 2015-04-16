var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'Agenda',
    description: 'The agenda, ... web server.',
    script: require('path').join(__dirname, 'server.js'),
    env: {
        name: "NODE_ENV",
        value: "production"
    }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    console.log('install');
    svc.start();
});

// Just in case this file is run twice.
svc.on('alreadyinstalled', function () {
    console.log('This service is already installed.');
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start', function () {
    console.log('start');
    console.log(svc.name + ' started!\nVisit http://127.0.0.1:3333 to see it in action.');
});

// Install the script as a service.
svc.install();
console.log('Install the script as a service.');