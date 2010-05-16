var sys = require('sys');

var EventEmitter = require('events').EventEmitter;

// Example useage
//
// var syn = require('syn').syn;
// var e = syn(fs.stat, ["/"], function (err, stat) {});
//
// e.addListener("started", function () {
//   console.log("started");
// });
//
// e.addListener("finished", function () {
//   console.log("finished");
// });

var syn = function (func, args, callback) {
  var emitter = new EventEmitter();
  var counter = 0;

  var _wrapper = function() {
    emitter.emit("started");
    counter++;

    callback.apply(null, arguments);

    counter--;

    if (counter == 0) {
      emitter.emit("finished");
    }
  };

  args.push(_wrapper);
  func.apply(null, args);

  return emitter;
};

exports.syn = syn;
