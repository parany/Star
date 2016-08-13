angular.module('starApp').config(['$routeProvider', 'ACCESS_LEVELS', function($routeProvider, ACCESS_LEVELS) {
    $routeProvider
        .when('/login', {
            templateUrl: 'scripts/pages/account/login.html',
            controller: 'loginController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/', {
            templateUrl: 'views/pages/read/index.html',
            controller: 'readController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/notes', {
            templateUrl: 'views/pages/note/list.html',
            controller: 'listNoteController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/note/add/:id', {
            templateUrl: 'views/pages/note/add.html',
            controller: 'addNoteController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/note/edit/:id', {
            templateUrl: 'views/pages/note/edit.html',
            controller: 'editNoteController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/agendas', {
            templateUrl: 'views/pages/agenda/index.html',
            controller: 'agendaController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/agendas/detail/:id', {
            templateUrl: 'views/pages/agenda/detail.html',
            controller: 'detailAgendaController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/agendas/add', {
            templateUrl: 'views/pages/agenda/add.html',
            controller: 'addAgendaController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/agendas/edit/:id', {
            templateUrl: 'views/pages/agenda/edit.html',
            controller: 'editAgendaController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/dicos', {
            templateUrl: 'views/pages/dico/index.html',
            controller: 'dicosController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/dicos/add', {
            templateUrl: 'views/pages/dico/add.html',
            controller: 'addDicoController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/dicos/edit/:id', {
            templateUrl: 'views/pages/dico/add.html',
            controller: 'addDicoController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/treaties', {
            templateUrl: 'views/pages/treaty/index.html',
            controller: 'treatyController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaties/detail/:id', {
            templateUrl: 'views/pages/treaty/detail.html',
            controller: 'detailTreatyController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaties/add', {
            templateUrl: 'views/pages/treaty/add.html',
            controller: 'addTreatyController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaties/edit/:id', {
            templateUrl: 'views/pages/treaty/add.html',
            controller: 'addTreatyController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/explications', {
            templateUrl: 'views/pages/explication/index.html',
            controller: 'explicationController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explications/add', {
            templateUrl: 'views/pages/explication/Add.html',
            controller: 'addExplicationController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explications/edit/:id', {
            templateUrl: 'views/pages/explication/add.html',
            controller: 'addExplicationController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explications/detail/:id', {
            templateUrl: 'views/pages/explication/detail.html',
            controller: 'detailExplicationController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/news', {
            templateUrl: 'views/pages/new/index.html',
            controller: 'newController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/news/detail/:id', {
            templateUrl: 'views/pages/new/detail.html',
            controller: 'detailNewController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/news/add', {
            templateUrl: 'views/pages/new/add.html',
            controller: 'addNewController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/news/edit/:id', {
            templateUrl: 'views/pages/new/add.html',
            controller: 'addNewController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/activities', {
            templateUrl: 'scripts/pages/activity/index.html',
            controller: 'activityController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'account'
        })
        .when('/tweets', {
            templateUrl: 'views/pages/tweet/index.html',
            controller: 'tweetController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'tweet'
        })
        .when('/tweets/add', {
            templateUrl: 'views/pages/tweet/add.html',
            controller: 'addTweetController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'tweet'
        })
        .when('/tweets/edit/:id', {
            templateUrl: 'views/pages/tweet/add.html',
            controller: 'addTweetController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'tweet'
        })
        .when('/chat', {
            templateUrl: 'views/pages/chat/index.html',
            controller: 'chatController',
            access_level: ACCESS_LEVELS.Pub
        })
        .when('/error500', {
            templateUrl: 'views/pages/error/500.html',
            controller: 'error500Controller',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'error'
        });
}]);