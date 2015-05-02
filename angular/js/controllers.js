var app = angular.module('assignment3', [
    'ngRoute'
]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {controller: 'MainController', templateUrl: 'templates/main.html'})
        .when('/register', {controller: 'RegisterController', templateUrl: 'templates/register.html'})
        .otherwise({controller: 'NotFoundController', templateUrl: 'templates/not_found.html'});
});

app.run(function ($rootScope, $location) {
    var url = 'ws://' + $location.host() + ':' + $location.port();
    var connection = new WebSocket(url);

    connection.onmessage = function (event) {
        var payload = JSON.parse(event.data);
        var eventName = 'ws:' + payload.topic;

        $rootScope.$broadcast(eventName, payload.data);
    };
});

app.controller('ApplicationController', function ($scope, $location, SessionsService) {
    $scope.$on('login', function (event, user) {
        $scope.currentUser = user;
    });

    $scope.logout = function () {
        SessionsService.logout();
        delete $scope.currentUser;
        $location.path('register');
    };
});

app.controller('MainController', function ($scope, $location, AlbumsService) {
    $scope.albums = [];

    $scope.$on('ws:new public album', function (event, album) {
        if (album.creator !== $scope.currentUser.username) {
            $scope.albums.unshift(album);
            $scope.$apply();
        }
    });

    $scope.$on('ws:removed album', function (event, album) {
        if (album.creator !== $scope.currentUser.username) {
            _.remove($scope.albums, {_id: album._id});
            $scope.$apply();
        }
    });

    AlbumsService.query()
        .success(function (albums) {
            $scope.albums = albums;
        })
        .error(function (data, status) {
            if (status === 401) {
                $location.path('/register');
                alert('You need to be logged in to go here!');
            }
        });

    $scope.newAlbum = {};

    $scope.saveAlbum = function () {
        if (!$scope.newAlbum.title || !$scope.newAlbum.artist) {
            alert('Please enter a title and an artist.');
            return;
        }

        AlbumsService.save($scope.newAlbum)
            .success(function (album) {
                $scope.albums.unshift(album);
                $scope.newAlbum = {};
            });
    };

    $scope.toggleStatus = function (album) {
        AlbumsService.toggleStatus(album._id, album.public).success(function () {
            _.find($scope.albums, function (currentAlbum) {
                if (currentAlbum._id === album._id) {
                    currentAlbum.public = !currentAlbum.public;
                }
            });
        });
    };

    $scope.deleteAlbum = function (id) {
        AlbumsService.delete(id).success(function () {
            _.remove($scope.albums, {_id: id});
        });
    };
});

app.service('AlbumsService', function ($http) {
    this.query = function () {
        return $http.get('/api/albums');
    };

    this.save = function (newAlbum) {
        return $http.post('/api/albums', newAlbum);
    };

    this.toggleStatus = function (id, currentStatus) {
        return $http.put('/api/albums/' + id, {public: !currentStatus});
    };

    this.delete = function (id) {
        return $http.delete('/api/albums/' + id);
    };
});

app.controller('RegisterController', function ($scope, $location, SessionsService) {
    $scope.newUser = {};

    $scope.register = function () {
        if (!$scope.newUser.username || !$scope.newUser.password) {
            alert('Please enter a username and password');
            return;
        }

        SessionsService.register($scope.newUser)
            .success(function () {
                SessionsService.login($scope.newUser.username, $scope.newUser.password).then(function (response) {
                    $scope.$emit('login', response.data.user);
                    $location.path('/');
                });
            })
            .error(function (message, status) {
                if (status === 412) { // bad request; username exists
                    alert('Username already exists! Try another.');
                } else {
                    alert(status + ': ' + message);
                }
            });
    };

    $scope.login = function (username, password) {
        SessionsService.login(username, password).then(function (response) {
            $scope.$emit('login', response.data.user);
            $location.path('/');
        });
    };
});

app.service('SessionsService', function ($http) {
    this.register = function (user) {
        return $http.post('/api/users', user);
    };

    this.login = function (username, password) {
        var loginAttempt = {
            username: username,
            password: password
        };

        return $http.post('/api/sessions', loginAttempt)
            .success(function (response) {
                $http.defaults.headers.common['x-auth'] = response.token;
                return response;
            })
            .error(function (message, status) {
                if (status === 404) {
                    alert('Wrong username or password'); // TODO: do this in controller somehow
                }
            });
    };

    this.logout = function () {
        delete $http.defaults.headers.common['x-auth'];
    };
});

app.controller('NotFoundController', function ($scope) {
    $scope.message = 'Not found!';
});
