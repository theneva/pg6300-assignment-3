var router = require('express').Router();
var jwt = require('jwt-simple');
var secrets = require('../secrets');

var Album = require('../models/album');

var sockets = require('../sockets');

router.get('/', function (req, res) {
    var token = req.header('x-auth');
    if (!token) {
        return res.status(401).send('No token provided');
    }
    var user = jwt.decode(token, secrets.jwt);

    Album.find()
        .or([
            {creator: user.username},
            {public: true}
        ])
        .sort('-created')
        .exec(function (err, albums) {
            return res.json(albums);
        });
});

router.post('/', function (req, res) {
    var token = req.header('x-auth');
    if (!token) {
        return res.status(401).send('No token provided');
    }
    var user = jwt.decode(token, secrets.jwt);

    var album = new Album(req.body);
    album.creator = user.username;
    album.public = false;

    album.save(function () {
        return res.json(album);
    });
});

router.put('/:id', function (req, res) {
    var token = req.header('x-auth');
    if (!token) {
        return res.status(401).send('No token provided');
    }
    var user = jwt.decode(token, secrets.jwt);

    Album.findById(req.params.id, function (err, album) {
        if (album.creator !== user.username) {
            return res.status(401).send('Someone else owns this album');
        }

        album.public = req.body.public;
        album.save(function () {
            if (album.public) {
                sockets.broadcast('new public album', album);
            } else {
                sockets.broadcast('removed album', album);
            }

            return res.json(album);
        });
    });
});

router.delete('/:id', function (req, res) {
    var token = req.header('x-auth');
    if (!token) {
        return res.status(401).send('No token provided');
    }
    var user = jwt.decode(token, secrets.jwt);

    Album.findById(req.params.id, function (err, album) {
        if (album.creator !== user.username) {
            return res.status(401).send('Someone else owns this album');
        }

        album.remove(function () {
            if (album.public) {
                sockets.broadcast('removed album', album);
            }

            return res.send();
        });

    });
});

module.exports = router;
