#!/usr/bin/env node

const fs = require('pn/fs');
const svg2png = require('svg2png');
const axios = require('axios');
const cheerio = require('cheerio');

class WayfinderChart {

  constructor() {
    this.$ = null;
    this.svgTemplateUrl = 'https://crossroads-assets.s3.amazonaws.com/tmp/sg-wayfinder-chart-blank.svg';
  }

  process(wayfinderScore = 0) {
    this.wayfinderScore = wayfinderScore;
    return new Promise((resolve, reject) => {
      this.getSvgTemplate().then(_$ => {
        this.drawScore();
        this.getBase64().then(base64 => resolve(base64));
      });
    });
  }

  getSvgTemplate(callback) {
    return axios.get(this.svgTemplateUrl).then(response => {
      return this.$ = cheerio.load(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  drawScore() {
    this.$('#chart-background').attr('d', this.describeArc(211, 210.5, 180, 0, 359.999));
    this.$('#chart-foreground').attr('d', this.describeArc(211, 210.5, 180, 0, this.wayfinderScore));
  }

  getBase64() {
    const sourceBuffer = Buffer.from(this.$.html(), 'utf8');
    return svg2png(sourceBuffer).then(buffer => {
      return `data:image/png;base64,${buffer.toString('base64')}`;
    }).catch(e => console.error(e));
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

// Pass a number between [0 - 359] and you will be returned a promise, from
// which the base64 string is resolved.
wayfinderChart.process(222).then(base64 => {
  console.log(base64);
});
