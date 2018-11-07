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

// PhotoSwipe.com
var initPhotoSwipeFromDOM = function(gallerySelector) {

  console.log(gallerySelector);
  // parse slide data (url, title, size ...) from DOM elements
  // (children of gallerySelector)
  var parseThumbnailElements = function(el) {
    var thumbElements = el.childNodes,
        numNodes = thumbElements.length,
        items = [],
        figureEl,
        linkEl,
        size,
        item;

    for(var i = 0; i < numNodes; i++) {

      figureEl = thumbElements[i]; // <figure> element

      // include only element nodes
      if(figureEl.nodeType !== 1) {
        continue;
      }

      linkEl = figureEl.children[0]; // <a> element
      console.log(linkEl);

      size = linkEl.getAttribute('data-size').split('x');
      console.log(linkEl.getAttribute('href'));

      // create slide object
      item = {
        src: 'med/' + linkEl.getAttribute('data-name'),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };


      if(figureEl.children.length > 1) {
        // <figcaption> content
        item.title = figureEl.children[1].innerHTML;
      }

      if(linkEl.children.length > 0) {
        // <img> thumbnail element, retrieving thumbnail url
        item.msrc = linkEl.children[0].getAttribute('src');
      }

      item.el = figureEl; // save link to element for getThumbBoundsFn
      items.push(item);
    }

    return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    var eTarget = e.target || e.srcElement;

    // find root element of slide
    var clickedListItem = closest(eTarget, function(el) {
      return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
    });

    if(!clickedListItem) {
      return;
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    var clickedGallery = clickedListItem.parentNode,
      childNodes = clickedListItem.parentNode.childNodes,
      numChildNodes = childNodes.length,
      nodeIndex = 0,
      index;

    for (var i = 0; i < numChildNodes; i++) {
      if(childNodes[i].nodeType !== 1) {
        continue;
      }

      if(childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }



    if(index >= 0) {
      // open PhotoSwipe if valid index found
      openPhotoSwipe( index, clickedGallery );
    }
    return false;
  };

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1),
        params = {};

    if(hash.length < 5) {
      return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
      if(!vars[i]) {
        continue;
      }
      var pair = vars[i].split('=');
      if(pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if(params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };

  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;

    items = parseThumbnailElements(galleryElement);

    // define options (if needed)
    options = {

      // define gallery index (for URL)
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),

      getThumbBoundsFn: function(index) {
        // See Options -> getThumbBoundsFn section of documentation for more info
        var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
          pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
      },

      pinchToClose: false

    };

    // PhotoSwipe opened from URL
    if(fromURL) {
      if(options.galleryPIDs) {
        // parse real index when custom PIDs are used
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for(var j = 0; j < items.length; j++) {
          if(items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    // exit if index not found
    if( isNaN(options.index) ) {
      return;
    }

    if(disableAnimation) {
      options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  };

  // loop through all gallery elements and bind events
  var galleryElements = document.querySelectorAll( gallerySelector );

  for(var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute('data-pswp-uid', i+1);
    galleryElements[i].onclick = onThumbnailsClick;
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if(hashData.pid && hashData.gid) {
    openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
  }
};

// execute above function
initPhotoSwipeFromDOM('.sh-image-gallery');

// var lightboxLinks = $('a[data-rel="lightbox"]');

// if (lightboxLinks.length) {
//   var lightbox   = $('<div id="lightbox">');
//   var leftArrow  = $('<div class="arrow left">');
//   var rightArrow = $('<div class="arrow right">');
//   var closeCross = $('<div class="close">');

//   var lightboxImages;

//   var buildLightbox = function() {
//     if (!lightboxImages) {

//       lightbox.appendTo('body')
//         .append(leftArrow)
//         .append(rightArrow);
//         // .append(closeCross);

//       lightboxLinks.each(function() {
//         var spinner = $('<div class="spinner">')
//           .append($('<div class="bounce1">'))
//           .append($('<div class="bounce2">'))
//           .append($('<div class="bounce3">'))
//           .append($('<div class="bounce4">'));

//         var image = $('<div>', {
//           'class': 'image-container',
//           'data-src': this.href
//         }).append(spinner);
//         image.appendTo(lightbox);
//       });

//       lightboxImages = $('.image-container');

//       lightboxLinks.bind('click', clickLink);
//       lightbox.bind('click', toggleLightbox);
//       // closeCross.bind('click', toggleLightbox);

//       leftArrow.bind('click', function(e) {nextImage(-1,e)});
//       rightArrow.bind('click', function(e) {nextImage(1,e)});

//       $(document).bind('keydown', function(e) {
//         if (lightbox.is('.visible')) {
//           switch (e.keyCode) {
//             case 37: // left arrow
//               nextImage(-1);
//               break;
//             case 39: // right arrow
//               nextImage(1);
//               break;
//             case 27: // ESC
//               toggleLightbox();
//             default:
//           }
//         }
//       });
//     }
//   }

//   var toggleLightbox = function() {
//     $('body').toggleClass('noscroll');
//     lightbox.toggleClass('visible');
//   }

//   var showImage = function(i) {
//     lightbox.attr('data-image', i);
//     lightboxImages.filter('.visible').removeClass('visible');

//     var currentImage = lightboxImages.eq(i).addClass('visible');
//     var src = currentImage.attr('data-src');
//     currentImage.removeAttr('data-src');
//     if (src) {
//       var loadImg = new Image();
//       loadImg.src = src;
//       loadImg.onload = function() {
//         currentImage.html(this);
//       }
//     }
//   }

//   var clickLink = function(e) {
//     if (e.button == 0) {
//       e.preventDefault();

//       toggleLightbox();

//       showImage(lightboxLinks.index(this));
//     }
//   }

//   var nextImage = function(dir, e) {
//     if (e) e.stopPropagation();
//     var currImage = parseInt(lightbox.attr('data-image'));
//     var nextImage = mod(currImage + dir, lightboxImages.length);

//     showImage(nextImage);
//   }

//   buildLightbox();
// }

// slideshow

var slideshow = $('#slideshow');

if (slideshow.length) {
  var leftArrow  = $('<div class="arrow left">');
  var rightArrow = $('<div class="arrow right">');

  var slideshowImages = $('#slideshow .slide');

  slideshow.append(leftArrow).append(rightArrow);

  if ({{ site.data.slideshow.randomize_slides }}) {
    while (slideshowImages.length) {
      slideshow.append(slideshowImages.splice(Math.floor(Math.random() * slideshowImages.length), 1)[0]);
    }
    slideshowImages = $('#slideshow .slide');
  }

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
      var title = $('<a>', {
        text: slide.dataset.title,
        'class': 'slide-title',
        href: '/galerie/' + slide.dataset.gallery
      });
      $(slide).append(title);
    }
  });

  leftArrow.bind('click', function(e) {manualSlide(-1,e)});
  rightArrow.bind('click', function(e) {manualSlide(1,e)});

  var animateSlides = function(curr, next, dir) {
    slideshow.attr('data-image', next);

    slideshowImages.eq(curr).addClass('animate current');
    slideshowImages.eq(next).addClass('visible').addClass('animate next');

    if (dir == -1) {
      slideshowImages.eq(curr).addClass('reversed');
      slideshowImages.eq(next).addClass('reversed');
    }

    window.setTimeout(function() { clearAnimation(curr, next); }, {{ site.data.slideshow.animation_duration }});

  }

  var clearAnimation = function(curr, next) {
    slideshowImages.eq(curr).removeClass('reversed animate current').removeClass('visible');
    slideshowImages.eq(next).removeClass('reversed animate next');
  }

  var manualSlide = function(dir, e) {
    if (!$('.animate').length) {
      slideImages(dir, e);
      resetInteval();
    }
  }

  var slideImages = function(dir, e) {
    var currImage = parseInt(slideshow.attr('data-image')) || 0;
    var nextImage = mod(currImage + dir, slideshowImages.length);

    animateSlides(currImage, nextImage, dir);
  }

  var autoSlides = function() { slideImages(1) };

  var slideShowInterval;

  var resetInteval = function() {
    window.clearInterval(slideShowInterval);
    slideShowInterval = window.setInterval(autoSlides, {{ site.data.slideshow.animation_interval }});
  }

  resetInteval();
}
