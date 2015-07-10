# Windowify

Allows regular JavaScript files to expose global variables and functions when bundled with Browserify.

We can find old code written this way:

* jquery.js:
  ```javascript
  function jQuery(selector) {
    /* ... */
  }
  ```

* test.js:
  ```javascript
  var $element = jQuery('#some-element');
  ```

When we bundle the file with the `jQuery` definition, we loose the global reference to jQuery because it is no longer declared in the top level scope:

```bash
browserify jquery.js -o jquery.bundled.js
```

* jquery.bundled.js:

  ```javascript
  /* PREAMBLE */
  })({
    1: [
      function(require, module, exports) {
        // jQuery is not global now!
        function jQuery(selector) {
          /* ... */
        }
      }, {}
    ]
  }, {}, [1]);
  ```

This module transforms those files exposing those variables to window:

```bash
browserify jquery.js -t windowify -o jquery.bundled.js
```

* jquery.bundled.js:

  ```javascript
  /* PREAMBLE */
  })({
    1: [
      function(require, module, exports) {
        (function(window) {
        function jQuery(selector) {
          /* ... */
        }
        // jQuery is global again!
        window.jQuery = exports.jQuery = jQuery;
        }).call(window, window);
      }, {}
    ]
  }, {}, [1]);
  ```

It also sets `window` as the context of the code (for code setting global variables to `this`).

## Installation

```bash
npm install windowify --save-dev
```

## Usage

Like any other browserify transform, you can use in 3 ways:

* Adding the configuration to the `package.json`:

```json
{
  "browserify": {
    "transform": [
      ["windowify", {"files": "**/jquery.js", "debug": true}]
    ]
  }
}
```

* Command-line usage:

```bash
browserify entry-point.js -t [ windowify **/jquery.js --debug ] -o entry-point.bundle.js
```

* Programmatic usage:

```javascript
var b = browserify('entry-point.js');
b.transform('windowify', {files: '**/jquery.js', debug: true}]);
```

## Contribute

1. Fork it: `git clone https://github.com/rubennorte/windowify.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Check the build: `npm run build`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
