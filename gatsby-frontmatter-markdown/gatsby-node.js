const remark = require("remark")
const remarkHTML = require("remark-html")

// Use remark to convert markdown to HTML and return HTML as a string.
const processMarkdown = markdown =>
  remark()
    .use(remarkHTML)
    .processSync(markdown)
    .toString()

exports.onCreateNode = ({ node }) => {
  // Move onto the next node unless this node has a sidebar.
  if (!node.frontmatter || !node.frontmatter.sidebar) return
  // Overwrite the frontmatter.sidebar property as the HTML string.
  node.frontmatter.sidebar = processMarkdown(node.frontmatter.sidebar)
}
