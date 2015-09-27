function formatArguments(arg) {
	var len = arg.length;
	var ret = new Array(len);
	for (var i = 0; i < len; i++) {
		ret[i] = arg[i];
	}
	return ret;
}

var Promise = require("bluebird");
var phantom = require('phantom');
module.exports = {
	create: phantom.create,
	createAsync: function () {
		var argu = formatArguments(arguments);
		var resolver = Promise.defer();
		argu.push(function (arg1, arg2) { // I can't know what the argument means.

			if (arg1 === null) {
				resolver.reject.call(resolver, arg2); // cb(null, err);
				return;
			}
			// cb(phantom, null)
			// Now arg1 means phantom object.
			var phantomObject = arg1;
			promisify(phantomObject, true);
			resolver.resolve.call(resolver, phantomObject);

			function promisify(object, isPhantomRoot) {
				for (var key in object) {
					(function (key, asyncKey) {
						object[asyncKey] = function () {
							var resolver = Promise.defer();
							var argu = formatArguments(arguments);
							argu.push(function () {
								var ret = {};
								ret.ret = formatArguments(arguments);
								if (isPhantomRoot) { // Promisify `page` object here.
									promisify(ret.ret[0], false);
									ret.page = ret.ret[0];
								} else {
									ret.page = object; // Phantomjs -> page
								}
								ret.phantom = phantomObject; // Phantomjs
								resolver.resolve(ret); // Callback arguments
							});

							object[key].apply(object, argu);
							return resolver.promise;
						}
					})(key, key + "Async");
				}
			}


		})
		phantom.create.apply(phantom.create, argu);
		return resolver.promise;
	}
}
