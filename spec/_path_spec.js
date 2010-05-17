var assert = require("assert");
var sys = require("sys");

var minitest = require("../vendor/minitest.js/minitest");
var path = require("../lib/_path");

minitest.setupListeners();

minitest.context("_path#abspath", function () {
  this.setup(function () {});

  this.assertion("it should convert . to the current directory", function (test) {
    assert.equal(path.abspath("."), process.cwd());
    assert.equal(path.abspath("./test/dir"), path.join(process.cwd(), "test/dir"));
    test.finished();
  });

  this.assertion("it should convert .. to the parrent directory", function (test) {
    assert.equal(path.abspath(".."), path.dirname(process.cwd()));
    assert.equal(path.abspath("../test/dir"), path.join(path.dirname(process.cwd()), "test/dir"));
    test.finished();
  });

  this.assertion("it should convert ~ to the home directory", function (test) {
    assert.equal(path.abspath("~"), path.join(process.env.HOME, ""));
    assert.equal(path.abspath("~/test/dir"), path.join(process.env.HOME, "test/dir"));
    test.finished();
  });

  this.assertion("it should not convert paths begining with /", function (test) {
    assert.equal(path.abspath("/x/y/z"), "/x/y/z");
    test.finished();
  });
});


minitest.context("_path#relativePath", function () {
  this.setup(function () {});

  this.assertion("it should return the relative path", function (test) {
    var rel = path.relativePath("/", "/test.js");
    assert.equal(rel, "test.js");

    var rel = path.relativePath("/home/aconbere", "/home/aconbere/Projects/javascript/test.js");
    assert.equal(rel, "Projects/javascript/test.js");

    test.finished();
  });

  this.assertion("it should take two equal paths and return \"\"", function (test) {
    var rel = path.relativePath("/test.js", "/test.js");
    assert.equal(rel, "");
    test.finished();
  });
});
