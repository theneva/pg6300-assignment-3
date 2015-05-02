module.exports.loginAndGetUsername = function () {
    browser.get('http://localhost:7777/#/register');

    var randomUsername = module.exports.guid();

    element(by.model('newUser.username')).sendKeys(randomUsername);
    element(by.model('newUser.password')).sendKeys('some test password');
    element(by.css('.register')).click();

    return randomUsername;
};

module.exports.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};
