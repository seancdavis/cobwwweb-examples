#!/usr/bin/env node

const fs = require('pn/fs');
// const svg2png = require('svg2png');
// const axios = require('axios');
const cheerio = require('cheerio');

const svgTemplateUrl = './assets/sg-wayfinder-chart-blank.svg';
const wayfinderScore = 232;

// const inputFile = 'assets/sg-wayfinder-chart.svg';
// const outputFile = 'assets/sg-wayfinder-chart.png';

// fs.unlink(outputFile, function(error) {
//   if (error) { throw error; }
//   console.log(`Deleted File: ${outputFile}`);
// });

// fs.readFile(inputFile)
//     .then(svg2png)
//     .then(buffer => fs.writeFile(outputFile, buffer))
//     .catch(e => console.error(e));

class WayfinderChart {

  constructor() {
    // this.svg = null;
    this.$ = null;
  }

  process() {
    this.getSvgTemplate(_$ => {
      this.drawScore();
      // this.writeSvgToFile();
      // this.convertToBase64();
    });
    // .then(_$ => {
    //   // this.drawScore();
    //   // this.writeSvgToFile();
    // });
  }

  getSvgTemplate(callback) {
    // console.log(fs.readFile(svgTemplateUrl).toString('base64'));
    fs.readFile(svgTemplateUrl, 'utf8', (err, data) => {
      // console.log(data.toString('base64'));
      // console.log(new Buffer(data.toString(), 'base64'));
      console.log(Buffer.from(data.toString()).toString('base64'));

      // this.$ = cheerio.load(data.toString());
      // callback(this.$);
    });
    // --- IF WE'RE GETTING THE SVG FROM A REMOTE FILE
    // return axios.get(svgTemplateUrl).then(response => {
    //   // this.svg = response.data;
    //   // return this.svg;
    //   return this.$ = cheerio.load(response.data);
    // }).catch(function (error) {
    //   console.error(error);
    // });
  }

  drawScore() {
    this.$('#chart-background').attr('d', this.describeArc(211, 210.5, 180, 0, 359.999));
    this.$('#chart-foreground').attr('d', this.describeArc(211, 210.5, 180, 0, 211));
  }

  writeSvgToFile() {
    const outputFile = `./assets/sg-wayfinder-result-${wayfinderScore}.svg`;
    fs.writeFile(outputFile, this.$.html(), function(err) {
      if (err) {
        return console.error(err);
      }
    });
  }

  convertToBase64() {
    console.log('CONVERT');
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  }

}

const wayfinderChart = new WayfinderChart();
wayfinderChart.process();
