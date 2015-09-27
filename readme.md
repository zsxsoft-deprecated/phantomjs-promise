Phantomjs-promise
===========================

This's a library that promisify [phantomjs-node](https://github.com/sgentle/phantomjs-node). You don't need to install either [phantomjs-node](https://github.com/sgentle/phantomjs-node) nor [phantomjs](https://github.com/ariya/phantomjs). Require it, then it will Promises/A+ compliant.

Based on bluebird.

## Usage
```javascript
var phantom = require("phantomjs-promise");
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
});
```


## Test
```bash
mocha
```


## License
The MIT License