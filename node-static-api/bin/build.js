#!/usr/bin/env node

const fs = require("fs")
const glob = require("glob")
const path = require("path")
const yaml = require("js-yaml")

// ---------------------------------------- | Parse Data

// Object to store parsed data.
const data = []
// Get filenames of all the YAML files in the data/earworms directory.
const dataFiles = glob.sync(path.join(__dirname, "../data/earworms/*.yml"))
// Loop through the files, read each one, parse it, and store it in the data
// object.
for (const file of dataFiles) {
  const content = fs.readFileSync(file, { encoding: "utf-8" })
  data.push(yaml.load(content))
}

// ---------------------------------------- | Build Directories

// Create main build directory if it doesn't exist.
const buildDir = path.join(__dirname, "../build")
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir)
// Create the directory to house the individual records, if it doesn't exist.
const indivDir = path.join(__dirname, "../build/earworms")
if (!fs.existsSync(indivDir)) fs.mkdirSync(indivDir)

// ---------------------------------------- | Index Page

// Path to the index page in the build dir.
const indexPath = path.join(buildDir, "earworms.json")
// Data for the index page.
const indexData = JSON.stringify({
  results: data,
  meta: { count: data.length }
})
// Write the file.
fs.writeFileSync(indexPath, indexData)

// ---------------------------------------- | Individual Pages

// Loop through the individual data records.
for (const result of data) {
  // Path to the individual file.
  const indivPath = path.join(indivDir, `${result.id}.json`)
  // Data for the individual file.
  const indivData = JSON.stringify({ result: data, meta: {} })
  // Write the individual file.
  fs.writeFileSync(indivPath, indivData)
}
