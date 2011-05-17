var fake = require("fake")
var Collector = require("../../lib/boxer/collector").Collector
var collector = new Collector()

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
