var sys = require('sys');
var fs = require('./_fs');
var path = require('./_path');

var Item = require('./item').Item;

var Collector = function (input, output, namespaces, processors) {
  sys.puts("processing: " + input);

  this.input = input;
  this.output = output;

  this.namespaces = namespaces || {};
  this.processors = processors || {};

  this.context = {};
  this.items = [];
};

Collector.prototype.ignored = function (name) {
  return (name[0] == "." || name[0] == "_");
};

Collector.prototype.walk = function () {
  var that = this;

  fs.walkSync(this.input, function (startDir, dirs, names) {
    var relativePath = path.relativePath(that.input, startDir);
    var namespace = null;

    if (relativePath[0] == ".") {
      return false;
    } else if (relativePath[0] == "_") {
      namespace = relativePath.split("/").shift().slice(1);
    }

    var newItems = names.filter(function (name) {
      return !that.ignored(name);
    }).map(function (name) {
      var filePath = path.join(startDir, name);
      var item = new Item(that.input, filePath, namespace);

      if (that.namespaces[namespace]) {
        item = that.namespaces[namespace](item);
      }
      return item;
    });
    that.items = that.items.concat(newItems);
  });
};

Collector.prototype.process = function () {
  var that = this;
    
  for (var k in this.namespaces) {
    this.context[k] = this.findByNamespace(k);
  };

  this.items = this.items.map(function (item) {
    if (item.namespace && that.processors[item.namespace]) {
      that.processors[item.namespace](item, that);
    }

    // def is the default processor
    if (that.processors.def) {
      that.processors.def(item, that);
    }

    return item;
  });
};

Collector.prototype.findByNamespace = function (namespace) {
  return this.items.filter(function (i) {
    return i.namespace == namespace;
  });
};

Collector.prototype.findByRelPath = function (relPath) {
  return this.items.filter(function (i) {
    return i.relativePath == relPath;
  });
};

Collector.prototype.publish = function () {
  sys.puts("publishing to: " + this.output);
  var that = this;
  this.items.forEach(function (item) {
    item.write(that.output);
  });
};

Collector.prototype.run = function () {
  this.walk();
  this.process();
  this.publish();
};

exports.Collector = Collector;
