var fs = require("fs");
var sys = require("sys");
var path = require("path");
var file = require("file/main");
var yaml = require("yaml");

var Item = function (origin, filePath, label, options) {
  this.options = options || {};

  // A boolean switch that lets us control wether a file is published or not
  this.publish = true;

  if (this.options.verbose) sys.puts("New Item: " + filePath + " label: " + label);

  this.origin = origin;
  this.filePath = filePath;
  this.ext = path.extname(this.filePath);
  // If we don't support mapping this file type don't fuck with it
  // just copy it.
  this.simpleMap = ( Item.supportedFileTypes.indexOf(this.ext) < 0 );

  // it's a pretty good guess that if we don't support it the file is binary
  this.encoding = this.simpleMap ? "binary" : "utf8";
  this.relativePath = file.path.relativePath(origin, filePath);
  this.outputPath = this.relativePath;
  this.label = label;

  this.preProcess(this.filePath);
};

Item.supportedFileTypes = [ ".txt"
                          , ".mkd"
                          , ".css"
                          , ".yaml"
                          ]

Item.prototype.read = function (filePath) {
  return fs.readFileSync(filePath, this.encoding);
};

Item.prototype.parseHeaders = function (data) {
  var parsed = { "headers": {}
               , "body": ""
               };

  // Simple mappings are for binary files or groups of files
  // that we don't intend to proccess. It prevents us from 
  // mucking them up by attempting to split them
  if (this.simpleMap) {
    parsed.body = data;
    return parsed;
  } else {
    if (data) {
      // We assume that up until the first \n\n we can have header data
      var splits = data.split("\n\n");
      var header = splits.shift();

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
  var parsed = this.parseHeaders(this.read(filePath));
  this.headers = parsed.headers;
  this.body = parsed.body;
};

Item.prototype.context = function () {
  var context = this.headers;
  context.body = this.body;
  return context;
};

Item.prototype.write = function (output) {
  if (this.publish) {
    var outfile = file.path.join(output, this.outputPath);

    var that = this;
    file.mkdirs(path.dirname(outfile), 0755, function (err) {
      if (err) {
        sys.puts(err);
      } else {
        fs.writeFile(outfile, that.body, that.encoding, function (err) {
          if (err) {
            sys.puts(err);
          } else {
            if (that.options.verbose) {
              sys.puts("publishing: " + that.outputPath);
            }
          }
        });
      }
    });
  }
};

exports.Item = Item;
