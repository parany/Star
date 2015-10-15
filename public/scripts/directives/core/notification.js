starApp.directive('notification', function($location, $rootScope, $route, accountService) {
    var socket = io.connect();
    var userName = accountService.getUserName();
    return {
        scope: true,
        templateUrl: 'views/directives/core/notification.html',
        restrict: 'E',
        replace: true,
        link: function(scope) {
            socket.on('connect', function() {
                socket.emit('join', accountService.getUserName());
            });

            socket.on('initialization', function(data) {
                scope.page.users = data.users;
                data.users.forEach(function(user) {
                    var nickname = user.nickname;
                    scope.page.messages[nickname] = [];
                    data.messages.forEach(function(message) {
                        if (message.to === 'broadcast') {
                            scope.page.messages.broadcast.push({
                                _id: message._id,
                                author: message.from === accountService.getUserName() ? 'Me' : message.from,
                                message: message.message,
                                date: new Date(message.date),
                                seen: message.seen || message.to !== userName
                            });
                        } else if (message.from === nickname || message.to === nickname) {
                            scope.page.messages[user.nickname].push({
                                _id: message._id,
                                author: message.from === nickname ? nickname : 'Me',
                                message: message.message,
                                date: new Date(message.date),
                                seen: message.seen || message.to !== userName
                            });
                        }
                    });
                });
                scope.page.nbOfNotifications = data.messages.filter(function(message) {
                    return message.seen === false && message.to === userName;
                }).length;
                $rootScope.$emit('chat.users');
            });

            socket.on('message', function(data) {
                scope.page.nbOfNotifications++;
                if (data.to === 'broadcast') {
                    scope.page.messages[data.to].push({
                        author: data.from,
                        message: data.message,
                        date: data.date
                    });
                } else {
                    scope.page.messages[data.from].push({
                        author: data.from,
                        message: data.message,
                        date: data.date
                    });
                }
                $rootScope.$emit('chat.messages');
            });

            $rootScope.$on('chat.send', function(evt, data) {
                socket.emit('message', data);
            });

            $rootScope.$on('chat.mark', function(evt, model) {
                var obj = {
                    _id: model._id,
                    seen: true
                };
                socket.emit('mark', obj);
            });
        }
    };
});