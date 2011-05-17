var sys = require('sys')
var markdown = require("markdown")

var PostProcessor = function (collector) {
  this.collector = collector

  this.markup = {}
  this.markup.mkd = function (data) {
    return markdown.parse(data)
  }
}

PostProcessor.prototype.process = function (item) {
  if (item.label() && this[item.label()]) {
    item = this[item.label()](item)
  }
  return this.default(item)
}

// TODO need extension off of the original file path
// for posts since we transform the output path
// this gets mangled
PostProcessor.prototype.posts = function (item) {
  if (this.markup[item.extension()]) {
    item.body = this.markup[item.extension()](item.body)
  }
  return item
}

// happens after all files are done being collected
PostProcessor.prototype.default = function (item) {
  // if it includes a reference to a template
  if (item.headers.template) {
    var template = this.collector.findByRelPath("_templates/" + item.headers.template)[0]

    if (template) {
      item.body = template.render(this.collector.context)
    }
  }
  return item
}

exports.PostProcessor = PostProcessor
