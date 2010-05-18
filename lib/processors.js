var sys = require('sys');

var posts = function (post, collector) {
  collector.context.post = post.context();
  return post;
};

var def = function (item, collector) {
//  collector.context.posts = collector.context.posts || collector.findByNamespace("posts");
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
