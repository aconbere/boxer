var sys = require('sys');
var markdown = require("markdown");

var markup = {};

markup[".mkd"] = function (body) {
  return markdown.parse(body);
};

exports.posts = function (item, collector) {
  if (markup[item.ext]) {
    item.body = markup[item.ext](item.body);
  }

  collector.context.post = item.context();
  return item;
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
