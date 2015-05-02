var ws = require('ws');
var server;

var sockets = [];
var socketCount = 0;

module.exports.connect = function (httpServer) {
    server = new ws.Server({server: httpServer});

    server.on('connection', function (socket) {
        var id = socketCount;

        sockets.push({
            id: id,
            socket: socket
        });

        socketCount++;

        socket.on('close', function () {
            var finished = false;

            sockets.forEach(function (socketContainer, index) {
                if (finished) {
                    return;
                }

                if (socketContainer.id === id) {
                    console.log('removed socket with id', id);
                    sockets.splice(index, 1);
                    finished = true;
                }
            });
        });
    });
};

module.exports.broadcast = function (topic, data) {
    var payload = {
        topic: topic,
        data: data
    };

    sockets.forEach(function (socketContainer) {
        socketContainer.socket.send(JSON.stringify(payload));
    });
};
