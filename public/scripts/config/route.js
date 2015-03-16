starApp.config(function ($routeProvider, ACCESS_LEVELS) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/pages/account/login.html',
            controller: "loginController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/', {
            templateUrl: 'views/pages/read/index.html',
            controller: "readController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/notes', {
            templateUrl: 'views/pages/note/list.html',
            controller: "listNoteController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/note/add/:id', {
            templateUrl: 'views/pages/note/add.html',
            controller: "addNoteController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/note/edit/:id', {
            templateUrl: 'views/pages/note/edit.html',
            controller: "editNoteController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/agenda/index', {
            templateUrl: 'views/pages/agenda/index.html',
            controller: "agendaController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        }).when('/agenda/add', {
            templateUrl: 'views/pages/agenda/add.html',
            controller: "addAgendaController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/agenda/edit/:id', {
            templateUrl: 'views/pages/agenda/edit.html',
            controller: "editAgendaController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/dicos', {
            templateUrl: 'views/pages/dico/index.html',
            controller: "dicosController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/dico/add', {
            templateUrl: 'views/pages/dico/add.html',
            controller: "addDicoController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/dico/edit/:id', {
            templateUrl: 'views/pages/eico/add.html',
            controller: "addDicoController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/treaty', {
            templateUrl: 'views/pages/treaty/index.html',
            controller: "treatyController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaty/add', {
            templateUrl: 'views/pages/treaty/add.html',
            controller: "addTreatyController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaty/edit/:id', {
            templateUrl: 'views/pages/treaty/add.html',
            controller: "addTreatyController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/explication', {
            templateUrl: 'views/pages/explication/index.html',
            controller: "explicationController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explication/add', {
            templateUrl: 'views/pages/explication/Add.html',
            controller: "eddExplicationController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explication/edit/:id', {
            templateUrl: 'views/pages/explication/add.html',
            controller: "addExplicationController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/new', {
            templateUrl: 'views/pages/new/index.html',
            controller: "newController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/new/add', {
            templateUrl: 'views/pages/new/add.html',
            controller: "addNewController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/new/edit/:id', {
            templateUrl: 'views/pages/new/add.html',
            controller: "addNewController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
    ;
});
