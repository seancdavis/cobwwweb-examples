// TODO:
//
// 1. Inline-block images
// 2. Inline images
// 3. Block images
// 4. Background images

window.CRDS = window.CRDS || {};

CRDS.ImageOptimizer = function(img) {
  this.timeToFade = 250;
  this.processing = false;

  this.img = $(img);

  if (this.img[0].complete) { this.renderTempImg() }
  this.img.on('load', $.proxy(this.renderTempImg, this));
};

CRDS.ImageOptimizer.init = function() {
  $('img[data-optimize-img]').each(function(idx, img) {
    new CRDS.ImageOptimizer(img);
  });
}

CRDS.ImageOptimizer.prototype.constructor = CRDS.ImageOptimizer;

CRDS.ImageOptimizer.prototype.renderTempImg = function() {

  if (this.processing) { return false; }

  this.processing = true;

  this.tmpImg = this.img.clone();

  this.tmpImg.css({
    position: 'absolute',
    top: this.img.offset().top - parseInt(this.img.css('margin-top')),
    left: this.img.offset().left - parseInt(this.img.css('margin-left')),
    width: this.img.width(),
    height: this.img.height(),
    zIndex: '-1'
  });

  this.tmpImg.attr('ix-src', this.img.attr('src'));
  this.tmpImg.addClass('img-responsive');
  this.tmpImg.removeAttr('src');
  this.tmpImg.removeAttr('data-optimize-img');

  $('body').prepend(this.tmpImg);

  this.tmpImg.on('load', $.proxy(this.transitionImg, this));

  imgix.init();
}

CRDS.ImageOptimizer.prototype.transitionImg = function() {
  this.img.fadeTo(this.timeToFade, 0);

  setTimeout($.proxy(function() {
    this.tmpImg.removeAttr('style');
    this.tmpImg.attr('class', this.img.attr('class'));
    this.tmpImg.insertAfter(this.img);
    this.img.remove();
  }, this), this.timeToFade);
}

$(document).ready(CRDS.ImageOptimizer.init);
