---
layout:
---
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

      $(document).bind('keydown', function(e) {
        if (lightbox.is('.visible')) {
          switch (e.keyCode) {
            case 37: // left arrow
              nextImage(-1);
              break;
            case 39: // right arrow
              nextImage(1);
              break;
            case 27: // ESC
              toggleLightbox();
            default:
          }
        }
      });
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

  buildLightbox();
}

// slideshow

var slideshow = $('#slideshow');

if (slideshow.length) {

  var slideshowImages = $('#slideshow .slide');

  while (slideshowImages.length) {
    slideshow.append(slideshowImages.splice(Math.floor(Math.random() * slideshowImages.length), 1)[0]);
  }
  slideshowImages = $('#slideshow .slide');

  slideshowImages.eq(0).addClass('visible');
  slideshowImages.each(function() {
    var spinner = $('<div class="spinner">')
      .append($('<div class="bounce1">'))
      .append($('<div class="bounce2">'))
      .append($('<div class="bounce3">'))
      .append($('<div class="bounce4">'));

    $(this).html(spinner);

    var slide = this;
    var loadImg = new Image();
    loadImg.src = this.dataset.display;
    loadImg.onload = function() {
      $(slide).html(this);
    }
  });

  var animateSlides = function(curr, next) {
    slideshow.attr('data-image', next);

    slideshowImages.eq(curr).addClass('animate current');
    slideshowImages.eq(next).addClass('visible').addClass('animate next');

    window.setTimeout(function() { clearAnimation(curr, next); }, {{ site.data.slideshow.animation_duration }});

  }

  var clearAnimation = function(curr, next) {
    slideshowImages.eq(curr).removeClass('animate current').removeClass('visible');
    slideshowImages.eq(next).removeClass('animate next');
  }

  var slideImages = function(dir, e) {
    var currImage = parseInt(slideshow.attr('data-image')) || 0;
    var nextImage = mod(currImage + dir, slideshowImages.length);

    animateSlides(currImage, nextImage);
  }

  var autoSlides = function() { slideImages(1) };

  var slideShowInterval = window.setInterval(autoSlides, {{ site.data.slideshow.animation_interval }});
}
