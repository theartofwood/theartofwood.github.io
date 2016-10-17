function toggleMenu(e) {
  $('#navigation').toggleClass('opened');
  $('#mobile-overlay').toggleClass('visible');
  $('body').toggleClass('noscroll');
  e.stopPropagation();
}

$('#mobile-menu').bind('click', toggleMenu);
$('#mobile-overlay').bind('click', toggleMenu);

// Lightbox

function bind(scope, fn) {
    return function() { fn.apply(scope, arguments); };
}

var lightboxLinks = $('a[data-rel="lightbox"]');

if (lightboxLinks.length) {
  var lightbox = $('<div id="lightbox">').appendTo('body');

  var spinner = $('<div class="spinner">')
    .append($('<div class="bounce1">'))
    .append($('<div class="bounce2">'))
    .append($('<div class="bounce3">'))
    .append($('<div class="bounce4">'));

  var lightboxImages;
  var buildLightbox = function() {
    if (!lightboxImages) {
      lightboxLinks.each(function() {
        var image = $('<div>', {
          'class': 'image-container',
          'data-src': this.href
        }).append(spinner.clone());
        image.appendTo(lightbox);
      });

      lightboxImages = $('.image-container');

      lightboxLinks.bind('click', clickLink);
      lightbox.bind('click', toggleLightbox);
    }
  }

  var toggleLightbox = function() {
    $('body').toggleClass('noscroll');
    lightbox.toggleClass('visible');
  }

  var showImage = function(i) {
    lightbox.attr('data-image', i);
    lightboxImages.filter('.visible').removeClass('visible');

    var currentImage = lightboxImages.eq(i).addClass('visible');
    var src = currentImage.attr('data-src');
    if (src) {
      var loadImg = new Image();
      loadImg.src = src;
      loadImg.onload = function() {
        currentImage.html(this);
        currentImage.removeAttr('data-src');
      }
    }
  }

  var clickLink = function(e) {
    if (e.button == 0) {
      e.preventDefault();

      toggleLightbox();

      showImage(lightboxLinks.index(this));
    }
  }

  buildLightbox();
}
