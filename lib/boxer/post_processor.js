var sys = require('sys')
var markdown = require("markdown")

var PostProcessor = function (collector) {
  this.collector = collector

  this.markup = {}
  this.markup.mkd = function (data) {
    return markdown.parse(data)
  }
}

PostProcessor.prototype.posts = function (item, collector) {
  if (this.markup[item.ext]) {
    item.body = this.markup[item.ext](item.body)
  }
  return item
}

// happens after all files are done being collected
PostProcessor.prototype.default = function (item, collector) {
  // if it includes a reference to a template
  if (item.headers.template) {
    var templates = collector.findByRelPath("_templates/" + item.headers.template)
    var template = templates[0]

    if (template) {
      item.body = template.render(collector.context)
    }
  }
  return item
}
