var fake = require("fake")
var file = require("file")
var item = require("../lib/boxer/item")

item.Item = function () { console.log("BLARGH") }
var Collector = require("../lib/boxer/collector").Collector

var collector = new Collector()

exports.test_collector_ignored_name = function (test) {
  test.equal(true, collector.ignoredName("."))
  test.equal(true, collector.ignoredName("_"))
  test.done()
}

exports.test_collector_buildItem = function (test) {
  object = {}
  var itemFake = fake.create()
  itemFake.expect(object, "parseFile")

  //var ItemConstructorFake = fake.create()
  //ItemConstructorFake.expect(item, "Item")
  //                   .andReturn(itemFake)

  var collectorFake = fake.create()
  collectorFake.expect(collector, "preProcess")

  collector.buildItem("n", "/test")

  itemFake.verify()
  ItemFake.verify()
  collectorFake.verify()

  test.done()
}

exports.test_collector_collectFile = function (test) {
  var names = ["a", "b", "c"]
  var startDir = "/test"
  var collectorFake = fake.create()
  collectorFake.expect(collector, "filterIgnoredNames")
               .andReturn(names)

  collectorFake.expect(collector, "buildItem")
               .times(3)

  collector.collectFile(startDir, names)

  collectorFake.verify()
  test.done()
}

exports.test_collector_collect = function (test) {
  fileFake = fake.create()
  fileFake.expect(file, "walkSync")
          .times(1)
  collector.collect()
  fileFake.verify()
  test.done()
}
//
//exports.test_collector_transformItem = function (test) {
//  test.done()
//}
//
//exports.test_collector_processFiles = function (test) {
//  test.done()
//}
