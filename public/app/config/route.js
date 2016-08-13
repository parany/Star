angular.module('starApp').config(['$routeProvider', 'ACCESS_LEVELS', function($routeProvider, ACCESS_LEVELS) {
    $routeProvider
        .when('/login', {
            templateUrl: 'app/pages/account/login.html',
            controller: 'loginController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/', {
            templateUrl: 'app/pages/read/index.html',
            controller: 'readController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/notes', {
            templateUrl: 'app/pages/note/list.html',
            controller: 'listNoteController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/note/add/:id', {
            templateUrl: 'app/pages/note/add.html',
            controller: 'addNoteController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/note/edit/:id', {
            templateUrl: 'app/pages/note/edit.html',
            controller: 'editNoteController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'read'
        })
        .when('/agendas', {
            templateUrl: 'app/pages/agenda/index.html',
            controller: 'agendaController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/agendas/detail/:id', {
            templateUrl: 'app/pages/agenda/detail.html',
            controller: 'detailAgendaController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/agendas/add', {
            templateUrl: 'app/pages/agenda/add.html',
            controller: 'addAgendaController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/agendas/edit/:id', {
            templateUrl: 'app/pages/agenda/edit.html',
            controller: 'editAgendaController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'agenda'
        })
        .when('/dicos', {
            templateUrl: 'app/pages/dico/index.html',
            controller: 'dicosController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/dicos/add', {
            templateUrl: 'app/pages/dico/add.html',
            controller: 'addDicoController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/dicos/edit/:id', {
            templateUrl: 'app/pages/dico/add.html',
            controller: 'addDicoController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'dico'
        })
        .when('/treaties', {
            templateUrl: 'app/pages/treaty/index.html',
            controller: 'treatyController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaties/detail/:id', {
            templateUrl: 'app/pages/treaty/detail.html',
            controller: 'detailTreatyController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaties/add', {
            templateUrl: 'app/pages/treaty/add.html',
            controller: 'addTreatyController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/treaties/edit/:id', {
            templateUrl: 'app/pages/treaty/add.html',
            controller: 'addTreatyController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'treaty'
        })
        .when('/explications', {
            templateUrl: 'app/pages/explication/index.html',
            controller: 'explicationController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explications/add', {
            templateUrl: 'app/pages/explication/Add.html',
            controller: 'addExplicationController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explications/edit/:id', {
            templateUrl: 'app/pages/explication/add.html',
            controller: 'addExplicationController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/explications/detail/:id', {
            templateUrl: 'app/pages/explication/detail.html',
            controller: 'detailExplicationController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'explication'
        })
        .when('/news', {
            templateUrl: 'app/pages/new/index.html',
            controller: 'newController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/news/detail/:id', {
            templateUrl: 'app/pages/new/detail.html',
            controller: 'detailNewController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/news/add', {
            templateUrl: 'app/pages/new/add.html',
            controller: 'addNewController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/news/edit/:id', {
            templateUrl: 'app/pages/new/add.html',
            controller: 'addNewController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'new'
        })
        .when('/activities', {
            templateUrl: 'app/pages/activity/index.html',
            controller: 'activityController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'account'
        })
        .when('/tweets', {
            templateUrl: 'app/pages/tweet/index.html',
            controller: 'tweetController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'tweet'
        })
        .when('/tweets/add', {
            templateUrl: 'app/pages/tweet/add.html',
            controller: 'addTweetController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'tweet'
        })
        .when('/tweets/edit/:id', {
            templateUrl: 'app/pages/tweet/add.html',
            controller: 'addTweetController',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'tweet'
        })
        .when('/chat', {
            templateUrl: 'app/pages/chat/index.html',
            controller: 'chatController',
            access_level: ACCESS_LEVELS.Pub
        })
        .when('/error500', {
            templateUrl: 'app/pages/error/500.html',
            controller: 'error500Controller',
            access_level: ACCESS_LEVELS.Pub,
            menuId: 'error'
        });
}]);