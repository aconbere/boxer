var fake = require("fake")
var file = require("file")
var item = require("../../lib/boxer/item")
var Collector = require("../../lib/boxer/collector").Collector
var collector = new Collector()


exports.test_collector_collect = function (test) {
  fileFake = fake.create()
  fileFake.expect(file, "walkSync")
          .times(1)
  collector.collect()
  fileFake.verify()
  test.done()
}
