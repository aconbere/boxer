var fs = require("./_fs");
var sys = require("sys");
var path = require("_path");
var kiwi = require("kiwi");
var yaml = kiwi.require("yaml");

var Item = function (filePath) {
  this.filePath = filePath;
  this.preProcess(this.filePath);
};

Item.prototype.read = function (filePath) {
  return fs.readFileSync(filePath);
};

Item.prototype.parserHeaders = function (data) {
  var parsed = { "headers": {}
               , "body": ""
               };

  if (data) {
    var splits = data.split("\n\n");
    var header = splits.shift();

    if (header) {
      try {
        parsed.headers = yaml.eval(header);
        parsed.body = splits.join("\n\n");
      } catch (e) {
        parsed.body = data;
      }
    }
  }
  return parsed;
};

Item.prototype.preProcess = function (filePath) {
  var parsed = this.parserHeaders(this.read(filePath));
  this.headers = parsed.headers;
  this.body = parsed.body;
};

Item.prototype.process = function () {
};

Item.prototype.context = function () {
  var context = this.headers;
  context.body = this.body;
  return context;
};

Item.prototype.template = function () {
  return path.join("_templates", this.headers.template);
};

exports.Item = Item;
