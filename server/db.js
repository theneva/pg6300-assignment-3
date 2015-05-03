var mongoose = require('mongoose');

var url = process.env.MONGOLAB_URI || 'mongodb://localhost/assignment3';

mongoose.connect(url, function() {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;
