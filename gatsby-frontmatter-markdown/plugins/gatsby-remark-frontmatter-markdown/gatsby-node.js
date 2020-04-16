const deepForEach = require("deep-for-each")
const lodash = require("lodash")
const remark = require("remark")
const remarkHTML = require("remark-html")

// Use remark to convert markdown to HTML and return HTML as a string.
const processMarkdown = markdown =>
  remark()
    .use(remarkHTML)
    .processSync(markdown)
    .toString()

exports.onCreateNode = ({ node }, { suffix = "_md" }) => {
  // Only run if the node is of "MarkdownRemark" type.
  if (lodash.get(node, "internal.type") === "MarkdownRemark") {
    // Loop through all properties at every level.
    deepForEach(node, (value, key, subject, keyPath) => {
      // Move to the next property unless the key for this property ends with
      // the suffix and the value is a string.
      if (lodash.endsWith(key, suffix) && value && typeof value === "string") {
        // Trim suffix off the end of the key so we can store the converted HTML
        // as a separate property.
        const newKey = lodash.trimEnd(key, suffix)
        // Convert markdown to HTML.
        const md = processMarkdown(value)
        // Store the HTML as the new property.
        if (md) subject[newKey] = md
      }
    })
  }
}
