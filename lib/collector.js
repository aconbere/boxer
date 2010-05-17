var sys = require('sys');
var fs = require('./_fs');
var path = require('./_path');

var Item = require('./item').Item;
var Template = require('./template').Template;

var Collector = function () {
  this.config = {};
  this.items = {};
  this.templates = {};
  this.output = {};
};

Collector.prototype.walk = function (start) {
  var that = this;

  fs.walkSync(start, function (startDir, dirs, names) {
    var relativePath = path.relativePath(start, startDir);

    var obj = Item;
    var collection = that.items;

    if (relativePath.indexOf("_templates") === 0) {
      obj = Template;
      collection = that.templates;
    } else if (relativePath[0] == ".") {
      return false;
    }

    names.forEach(function (name) {
      if (name[0] == "." || name[0] == "_") {
        return false;
      }

      collection[path.join(relativePath, name)] = new obj(path.join(startDir, name));
    });
  });
};

Collector.prototype.process = function () {
  for (var k in this.items) {
    var item = this.items[k];

    var template = this.templates[item.template()];

    if (template) {
      var context = this.config;
      context.posts = [item.context()];
      this.output[k] = template.render(context);
    }
  }
};

Collector.prototype.publish = function (out) {
  for (var k in this.output) {
    fs.writeFile(path.join(out, k), this.output[k]);
  }
};

exports.Collector = Collector;
