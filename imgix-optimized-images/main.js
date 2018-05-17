window.CRDS = window.CRDS || {};

// ---------------------------------------- | ImageOptimizer

CRDS.ImageOptimizer = function(img) {
  this.timeToFade = 250;
  this.processing = false;

  this.img = $(img);

  if (this.img[0].complete) { this.renderTmpImg() }
  this.img.on('load', $.proxy(this.renderTmpImg, this));
};

CRDS.ImageOptimizer.prototype.constructor = CRDS.ImageOptimizer;

CRDS.ImageOptimizer.prototype.renderTmpImg = function() {

  if (this.processing) { return }

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
  if (!this.img) { return }
  this.img.fadeTo(this.timeToFade, 0);

  setTimeout($.proxy(function() {
    this.tmpImg.removeAttr('style');
    this.tmpImg.attr('class', this.img.attr('class'));
    this.tmpImg.insertAfter(this.img);
    this.img.remove();
    this.img = undefined;
  }, this), this.timeToFade);
}

// ---------------------------------------- | BgImageOptimizer Constructor

CRDS.BgImageOptimizer = function(bgEl) {
  this.timeToFade = 250;
  this.processing = false;

  this.bgEl = $(bgEl);
  this.imgUrl = this.bgEl.css('background-image').replace('url(', '').replace(')', '').replace(/\"/gi, "");

  $('<img>').on('load', $.proxy(this.renderTmpImg, this)).attr('src', this.imgUrl);
};

CRDS.BgImageOptimizer.prototype.constructor = CRDS.BgImageOptimizer;

CRDS.BgImageOptimizer.prototype.renderTmpImg = function() {
  this.tmpPlacholderBgEl = this.bgEl.clone();
  this.tmpPlacholderBgEl.html('');

  this.tmpPlacholderBgEl.css({
    position: 'absolute',
    top: this.bgEl.offset().top - parseInt(this.bgEl.css('margin-top')),
    left: this.bgEl.offset().left - parseInt(this.bgEl.css('margin-left')),
    width: this.bgEl.width(),
    height: this.bgEl.height(),
    zIndex: '-1'
  });

  $('body').prepend(this.tmpPlacholderBgEl);

  this.bgEl.css('background-image', '');

  this.tmpFullSizeBgEl = this.tmpPlacholderBgEl.clone();

  var newUrl = new URL(this.imgUrl);
  if (newUrl.searchParams.get('w')) {
    newUrl.searchParams.set('w', this.bgEl.outerWidth());
  }
  if (newUrl.searchParams.get('h')) {
    newUrl.searchParams.set('h', this.bgEl.outerHeight());
  }

  this.tmpFullSizeBgEl.css({
    backgroundImage: 'url("' + newUrl.href + '")',
    zIndex: '-2'
  });

  $('body').prepend(this.tmpFullSizeBgEl);
  $('<img>').on('load', $.proxy(this.transitionImg, this)).attr('src', newUrl.href);
}

CRDS.BgImageOptimizer.prototype.transitionImg = function() {
  this.tmpPlacholderBgEl.fadeTo(this.timeToFade, 0);

  setTimeout($.proxy(function() {
    this.bgEl.css('background-image', this.tmpFullSizeBgEl.css('background-image'));
    this.tmpPlacholderBgEl.remove();
    this.tmpFullSizeBgEl.remove();
    this.tmpPlacholderBgEl = undefined;
    this.tmpFullSizeBgEl = undefined;
  }, this), this.timeToFade);
}

// ---------------------------------------- | Initializer

CRDS.ImageOptimizer.init = function() {
  $('img[data-optimize-img]').each(function(idx, img) {
    new CRDS.ImageOptimizer(img);
  });

  $('[data-optimize-bg-img]').each(function(idx, bgEl) {
    new CRDS.BgImageOptimizer(bgEl);
  });
}

$(document).ready(CRDS.ImageOptimizer.init);
