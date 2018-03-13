$(document).ready(initChart);

function initChart() {

  // var draw = SVG('sg-chart').size(300, 300)
  // var rect = draw.rect(100, 100).attr({ fill: '#f06' });

  var draw = SVG('sg-chart').size('100%', '100%');
  var rect = draw.rect('50%', '50%').attr({ fill: '#f06' });

}
