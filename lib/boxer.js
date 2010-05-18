var sys = require('sys');

var options = require('./options').options;
var Collector = require('./collector').Collector;
var namespaces = require("./namespaces");
var processors = require("./processors");

var collector = new Collector(options.input, options.output, namespaces, processors);
collector.run();
