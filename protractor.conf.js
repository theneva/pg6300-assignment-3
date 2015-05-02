module.exports.config = {
    framework: 'mocha',
    specs: [
        'test/e2e/**/*.spec.js'
    ], onPrepare: function() {
        process.env.PORT = 7777;
        require('./server/server.js');
    }
};
