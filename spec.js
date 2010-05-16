var sys = require("sys");
var _path = require("./lib/_path");

sys.p(_path.abspath("~b"));
sys.p(_path.abspath("./b"));
sys.p(_path.abspath("/ext"));
