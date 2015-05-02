var db = require('../db');

var Album = db.model('Album', {
    title: String,
    artist: String,
    created: {type: Date, default: Date.now},
    creator: String,
    public: Boolean
});

module.exports = Album;
