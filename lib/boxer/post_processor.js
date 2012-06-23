var util = require('util')
var merge = require("./utils").merge

var PostProcessor = function (collector) {
  this.collector = collector
}

PostProcessor.prototype.process = function (item) {
  if (item.label() && this[item.label()]) {
    item = this[item.label()](item)
  }
  return this.default(item)
}

// happens after all files are done being collected
PostProcessor.prototype.default = function (item) {
  // if it includes a reference to a template
  if (item.headers.template) {
    var template = this.collector.findByRelPath("_templates/" + item.headers.template)[0]

    if (template) {
      item.body = template.render(merge( this.collector.context()
                                       , item.context() ))
    }
  }
  return item
}

exports.PostProcessor = PostProcessor
