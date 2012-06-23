var util = require('util')
var optparse = require('optparse')
var path = require('path')
var file = require('file')
var fs = require('fs')
var yaml = require("yaml")
var boxer = require("../lib/boxer")

var options = { "input": null
              , "output": null
              , "verbose": false
              }

var switches = [ ['-h', '--help', 'Shows help sections']
               , ['-v', '--verbose', 'Verbose Output']
               ]

var parser = new optparse.OptionParser(switches)
var banner = 'boxer input output [-vh]'
var description =
"Boxer is a tool to transform text files from one directory to another.\n" +
"It provides a set of simple pieces to collect, and process files, with\n" +
"reasonable defaults for what filters to apply based on directory names"

parser.on('help', function() {
  util.puts(banner + "\n\n" + description)
  process.exit()
})

parser.on(2, function(inputPath) {
  inputPath = file.path.join(process.cwd(), inputPath)
  path.exists(inputPath, function(exists) {
    if(!exists) {
      util.puts("Input path " + inputPath + " does not exist")
      parser.halt()
    }
  })
  options.input = inputPath
})

parser.on(3, function(outputPath) {
  options.output = file.path.join(process.cwd(), outputPath)
})

parser.on('verbose', function() {
  options.verbose = true
})

parser.parse(process.argv)

if (!options.input || !options.output) {
  util.puts(banner)
  process.exit()
}

var configPath = path.join(options.input, "_config.yml")
try {
  boxer.utils.merge(options, yaml.eval(fs.readFileSync(configPath, "utf8")))
} catch (e) {}

exports.options = options
