import { smoothScroll } from './functional.js';

export function isWebp() {
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  testWebP(function (support) {
    if (support == true) {
      document.querySelector('html').classList.add('webp');
    } else {
      document.querySelector('html').classList.add('no-webp');
    }
  });
}

export function showScreenSize() {
  document.getElementsByTagName('body')[0].prepend(window.screen.width, 'x', window.screen.height);
}

export function initSmoothScroll({ duration, offset, mobile }) {
  const DEFAULT_DURATION = 1000;
  const DEFAULT_OFFSET = 0;
  const DEFAULT_MOBILE = true;

  const targets = {
    'a[href^="#"]:not([href="#"])': elem => elem.getAttribute('href'),
    'a[href="#"]': () => 'body',
  }

  document.addEventListener('click', (event) => {
    for (let selector in targets) {
      const elem = event.target.closest(selector);
      if (elem) {
        smoothScroll(
          targets[selector](elem),
          duration ?? DEFAULT_DURATION,
          offset ?? DEFAULT_OFFSET
        );
      }
    }
  });
}