var Item = require("../lib/boxer/item").Item

exports.test_Item_relativePath = function (test) {
  var item = new Item("/test")
  test.equal("long/path", item.relativePath("/test/long/path"))
  test.done()
}

exports.test_Item_extension = function (test) {
  var item = new Item("/test", "file/path.mkd")
  test.equal(".mkd", item.extension())
  test.done()
}
exports.test_Item_mapping_should_return_extension_if_supported = function (test) {
  var item = new Item("/test", "file/path.mkd")
  test.equal(".mkd", item.mapping())
  test.done()
}

exports.test_Item_mapping_should_return_simple_mapping_if_extension_not_found = function (test) {
  var item = new Item("/test", "file/path.xmkd")
  test.equal(Item.SIMPLE_MAPPING, item.mapping())
  test.done()
}

exports.test_Item_encoding_should_return_binary_for_unsupported_extension = function (test) {
  var item = new Item("/test", "file/path.xmkd")
  test.equal("binary", item.encoding())
  test.done()
}

exports.test_Item_encoding_should_return_utf8_for_supported_extension = function (test) {
  var item = new Item("/test", "file/path.mkd")
  test.equal("utf8", item.encoding())
  test.done()
}

exports.test_Item_context = function (test) {
  var item = new Item()
  item.body = "testBody"
  item.headers = { x: "y" }
  test.deepEqual({ x: "y", body: "testBody"}, item.context())
  test.done()
}

exports.test_Item_outputFile = function (test) {
  var item = new Item()
  item.outputPath = "test"
  test.equal("/directory/path/test", item.outputFile("/directory/path")) 
  test.done()
}

