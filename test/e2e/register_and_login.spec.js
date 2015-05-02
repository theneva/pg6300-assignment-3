var expect = require('chai').expect;

var util = require('./util');

describe('register, login, and log out', function () {
    it('should register a new user and be logged in', function () {
        var loggedInUsername = util.loginAndGetUsername();

        // the user should be logged in and on the home page
        element(by.binding('currentUser.username')).getText().then(function (foundUsername) {
            expect(foundUsername).to.equal(loggedInUsername);
        });
    });

    it('should log out and be redirected to register page', function () {
        var username = util.loginAndGetUsername();

        element(by.css('.logout')).click();

        browser.getCurrentUrl().then(function (url) {
            expect(url).to.equal('http://localhost:7777/#/register');
        });

        element(by.css('.username')).isPresent().then(function (present) {
            expect(present).to.be.false;
        });
    });

    it('should log in as a user, then log out and in as another user', function () {
        var username = util.loginAndGetUsername();

        // we already know that the correct username is displayed on first login, so just log back out
        element(by.css('.logout')).click();

        // we have been redirected back to the login/register page as asserted by the previous test.
        // register->login should be the same as just logging in
        var secondUsername = util.loginAndGetUsername();

        // verify that we were redirected to the albums (home) page
        browser.getCurrentUrl().then(function (url) {
            expect(url).to.equal('http://localhost:7777/#/');
        });

        // verify that the correct (second) username is showing
        element(by.binding('currentUser.username')).getText().then(function (secondActualUsername) {
            expect(secondActualUsername).to.equal(secondUsername);
        });
    });
});
