var sys = require('sys');
var kiwi = require('kiwi');
var path = require('path');
var dir = require('./dir');


var optparse = kiwi.require('optparse');

var options = { "input": null
              , "output": null
              , "verbose": false
              };

var switches = [ ['-h', '--help', 'Shows help sections']
               , ['-v', '--verbose', 'Verbose Output']
               ];

var parser = new optparse.OptionParser(switches);
var banner = 'boxer input output [-vh]';

parser.on('help', function() {
  sys.p(banner);
  process.exit();
});

parser.on(2, function(val) {
  val = dir.path.join(process.cwd(), val);
  path.exists(val, function(exists) {
    if(!exists) {
      sys.puts("Input path " + val + " does not exist");
      parser.halt();
    }
  });
  options.input = val;
});

parser.on(3, function(val) {
  options.output = dir.path.join(process.cwd(), val);
});

parser.on('verbose', function() {
  options.verbose = true;
});

parser.parse(process.argv);

if (!options.input || !options.output) {
  sys.puts("both input and output must be given\n" + banner);
  process.exit();
}

exports.options = options;
exports.parser = parser;
