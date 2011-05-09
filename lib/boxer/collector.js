var sys = require('sys')
var file = require('file')
var Item = require('./item').Item

var LABEL_IDENTIFIER = "_"
var CURRENT_DIRECTORY = "."

var Collector = function (inputPath, outputPath, preProcessors, itemTransformers, options) {
  this.inputPath = inputPath
  this.outputPath = outputPath
  this.preProcessors = preProcessors || {}
  this.itemTransformers = itemTransformers || {}
  this.options = options || {}

  this.context = {}
  this.items = []

  if (this.options.verbose) sys.puts("processing: " + inputPath)
}

Collector.prototype.ignoredName = function (name) {
  // Files with filenames that start with . or _ are not processed
  return (name[0] == "." || name[0] == "_")
}

Collector.prototype.getLabelRelativePath = function (relativePath) {
  return relativePath.split("/").shift().slice(1)
}

Collector.prototype.buildItem = function (name, label, startDir) {
  var filePath = file.path.join(startDir, name)
  var item = new Item(this.inputPath, filePath, label, { verbose: this.options.verbose
                                                       , preProcessor: this.preProcessors[label]
                                                       })
  return item
}

Collector.prototype.collect = function () {
  if (this.options.verbose) sys.puts("running collect")

  var that = this

  file.walkSync(this.inputPath, function (startDir, dirs, fileNames) {
    // consider putting relative path in Item, and letting label be determined there
    var relativePath = file.path.relativePath(that.inputPath, startDir)
    var label = null

    if (relativePath[0] == CURRENT_DIRECTORY) {
      return false
    } else if (relativePath[0] == LABEL_IDENTIFIER) {
      label = that.getLabelRelativePath(relativePath)
    }

    fileNames.filter(function (name) {
      return !that.ignoredName(name)
    }).forEach(function (name) {
      var item = that.buildItem(name, label, startDir)
      item.parseFile()
      item.preProcess()
      that.items.push(item)
    })
  })
}

Collector.prototype.transformItem = function (item) {
  // calls label specific output handlers
  if (item.label && this.itemTransformers[item.label]) {
    this.itemTransformers[item.label](item)
  }

  // post processing handler
  if (this.itemTransformers.postProcessing) {
    this.itemTransformers.postProcessing(item, this)
  }

  return item
}

Collector.prototype.processFiles = function () {
  if (this.options.verbose) sys.puts("Processing Files")

  for (var k in this.itemTransformers) {
    this.context[k] = this.findByLabel(k)
  }

  var that = this

  this.items = this.items.map(function (item) {
    return that.transformItem(item)
  })
}

Collector.prototype.findByLabel = function (label) {
  return this.items.filter(function (i) {
    return i.label == label
  })
}

Collector.prototype.findByRelPath = function (relPath) {
  return this.items.filter(function (i) {
    return i.relativePath == relPath
  })
}

Collector.prototype.publish = function () {
  if (this.options.verbose) sys.puts("publishing to: " + this.outputPath)
  var that = this
  this.items.forEach(function (item) {
    item.write(that.outputPath)
  })
}

Collector.prototype.run = function () {
  this.collect()
  this.processFiles()
  this.publish()
}

exports.Collector = Collector
