var sys = require('sys');
var optparse = require('./options');
var Collector = require('./collector').Collector;
optparse.parser.parse(process.argv);

var options = optparse.options
var collector = new Collector();
collector.walk(options.input);
collector.process();
sys.p(collector);
