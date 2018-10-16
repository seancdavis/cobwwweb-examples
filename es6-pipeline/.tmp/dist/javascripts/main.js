var my_manifest_file = (function () {
  'use strict';

  class Hello {
    constructor(message) {
      this.message = message;
    }

    talk() {
      console.log(this.message);
    }

  }

  class World {
    constructor(message) {
      this.message = message;
    }

    talk() {
      console.log(this.message);
    }

  }

  var manifest = {
    Hello,
    World
  };

  return manifest;

}());
//# sourceMappingURL=main.js.map
