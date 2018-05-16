// TODO:
//
// 1. Inline-block images
// 2. Inline images
// 3. Block images
// 4. Background images

window.CRDS = window.CRDS || {};

CRDS.ImageOptimizer = function(img) {
  this.img = $(img);

  this.timeToFade = 1000;

  // console.log(this.img.offset().top);

  // var _this = this;
  this.img.on('load', $.proxy(function(event) {
    // this.setImgPosition();
    this.renderTempImg();
  }, this));

  // this.wrapImg();

  // this.addTmpImg();
};

CRDS.ImageOptimizer.init = function() {
  $('img[data-optimize-img]').each(function(idx, img) {
    new CRDS.ImageOptimizer(img);
  });
}

CRDS.ImageOptimizer.prototype.constructor = CRDS.ImageOptimizer;

// // Wrap image and set wrapper's dimensions to match the image.
// CRDS.ImageOptimizer.prototype.wrapImg = function() {
//   this.img.wrap('<div class="img-optimizer-wrapper"></div>');
//   this.wrapper = this.img.parent();
//   this.wrapper.height(this.img.height()).width(this.img.width());
// };

// CRDS.ImageOptimizer.prototype.setImgPosition = function() {
//   this.imgX = this.img.offset().left;
//   this.imgY = this.img.offset().top;
// }

CRDS.ImageOptimizer.prototype.renderTempImg = function() {
  this.tmpImg = this.img.clone();

  var src = this.img.attr('src');

  if (src.slice(0, 2) == '//') { src = 'https:' + src }

  console.log(src);

  this.tmpImg.css({
    position: 'absolute',
    top: this.img.offset().top,
    left: this.img.offset().left,
    width: this.img.width(),
    height: this.img.height(),
    zIndex: '-1'
  });

  this.tmpImg.attr({
    'ix-src': src,
    'class': 'img-responsive'
  });

  this.tmpImg.removeAttr('src');
  this.tmpImg.removeAttr('data-optimize-img');

  // this.img.before(this.tmpImg[0].outerHTML);
  $('body').prepend(this.tmpImg);

  this.tmpImg.on('load', $.proxy(this.transitionImg, this));

  imgix.init();
}

// CRDS.ImageOptimizer.prototype.addTmpImg = function() {
//   this.wrapper.prepend('<img class="img-optimizer-tmp-img">');
//   this.tmpImg = this.wrapper.find('.img-optimizer-tmp-img').first();
//   this.tmpImg.on('load', $.proxy(this.transitionImg, this));

//   var src = 'https://crds-media-int.imgix.net/4zkKbFeQ1i64WaiiQaqaO8/e3e2e8747fc943fce767f1c8c53470d0/computer-background-pictures-76_1_.jpg?ixlib=imgixjs-3.3.2&w=1920';
//   var src = this.img.attr('src').split('?')[0];
//   this.tmpImg.attr('src', src);
// };

CRDS.ImageOptimizer.prototype.transitionImg = function() {
  this.img.fadeTo(this.timeToFade, 0);

  setTimeout($.proxy(function() {
    this.tmpImg.removeAttr('style');
    this.tmpImg.attr('class', this.img.attr('class'));
    this.tmpImg.insertAfter(this.img);
    this.img.remove();
  }, this), this.timeToFade);

}

// CRDS.ImageOptimizer.prototype.transitionImg = function() {
//   this.img.fadeOut(this.timeToFade);
//   setTimeout($.proxy(this.endTransition, this), this.timeToFade + 10);
// };

// CRDS.ImageOptimizer.prototype.endTransition = function() {
//   this.img.addClass('img-responsive');
//   this.img.attr('ix-src', this.tmpImg.attr('src'));
//   this.img.show();
//   imgix.init();

//   this.tmpImg.remove();
//   this.img.unwrap();
// };

$(document).ready(CRDS.ImageOptimizer.init);
