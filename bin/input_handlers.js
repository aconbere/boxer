var path = require('path');
var sys = require('sys');
var mustache = require("mustache");

exports.templates = function (template) {
  template.outputPath = false;
  template.render = function (context) {
    return mustache.to_html(this.body, context);
  };
  return template;
}

exports.posts = function (post) {
  var published;

  if (post.headers.published) {
    var args = post.headers.published.split(/[-: ]/);
    if (args.length >= 3) {
      published = new Date(args[0], args[1], args[2]);
    } else if (args.length >= 6) {
      published = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
  } else {
    published = new Date();
  }

  post.ext = path.extname(post.filePath);
  post.basename= path.basename(post.filePath, post.ext);
  post.outputPath = "posts/" + published.getFullYear() + "/"
                             + published.getMonth() + "/"
                             + published.getDate() + "/"
                             + post.basename + "/"
                             + "index.html";
  return post;
};
