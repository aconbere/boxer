#!/usr/bin/env node

var sys = require('sys')
var options = require('./options').options
var PostProcessor = require("../lib/post_processor").PostProcessor
var PreProcessor = require("../lib/pre_processor").PreProcessor
var Collector = require('../lib/boxer/collector').Collector

var collector = new Collector( options.input
                             , options.output
                             , PostProcessor
                             , PreProcessor
                             , options
                             )
collector.run()
