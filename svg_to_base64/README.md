SVG to Base64
==========

Node script that takes an SVG and returns a base64 PNG string by performing the
following functions:

- Read SVG file from S3
- Manipulate the file
- Stream conversion to PNG
- Convert PNG buffer to base64

_Note that this will likely be converted to a more usable and generic example._

Installation
----------

This project requires that PhantomJS be running on your machine, then you can
install the dependencies:

```text
$ npm i
```

Usage
----------

Run the node script from the command-line

```text
$ node wayfinder_chart.js
```

And you will be returned with a base64 string.
