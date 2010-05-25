var sys = require('sys');
var markdown = require("markdown");

var markup = {};

markup[".mkd"] = function (body) {
  return markdown.parse(body);
};
  

exports.posts = function (post, collector) {
  if (markup[post.ext]) {
    post.body = markup[post.ext](post.body);
  }

  collector.context.post = post.context();
  return post;
};

exports.postProcessing = function (item, collector) {
  if (item.headers.template) {
    var templates = collector.findByRelPath("_templates/" + item.headers.template);
    var template = templates[0];

    if (template) {
      item.body = template.render(collector.context);
    }
  }
  return item;
};