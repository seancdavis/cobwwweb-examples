#!/usr/bin/env node

const fs = require("pn/fs"); // https://www.npmjs.com/package/pn
const svg2png = require("svg2png");

const inputFile = 'assets/sg-wayfinder-chart.svg';
const outputFile = 'assets/sg-wayfinder-chart.png';

fs.unlink(outputFile, function(error) {
  if (error) { throw error; }
  console.log(`Deleted File: ${outputFile}`);
});

fs.readFile(inputFile)
    .then(svg2png)
    .then(buffer => fs.writeFile(outputFile, buffer))
    .catch(e => console.error(e));
