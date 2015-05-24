var _ = require('lodash');
var ws = require('ws');
var server;

var sockets = [];

module.exports.connect = function (httpServer) {
    server = new ws.Server({server: httpServer});

    server.on('connection', function (socket) {
        sockets.push(socket);

        socket.on('close', function () {
            _.remove(sockets, socket);
        });
    });
};

module.exports.broadcast = function (topic, data) {
    var payload = {
        topic: topic,
        data: data
    };

    sockets.forEach(function (socket) {
        socket.send(JSON.stringify(payload));
    });
};
