#!/usr/bin/env node

var sys = require('sys');

var options = require('./options').options;
var inputHandlers = require("./input_handlers");
var outputHandlers = require("./output_handlers");

var Collector = require('../lib/collector').Collector;

var collector = new Collector(options.input, options.output,
                              inputHandlers, outputHandlers);
collector.run();
