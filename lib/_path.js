var path = require('path');
var sys = require('sys');


path.abspath = function (to) {
  var from;
  switch (to.charAt(0)) {
    case "~": from = process.env.HOME; to = to.substr(1); break
    case "/": from = ""; break
    default : from = process.cwd(); break
  }
  return path.join(from, to);
}

path.relativePath = function (base, compare) {
  base = base.split("/");
  compare = compare.split("/");

  if (base[0] == "") {
    base.shift();
  }

  if (compare[0] == "") {
    compare.shift();
  }

  var l = compare.length;

  for (var i = 0; i < l; i++) {
    if (!base[i] || (base[i] != compare[i])) {
      return compare.slice(i).join("/");
    }
  }

  return ""
};

for (k in path) {
  exports[k] = path[k];
}

exports.join = function (head, tail) {
  if (head == "") {
    return tail;
  } else {
    return path.join(head, tail);
  }
};

