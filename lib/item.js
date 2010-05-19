var fs = require("./_fs");
var sys = require("sys");
var path = require("_path");
var kiwi = require("kiwi");
var yaml = kiwi.require("yaml");

var Item = function (origin, filePath, namespace) {
  this.origin = origin;
  this.filePath = filePath;
  this.relativePath = path.relativePath(origin, filePath);
  this.outputPath = this.relativePath;
  this.namespace = namespace;

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
    var outfile = path.join(output, this.outputPath);
    var that = this;
    fs.mkdirs(path.dirname(outfile), 0777, function (err) {
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
