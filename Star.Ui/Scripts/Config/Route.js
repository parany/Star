starApp.config(function ($routeProvider, ACCESS_LEVELS) {
    $routeProvider
        .when('/login', {
            templateUrl: 'Views/Pages/Account/Login.html',
            controller: "LoginController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/', {
            templateUrl: 'Views/Pages/Read/Index.html',
            controller: "ReadController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/notes', {
            templateUrl: 'Views/Pages/Note/List.html',
            controller: "ListNoteController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/note/add/:id', {
            templateUrl: 'Views/Pages/Note/Add.html',
            controller: "AddNoteController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/note/edit/:id', {
            templateUrl: 'Views/Pages/Note/Edit.html',
            controller: "EditNoteController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/agenda/index', {
            templateUrl: 'Views/Pages/Agenda/Index.html',
            controller: "AgendaController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        }).when('/agenda/add', {
            templateUrl: 'Views/Pages/Agenda/Add.html',
            controller: "AddAgendaController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/agenda/edit/:id', {
            templateUrl: 'Views/Pages/Agenda/Edit.html',
            controller: "EditAgendaController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/dicos', {
            templateUrl: 'Views/Pages/Dico/Index.html',
            controller: "DicosController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/dico/add', {
            templateUrl: 'Views/Pages/Dico/Add.html',
            controller: "AddDicoController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/dico/edit/:id', {
            templateUrl: 'Views/Pages/Dico/Add.html',
            controller: "AddDicoController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/treaty', {
            templateUrl: 'Views/Pages/Treaty/Index.html',
            controller: "TreatyController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaty/add', {
            templateUrl: 'Views/Pages/Treaty/Add.html',
            controller: "AddTreatyController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaty/edit/:id', {
            templateUrl: 'Views/Pages/Treaty/Add.html',
            controller: "AddTreatyController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/explication', {
            templateUrl: 'Views/Pages/Explication/Index.html',
            controller: "ExplicationController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explication/add', {
            templateUrl: 'Views/Pages/Explication/Add.html',
            controller: "AddExplicationController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explication/edit/:id', {
            templateUrl: 'Views/Pages/Explication/Add.html',
            controller: "AddExplicationController",
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
    ;
});
