var fake = require("fake")

var Collector = require("../../lib/boxer/collector").Collector
var collector = new Collector()

exports.test_collector_ignoredName = function (test) {
  Collector.ignoredPrefixes.map(function (prefix) {
    test.equal(true, collector.ignoredName(prefix + "anything"))
  })
  test.done()
}

exports.test_collector_filterIgnoredNames = function (test) {
  test.deepEqual([], collector.filterIgnoredNames([]))
  test.done()
}
