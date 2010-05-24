var sys = require('sys');
var dir = require('./dir');
var Item = require('./item').Item;

var Collector = function (input, output, inputHandlers, outputHandlers, options) {

  this.input = input;
  this.output = output;

  this.inputHandlers = inputHandlers || {};
  this.outputHandlers = outputHandlers || {};

  this.options = options || {};

  if(this.options.verbose) sys.puts("processing: " + input);

  this.context = {};
  this.items = [];
};

Collector.prototype.ignored = function (name) {
  return (name[0] == "." || name[0] == "_");
};

Collector.prototype.collect = function () {
  if (this.options.verbose) sys.puts("running collect");

  var that = this;

  dir.walkSync(this.input, function (startDir, dirs, names) {
    var relativePath = dir.path.relativePath(that.input, startDir);
    var label = null;

    if (relativePath[0] == ".") {
      return false;
    } else if (relativePath[0] == "_") {
      label = relativePath.split("/").shift().slice(1);
    }

    var newItems = names.filter(function (name) {
      return !that.ignored(name);
    }).map(function (name) {
      var filePath = dir.path.join(startDir, name);
      var item = new Item(that.input, filePath, label, that.options);

      if (that.inputHandlers[label]) {
        item = that.inputHandlers[label](item, that);
      }
      return item;
    });
    that.items = that.items.concat(newItems);
  });
};

Collector.prototype.process = function () {
  if (this.options.verbose) sys.puts("running process");

  var that = this;
    
  for (var k in this.outputHandlers) {
    this.context[k] = this.findByLabel(k);
  };

  this.items = this.items.map(function (item) {
    // pre processing handler
    if (that.outputHandlers.preProcessing) {
      if (that.options.verbose) sys.puts("running preProcessing");
      that.outputHandlers.preProcessing(item, that);
    }

    // calls label specific output handlers
    if (item.label && that.outputHandlers[item.label]) {
      if (that.options.verbose) sys.puts("running outputHandlers for " + item.label);
      that.outputHandlers[item.label](item, that);
    }

    // post processing handler
    if (that.outputHandlers.postProcessing) {
      if (that.options.verbose) sys.puts("running postProcessing");
      that.outputHandlers.postProcessing(item, that);
    }

    return item;
  });
};

Collector.prototype.findByLabel = function (label) {
  return this.items.filter(function (i) {
    return i.label == label;
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
  this.collect();
  this.process();
  this.publish();
};

exports.Collector = Collector;
