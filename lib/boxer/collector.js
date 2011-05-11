var sys = require('sys')
var file = require('file')
var Item = require('./item').Item

var Collector = function (inputPath, outputPath, PreProcessor, PostProcessor, options) {
  this.inputPath = inputPath
  this.outputPath = outputPath
  this.preProcessor = new PreProcessor(this)
  this.postProcessor = new PostProcessor(this)
  this.options = options || {}

  this.context = {}
  this.items = []

  if (this.options.verbose) sys.puts("processing: " + inputPath)
}

Collector.prototype.ignoredName = function (name) {
  // Files with filenames that start with . or _ are not processed
  return (name[0] == "." || name[0] == "_")
}

Collector.prototype.buildItem = function (name, startDir) {
  var filePath = file.path.join(startDir, name)
  var item = new Item(this.inputPath, filePath, { verbose: this.options.verbose })
  return item
}

Collector.prototype.collect = function () {
  if (this.options.verbose) sys.puts("running collect")

  var that = this

  file.walkSync(this.inputPath, function (startDir, dirs, fileNames) {

    fileNames.filter(function (name) {
      return !that.ignoredName(name)
    }).forEach(function (name) {
      var item = that.buildItem(name, startDir)
      item.parseFile()
      this.preProcessor[item.label](item)
      that.items.push(item)
    })
  })
}

Collector.prototype.transformItem = function (item) {
  // calls label specific output handlers
  if (item.label() && this.postProcessor[item.label]) {
    this.postProcessor[item.label](item)
  }

  // post processing handler
  if (this.postProcessor.default) {
    this.postProcessor.default(item)
  }

  return item
}

Collector.prototype.processFiles = function () {
  if (this.options.verbose) sys.puts("Processing Files")

  var that = this
  this.items = this.items.map(function (item) {
    return that.transformItem(item)
  })
}

Collector.prototype.findByLabel = function (label) {
  return this.items.filter(function (i) {
    return i.label() == label
  })
}

Collector.prototype.findByRelPath = function (relPath) {
  return this.items.filter(function (i) {
    return i.relativePath() == relPath
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
