var sys = require('sys');
var path = require('./_path');
var kiwi = require("kiwi");
var markdown = kiwi.require("markdown");

var markup = {};

markup[".mkd"] = function (body) {
  return markdown.parse(body);
};
  

var posts = function (post, collector) {
  var ext = path.extname(post.filePath);

  if (markup[ext]) {
    post.body = markup[ext](post.body);
  }

  collector.context.post = post.context();
  return post;
};

var def = function (item, collector) {
  if (item.headers.template) {
    var templates = collector.findByRelPath("_templates/" + item.headers.template);
    var template;

    if (templates.length > 0) {
      template = templates[0];
    }

    if (template) {
      item.body = template.render(collector.context);
    }
  }
  return item;
};

exports.posts = posts;
exports.def = def;
