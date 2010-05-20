var sys = require('sys');

var options = require('./options').options;
var Collector = require('./collector').Collector;
var inputHandlers = require("./input_handlers");
var outputHandlers = require("./output_handlers");

var collector = new Collector(options.input, options.output,
                              inputHandlers, outputHandlers);
collector.run();
