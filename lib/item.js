var fs = require("fs");
var sys = require("sys");
var path = require("path");
var file = require("file/main");
var yaml = require("yaml");

var Item = function (origin, filePath, label, options) {
  this.options = options || {};

  if (this.options.verbose) {
    sys.puts("New Item: " + filePath + " label: " + label);
  }

  this.origin = origin;
  this.filePath = filePath;
  this.relativePath = file.path.relativePath(origin, filePath);
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
    var outfile = file.path.join(output, this.outputPath);
    var that = this;
    file.mkdirs(path.dirname(outfile), 0777, function (err) {
      if (err) {
        sys.puts(err);
      } else {
        fs.writeFile(outfile, that.body, function (err) {
          if (err) {
            sys.puts(err);
          } else {
            if (that.options.verbose) sys.puts("publishing: " + that.outputPath);
          }
        });
      }
    });
  }
};

exports.Item = Item;
