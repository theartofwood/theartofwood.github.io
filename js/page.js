function toggleMenu(e) {
  $('#navigation').toggleClass('opened');
  $('#mobile-overlay').toggleClass('visible');
  $('body').toggleClass('noscroll');
  e.stopPropagation();
}

$('#mobile-menu').bind('click', toggleMenu);
$('#mobile-overlay').bind('click', toggleMenu);

// Lightbox
function mod(n, m) {
  return ((n % m) + m) % m;
}

var lightboxLinks = $('a[data-rel="lightbox"]');

if (lightboxLinks.length) {
  var lightbox   = $('<div id="lightbox">');
  var leftArrow  = $('<div class="arrow left">');
  var rightArrow = $('<div class="arrow right">');

  var lightboxImages;

  var buildLightbox = function() {
    if (!lightboxImages) {

      lightbox.appendTo('body')
        .append(leftArrow)
        .append(rightArrow);

      lightboxLinks.each(function() {
        var spinner = $('<div class="spinner">')
          .append($('<div class="bounce1">'))
          .append($('<div class="bounce2">'))
          .append($('<div class="bounce3">'))
          .append($('<div class="bounce4">'));

        var image = $('<div>', {
          'class': 'image-container',
          'data-src': this.href
        }).append(spinner);
        image.appendTo(lightbox);
      });

      lightboxImages = $('.image-container');

      lightboxLinks.bind('click', clickLink);
      lightbox.bind('click', toggleLightbox);

      leftArrow.bind('click', function(e) {nextImage(-1,e)});
      rightArrow.bind('click', function(e) {nextImage(1,e)});
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
    currentImage.removeAttr('data-src');
    if (src) {
      var loadImg = new Image();
      loadImg.src = src;
      loadImg.onload = function() {
        currentImage.html(this);
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

  var nextImage = function(dir, e) {
    if (e) e.stopPropagation();
    var currImage = parseInt(lightbox.attr('data-image'));
    var nextImage = mod(currImage + dir, lightboxImages.length);

    showImage(nextImage);
  }

  $(document).bind('keydown', function(e) {
    if (lightbox.is('.visible')) {
      switch (e.keyCode) {
        case 37:
          nextImage(-1);
          break;
        case 39:
          nextImage(1);
          break;
        case 27:
          toggleLightbox();
        default:
      }
    }
  });

  buildLightbox();
}
