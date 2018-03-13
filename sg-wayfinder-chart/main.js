$(document).ready(initChart);

function initChart() {
  $.get('./sg-wayfinder-chart-02.svg', function(data, statusText, event) {
    $('#chart-container').html(data.documentElement);
    renderScore();
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
