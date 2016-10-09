function $(id) {
  return document.getElementById(id);
}

// var menuButton = document.createElement('span');
// menuButton.innerHTML = '<img src="menu.svg"> Menü öffnen';
// menuButton.id = 'mobile-menu';

// var wrapper = $('wrapper');

// wrapper.insertBefore(menuButton, wrapper.firstChild);

function toggleMenu(e) {
  $('navigation').classList.toggle('opened');
  $('mobile-overlay').classList.toggle('visible');
  document.body.classList.toggle('noscroll');
  e.stopPropagation();
}

$('mobile-menu').addEventListener('click', toggleMenu);
$('mobile-overlay').addEventListener('click', toggleMenu);
// $('mobile-menu').addEventListener('click', function(e) {
//   $('navigation').classList.add('opened');
//   $('mobile-overlay').classList.add('visible');
//   document.body.classList.add('noscroll');
//   e.stopPropagation();
// });

// $('wrapper').addEventListener('click', function() {
//   $('navigation').classList.remove('opened');
//   $('mobile-overlay').classList.remove('visible');
//   document.body.classList.add('noscroll');
// });
