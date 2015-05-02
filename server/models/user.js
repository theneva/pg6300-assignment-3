var db = require('../db');

var User = db.model('User', {
    username: String,
    passwordHash: String
});

module.exports = User;
