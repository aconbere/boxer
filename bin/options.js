var sys = require('sys');
var path = require('path');
var optparse = require('optparse');
var file = require('file/main');

var options = { "input": null
              , "output": null
              , "verbose": false
              };

var switches = [ ['-h', '--help', 'Shows help sections']
               , ['-v', '--verbose', 'Verbose Output']
               ];

var parser = new optparse.OptionParser(switches);
var banner = 'boxer input output [-vh]';
var description =
"Boxer is a tool to transform text files from one directory to another.\n" +
"It provides a set of simple pieces to collect, and process files, with\n" +
"reasonable defaults for what filters to apply based on directory names";

parser.on('help', function() {
  sys.puts(banner + "\n\n" + description);
  process.exit();
});

parser.on(2, function(val) {
  val = file.path.join(process.cwd(), val);
  path.exists(val, function(exists) {
    if(!exists) {
      sys.puts("Input path " + val + " does not exist");
      parser.halt();
    }
  });
  options.input = val;
});

parser.on(3, function(val) {
  options.output = file.path.join(process.cwd(), val);
});

parser.on('verbose', function() {
  options.verbose = true;
});

parser.parse(process.argv);

if (!options.input || !options.output) {
  sys.puts(banner);
  process.exit();
}

exports.options = options;
exports.parser = parser;
