var sys = require('sys');
var kiwi = require('kiwi');
var path = require('./_path');


var optparse = kiwi.require('optparse');

var options = { "input": "."
              , "output": "./out"
              , "verbose": false
              };

var switches = [ ['-h', '--help', 'Shows help sections']
               , ['-i', '--in FILE', 'Input Directory']
               , ['-o', '--out FILE', 'Output Directory']
               , ['-v', '--verbose', 'Verbose Output']
               ];

var parser = new optparse.OptionParser(switches);

parser.on('help', function() {
  sys.p('Help');
});

parser.on('in', function(name, val) {
  val = path.join(process.cwd(), val);
  path.exists(val, function(exists) {
    if(!exists) {
      sys.puts("Input path " + val + " does not exist");
      parser.halt();
    }
  });
  options.input = val;
});

parser.on('out', function(name, val) {
  val = path.join(process.cwd(), val);
  path.exists(val, function(exists) {
    if(!exists) {
      sys.puts("Output path " + val + " does not exist");
      parser.halt();
    }
  });
  options.output = val;
});

parser.on('verbose', function() {
  options.verbose = true;
});

exports.options = options;
exports.parser = parser;
