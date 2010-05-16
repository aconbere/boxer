var path = require('path');

path.abspath = function (to) {
  var from;
  switch (to.charAt(0)) {
    case "~": from = process.env.HOME; to = to.substr(1); break
    case "/": from = ""; break
    default : from = process.cwd(); break
  }
  return path.join(from, to);
}

for (k in path) {
  exports[k] = path[k];
}
