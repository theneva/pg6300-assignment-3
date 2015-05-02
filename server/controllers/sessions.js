var router = require('express').Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var secrets = require('../secrets');

var User = require('../models/user');

router.post('/', function(req, res) {
    var loginAttempt = req.body;

    User.findOne({username: loginAttempt.username}, function(err, user) {
        if (!user) {
            return res.status(404).send('No such user');
        }

        if (bcrypt.compareSync(loginAttempt.password, user.passwordHash)) {
            return res.json({
                token: jwt.encode(user, secrets.jwt),
                user: user
            });
        }
    });
});

module.exports = router;
