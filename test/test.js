var phantom = require("../");
var Promise = require("bluebird");
var path = require("path");
var fs = Promise.promisifyAll(require("fs"));
var sizeOf = require('image-size');
var assert = require("assert");

var saveFileName = path.join(__dirname, './test.png');

describe('phantom', function () {
	it('Should run without error', function (done) {
		phantom.createAsync().then(function (phantom) {
			return phantom.createPageAsync();
		}).then(function (objects) {
			return objects.page.setAsync('viewportSize', {
				width: 100,
				height: 100
			});
		}).then(function (objects) {
			return objects.page.openAsync("./test/test.html");
		}).then(function (objects) {
			if (objects.ret[0] != "success") {
				throw objects.ret[0].status;
			}
			return objects.page.renderAsync(saveFileName);
		}).then(function (objects) {
			objects.page.close();
			objects.phantom.exit();

			var dimensions = sizeOf(saveFileName);
			assert.equal(dimensions.width, 100);
			assert.equal(dimensions.height, 100);
			return fs.unlinkAsync(saveFileName);
		}).then(done);
	});

});
