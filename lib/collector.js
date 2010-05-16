var fs = require('./_fs');

var Collector = function () {
  this.items = [];
};

Collector.prototype.walk = function () {
  fs.walkSync(start);
};
