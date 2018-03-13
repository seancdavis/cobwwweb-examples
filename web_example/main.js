$(document).ready(initChart);

function initChart() {
  $.get('./sg-wayfinder-chart.svg', function(data, statusText, event) {
    $('#chart-container').html(data.documentElement);
    renderScore();
    renderBase64Image()
  });
}

function renderScore() {
  $('#chart-background').attr('d', describeArc(211, 210.5, 180, 0, 359.999));
  $('#chart-foreground').attr('d', describeArc(211, 210.5, 180, 0, 211));
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
}

function renderBase64Image() {
  var chartCanvas = document.getElementById('chart-canvas');
  var ctxt = chartCanvas.getContext("2d");

  drawInlineSVG(ctxt, function() {
    var imgSrc = chartCanvas.toDataURL();
    $('#chart-image').attr('src', imgSrc);
  });
}

function drawInlineSVG(ctx, callback) {
  var svg = $('#chart-container').find('svg').first()[0];
  var svgURL = new XMLSerializer().serializeToString(svg);
  var img = new Image();
  img.onload = function() {
    ctx.drawImage(this, 0, 0);
    callback();
  }
  img.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURL);
}
