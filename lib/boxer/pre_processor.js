var path = require('path')
var sys = require('sys')
var mustache = require("mustache")

var PreProcessor = function (collector) {
  this.collector = collector
}

PreProcessor.prototype.process = function (item) {
  if (item.label() && this[item.label()]) {
    return this[item.label()](item)
  }
}

// Takes an Item from the input chain and adds a render function
// which takes the body of the item and renders it as a mustache
// template.
PreProcessor.prototype.templates = function (item) {
  // don't publish templates
  item.publish = false

  // we create the item.render method such that instead of
  // handing back just the item body, we first parse it as mustache
  // and transform the contents.
  item.render = function (context) {
    // context is any extra details passed through the item
    // options etc.
    return mustache.to_html(this.body, context)
  }

  // it returns back an item not transformed
  return item;
}

PreProcessor.prototype.posts = function (item) {
  var published = new Date()

  // if the headers include a published date, override the current time
  if (item.headers.published) {
    var args = item.headers.published.split(/[-: ]/)
    if (args.length >= 3) {
      published = new Date(args[0], args[1], args[2])
    } else if (args.length >= 6) {
      published = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6])
    }
  }

  item.basename = path.basename(item.filePath, item.ext)
  item.publishPath = function () {
    return [ "posts"
           , published.getFullYear()
           , published.getMonth()
           , published.getDate()
           , item.basename
           , "index.html"
           ].join("/")
  }
  return item
}

exports.PreProcessor = PreProcessor
