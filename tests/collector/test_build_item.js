var fake = require("fake")
var file = require("file")
var item = require("../../lib/boxer/item")

// this has to happen before collector is imported
object = {}
var itemFake = fake.create()
itemFake.expect(object, "parseFile")

var ItemConstructorFake = fake.create()
ItemConstructorFake.expect(item, "Item")
                   .andReturn(object)

var Collector = require("../../lib/boxer/collector").Collector
var collector = new Collector()

exports.test_collector_buildItem = function (test) {
  var collectorFake = fake.create()
  collectorFake.expect(collector, "preProcess")

  collector.buildItem("n", "/test")
  test.done()
}
