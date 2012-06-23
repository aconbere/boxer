#!/usr/bin/env node

var util = require('util')
var options = require('./options').options
var PostProcessor = require("../lib/boxer/post_processor").PostProcessor
var PreProcessor = require("../lib/boxer/pre_processor").PreProcessor
var Collector = require('../lib/boxer/collector').Collector

var collector = new Collector( options.input
                             , options.output
                             , PreProcessor
                             , PostProcessor
                             , options
                             )
collector.run()
