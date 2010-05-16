var assert = require("assert");
var sys = require("sys");

var minitest = require("../vendor/minitest.js/minitest");
var fs = require("../lib/_fs");

minitest.setupListeners();

minitest.context("_fs#walk", function () {
  this.assertion("it should call \"callback\" for ever file in the tree", function (test) {
    fs.walk("/home/aconbere/Projects/javascript", function(start, dirs, names) {
    });
    test.finished();
  });
});

minitest.context("_fs#walkSync", function () {
  this.assertion("it should call \"callback\" for ever file in the tree", function (test) {
    calls = [];
    fs.walkSync("/home/aconbere/Projects/javascript", function(start, dirs, names) {
      calls.push(start);
    });
    test.finished();
  });
});
