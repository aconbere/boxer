var fs = require("fs")
var sys = require("sys")
var path = require("path")
var file = require("file")
var yaml = require("yaml")
var merge = require("./utils").merge

var LABEL_IDENTIFIER = "_"
var CURRENT_DIRECTORY = "."

var Item = function (inputPath, filePath, options) {
  this.inputPath = inputPath
  this.filePath = filePath
  this.options = options || {}

  this.headers = {}
  this.body = ""
  // A boolean switch that lets us control wether a file is published or not
  this.publish = true

  if (this.options.verbose) sys.puts("New Item: " + filePath + " label: " + label)
}

Item.SIMPLE_MAPPING = "simple"
Item.HEADER_DELIMETER = "\n\n"


Item.supportedFileTypes = [ ".txt"
                          , ".mkd"
                          , ".css"
                          , ".yaml"
                          ]

Item.prototype.read = function () {
  return fs.readFileSync(this.filePath, this.encoding())
}

Item.prototype.label = function (filePath) {
  if (this.label) return this.label

  var relPath = this.relativePath()

  if (relPath[0] == CURRENT_DIRECTORY) {
    return ""
  } else if (relPath[0] == LABEL_IDENTIFIER) {
    this.label = relPath.split("/").shift().slice(1)
    return this.label
  }
}

Item.prototype.relativePath = function () {
  return file.path.relativePath(this.inputPath, this.filePath)
}

Item.prototype.mapping = function () {
  var extension = this.extension()

  if (Item.supportedFileTypes.indexOf(extension) > -1) {
    return extension
  } else {
    return Item.SIMPLE_MAPPING
  }
}

Item.prototype.encoding = function () {
  return (this.mapping() == Item.SIMPLE_MAPPING) ? "binary" : "utf8"
}

Item.prototype.extension = function () {
  return path.extname(this.filePath)
}

Item.prototype.parseHeaders = function (data) {
  var results = { headers: {}, body: "" }
  // We assume that up until the first \n\n is header data
  // this would be better as a regex
  var splitFile = data.split(Item.HEADER_DELIMETER)
  var fileHeader = splitFile.shift()

  try {
    results.headers = yaml.eval(fileHeader)
    results.body = splitFile.join(Item.HEADER_DELIMETER)
  } catch (e) {
    results.body = data
  }

  return results
}

Item.prototype.parseFile = function () {
  // Simple mappings are for binary files or groups of files
  // that we don't intend to proccess. It prevents us from 
  // mucking them up by attempting to split them
  var body = this.read()

  if (this.mapping() == Item.SIMPLE_MAPPING) {
    this.body = body
  } else {
    var parsed = this.parseHeaders(body)
    this.headers = parsed.headers
    this.body = parsed.body
  }
}

Item.prototype.context = function () {
  return merge({body: this.body}, this.headers)
}

Item.prototype.outputFile = function (directoryPath) {
  return file.path.join(directoryPath, this.outputPath)
}

Item.prototype.write = function (directoryPath) {
  var that = this
  var outputFile = this.outputFile(directoryPath)
  file.mkdirs(path.dirname(outputFile), 0755, function (err) {
    if (err) sys.puts(err); return false

    fs.writeFile(outputFile, that.body, that.encoding(), function (err) {
      if (err) sys.puts(err); return false
      if (that.options.verbose) sys.puts("publishing: " + that.outputPath)
    })
  })
}

exports.Item = Item
