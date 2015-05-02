var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/assignment3', function() {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;
