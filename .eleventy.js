
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItFootnote = require('markdown-it-footnote');

module.exports = function(eleventyConfig) {
  // Copy the `imges` and `css` folders to the output
  eleventyConfig.addPassthroughCopy('assets');

  // Copy PDF files with the articles
  eleventyConfig.addPassthroughCopy('articles/**/*.pdf');

  // Markdown
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  })
  .use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#'
  })
  .use(markdownItFootnote);

  markdownLibrary.renderer.rules.footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString();
    if (tokens[idx].meta.subId > 0) {
      n += ":" + tokens[idx].meta.subId;
    }
    return n;
  };
  eleventyConfig.setLibrary('md', markdownLibrary);

  // Create and add the sort filter
  function sortByIndex(values) {
    let vals = [...values]
    return vals.sort((a, b) => Math.sign(a.data.index - b.data.index))
  }
  eleventyConfig.addFilter('sortByIndex', sortByIndex);
};