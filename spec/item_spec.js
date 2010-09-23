var assert = require("assert");
var sys = require("sys");

var minitest = require("minitest");

var item = require("../lib/item");

minitest.setupListeners();

minitest.context("item#popHeaders", function () {
  this.setup(function () {
    this.data = "abcd\n\nefgh\n\nijkl";
    this.item = new item.Item();
  });

  this.assertion("it should split content on first \\n\\n", function (test) {
    var headers = this.item.popHeaders(this.data)
    assert.equal(headers[0], "abcd");
    assert.equal(headers[1], "efgh\n\nijkl");
    test.finished();
  });
});
