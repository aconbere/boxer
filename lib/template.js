var fs = require('./_fs');
var sys = require('sys');

var mustache = require("../vendor/mustache.js/mustache");

var Template = function (filePath) {
  this.filePath = filePath;
  this.template = fs.readFileSync(this.filePath);
};

Template.prototype.render = function (context) {
  return mustache.to_html(this.template, context);
};

exports.Template = Template;
