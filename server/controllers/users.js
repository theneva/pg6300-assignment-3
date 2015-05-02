var router = require('express').Router();
var bcrypt = require('bcrypt');

var User = require('../models/user');

router.post('/', function (req, res) {

    User.findOne({username: req.body.username}, function (err, user) {
        if (user) {
            return res.status(412).send('Username already exists');
        }

        var passwordHash = bcrypt.hashSync(req.body.password, 10);

        var newUser = new User({
            username: req.body.username,
            passwordHash: passwordHash
        });

        newUser.save(function () {
            return res.status(201).json(newUser);
        });
    });
});

module.exports = router;
