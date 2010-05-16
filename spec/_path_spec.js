var assert = require("assert");
var sys = require("sys");

var minitest = require("../vendor/minitest.js/minitest");
var path = require("../lib/_path");

minitest.setupListeners();

minitest.context("_path#abspath", function () {
  this.setup(function () {});

  this.assertion("it should convert . to the current directory", function (test) {
    assert.ok(path.abspath(".") == process.cwd());
    assert.ok(path.abspath("./test/dir") == path.join(process.cwd(), "test/dir"));
    test.finished();
  });

  this.assertion("it should convert .. to the parrent directory", function (test) {
    assert.ok(path.abspath("..") == path.dirname(process.cwd()));
    assert.ok(path.abspath("../test/dir") == path.join(path.dirname(process.cwd()), "test/dir"));
    test.finished();
  });

  this.assertion("it should convert ~ to the home directory", function (test) {
    assert.ok(path.abspath("~") == path.join(process.env.HOME, ""));
    assert.ok(path.abspath("~/test/dir") == path.join(process.env.HOME, "test/dir"));
    test.finished();
  });

  this.assertion("it should not convert paths begining with /", function (test) {
    assert.ok(path.abspath("/x/y/z") == "/x/y/z");
    test.finished();
  });
});

