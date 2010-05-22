var fs = require("fs");
var sys = require("sys");
var path = require("path");
var dir = require("./dir");
var yaml = require("yaml");

var Item = function (origin, filePath, label) {
  this.origin = origin;
  this.filePath = filePath;
  this.relativePath = dir.path.relativePath(origin, filePath);
  this.outputPath = this.relativePath;
  this.label = label;

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

Item.prototype.context = function () {
  var context = this.headers;
  context.body = this.body;
  return context;
};

Item.prototype.write = function (output) {
  if (this.outputPath) {
    var outfile = dir.path.join(output, this.outputPath);
    var that = this;
    dir.mkdirs(path.dirname(outfile), 0777, function (err) {
      if (err) {
        sys.puts(err);
      } else {
        fs.writeFile(outfile, that.body, function (err) {
          if (err) {
            sys.puts(err);
          } else {
            sys.puts("publishing: " + that.outputPath);
          }
        });
      }
    });
  }
};

exports.Item = Item;
