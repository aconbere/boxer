var sys = require('sys')
var file = require('file')
var Item = require('./item').Item
var Utils = require('./utils')

var Collector = function (projectPath, outputPath, PreProcessor, PostProcessor, options) {

  this.projectPath = projectPath
  this.outputPath = outputPath
  this.preProcessor = PreProcessor ? new PreProcessor(this) : {}
  this.postProcessor = PostProcessor ? new PostProcessor(this) : {}
  this.options = options || {}

  this.items = []

  if (this.options.verbose) { sys.puts("processing: " + projectPath) }
}

Collector.ignoredPrefixes = [".", "_"]

Collector.prototype.context = function () {
  return Utils.merge({ items: this.items}, this.options)
}

Collector.prototype.preProcess = function (item) {
  return this.preProcessor.process(item);
}

Collector.prototype.postProcess = function (item) {
  return this.postProcessor.process(item)
}


Collector.prototype.collect = function () {
  if (this.options.verbose) sys.puts("running collect")

  var that = this

  file.walkSync(this.projectPath, function (currentDir, _dirs, fileNames) {
    that.collectFile(currentDir, fileNames)
  })
}

Collector.prototype.collectFile = function (currentDir, fileNames) {
  var that = this;
  this.filterIgnoredNames(fileNames).forEach(function (fileName) {
    that.items.push(that.buildItem(file.path.join(currentDir, fileName)))
  })
}

Collector.prototype.filterIgnoredNames = function (names) {
  var that = this;
  return names.filter(function (name) {
    return !that.ignoredName(name)
  })
}

Collector.prototype.ignoredName = function (name) {
  // Files with filenames that start with . or _ are not processed
  return (Collector.ignoredPrefixes.indexOf(name[0]) > -1)
}

// @filePath : the full path to the item
Collector.prototype.buildItem = function (filePath) {
  var item = new Item(filePath, this.projectPath, { verbose: this.options.verbose })
  item.parseFile()
  this.preProcess(item)
  return item
}

Collector.prototype.processFiles = function () {
  if (this.options.verbose) sys.puts("Processing Files")

  var that = this
  this.items = this.items.map(function (item) {
    return that.postProcess(item)
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
