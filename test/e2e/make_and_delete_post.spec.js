var expect = require('chai').expect;

var util = require('./util');

describe('create, modify, and delete albums', function () {
    it('should make a post which becomes the first in the list', function () {
        var username = util.loginAndGetUsername();

        // find existing elements to verify that adding an item expands the list by one
        element.all(by.repeater('album in albums')).then(function (albums) {
            var albumCountBeforeInserting = albums.length;

            var randomAlbum = insertRandomAlbum();

            element.all(by.repeater('album in albums')).then(function (albums) {
                var albumCountAfterInserting = albums.length;

                expect(albumCountAfterInserting).to.equal(albumCountBeforeInserting + 1);

                // verify that the inserted element is first in the list
                var firstElement = albums[0];

                firstElement.element(by.binding('album.title')).getText().then(function (actualAlbumTitle) {
                    expect(actualAlbumTitle).to.equal(randomAlbum.title);
                });

                firstElement.element(by.binding('album.artist')).getText().then(function (actualArtistName) {
                    expect(actualArtistName).to.equal(randomAlbum.artist);
                });

                // also verify that the creator is set to the logged-in user's username
                firstElement.element(by.binding('album.creator')).getText().then(function (actualCreator) {
                    expect(actualCreator).to.equal(username);
                });
            });
        });
    });

    it('should insert and delete an album, and verify that it is no longer in the list', function () {
        var username = util.loginAndGetUsername();
        insertRandomAlbum();

        // we already know that the album is at the top of the list, so get that
        element.all(by.repeater('album in albums')).then(function (albumsBeforeDeletion) {
            var albumCountBeforeDeletion = albumsBeforeDeletion.length;

            var newAlbum = albumsBeforeDeletion[0];
            newAlbum.element(by.binding('album.title')).getText().then(function (albumTitle) {
                // click the delete button, which is the only one with class btn-danger
                newAlbum.element(by.css('.btn-danger')).click();

                element.all(by.repeater('album in albums')).then(function (albumsAfterDeletion) {
                    var albumCountAfterDeletion = albumsAfterDeletion.length;
                    expect(albumCountAfterDeletion).to.equal(albumCountBeforeDeletion - 1);

                    if (albumCountAfterDeletion === 0) {
                        return;
                    }

                    var firstAlbumAfterDeletion = albumsAfterDeletion[0];
                    firstAlbumAfterDeletion.element(by.binding('album.title')).getText().then(function (actualAlbumTitle) {
                        expect(actualAlbumTitle).to.not.equal(albumTitle);
                    });
                });
            });
        });
    });

    it('should create an album, publish it, and then make it private again', function () {
        var username = util.loginAndGetUsername();

        var randomAlbum = insertRandomAlbum();

        var firstAlbum = element.all(by.repeater('album in albums')).get(0);

        // just a quick verification that it is indeed the correct album
        firstAlbum.element(by.binding('album.title')).getText().then(function (actualTitle) {
            expect(actualTitle).to.equal(randomAlbum.title);
        });

        firstAlbum.element(by.binding('album.public')).getText().then(function(actualPublic) {
            // verify that an item is automatically private
            expect(actualPublic).to.equal('Private');

            // click the 'toggle status' button which is the only one with class btn-warning
            var toggleStatusButton = firstAlbum.element(by.css('.btn-warning'));
            toggleStatusButton.click();

            // verify that the status has been changed
            firstAlbum.element(by.binding('album.public')).getText().then(function (actualPublicAfterFirstToggle) {
                expect(actualPublicAfterFirstToggle).to.equal('Public');

                // click the button again to make the item private again
                toggleStatusButton.click();

                // verify that the status has been changed back to private
                firstAlbum.element(by.binding('album.public')).getText().then(function (actualPublicAfterSecondToggle) {
                    expect(actualPublicAfterSecondToggle).to.equal('Private');
                });
            });
        });
    });

    function insertRandomAlbum() {
        // insert an element; use guids to verify identity
        var randomAlbumTitle = util.guid();
        var randomArtistName = util.guid();

        element(by.model('newAlbum.title')).sendKeys(randomAlbumTitle);
        element(by.model('newAlbum.artist')).sendKeys(randomArtistName);
        element(by.css('.save-new-album')).click();

        return {
            title: randomAlbumTitle,
            artist: randomArtistName
        };
    }
});
