// import Swiper from 'swiper/bundle';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { initSmoothScroll } from './modules/service.js';

initSmoothScroll({ duration: 700, offset: 50 });

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function onlyWidth(handler) {
  let formerWidth = window.innerWidth;
  return (event) => {
    if (window.innerWidth == formerWidth) return;
    formerWidth = window.innerWidth;
    return handler(event);
  };
}

window.addEventListener('load', () => {
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${window.innerWidth - document.documentElement.clientWidth}px`,
  );
});

function copyAttributes(from, to, attributes) {
  attributes.forEach((name) => {
    to.setAttribute(name, from.getAttribute(name));
  });
}

function lockPage() {
  document.body.dataset.lockCount = +document.body.dataset.lockCount + 1;
  document.body.classList.add('lock');
}

function unlockPage() {
  document.body.dataset.lockCount = +document.body.dataset.lockCount - 1;
  if (+document.body.dataset.lockCount <= 0) {
    document.body.classList.remove('lock');
    document.body.dataset.lockCount = 0;
  }
}

function pageIsLock() {
  return document.body.classList.contains('lock');
}

function getTabsExcept(selector) {
  const originNoTabs = new Set(document.querySelectorAll('[tabindex="-1"]'));

  return [...document.querySelectorAll('a, input, button')].filter(
    (elem) =>
      !originNoTabs.has(elem) && (selector === null || !elem.closest(selector)),
  );
}

function disableTabsExcept(selector) {
  getTabsExcept(selector).forEach((elem) =>
    elem.setAttribute('tabindex', '-2'),
  );
}

function enableAllTabs() {
  document.querySelectorAll('a, input, button').forEach((elem) => {
    if (+elem.getAttribute('tabindex') != -1) {
      elem.setAttribute('tabindex', '0');
    }
  });
}

//------------------------------------------------------------------------------
// Header menu
//------------------------------------------------------------------------------
const header = document.querySelector('.header');
const buttonMenuOpen = document.querySelector('.header__button-menu');
const buttonMenuClose = document.querySelector('.header__button-close');
const headerBreakpointSm = 680;
const headerBreakpointLg = 1330;

function openNavMenu() {
  header.classList.add('header--active');
  header.classList.add('header--transition-on');
  if (window.matchMedia(`(max-width: ${headerBreakpointSm}px)`).matches) {
    lockPage();
    disableTabsExcept('.header__nav-block');
  }
}
function closeNavMenu() {
  header.classList.remove('header--active');
  header.classList.add('header--transition-on');
  unlockPage();
  enableAllTabs();
}

document
  .querySelectorAll('.header__nav-block, .header__nav-panel')
  .forEach((elem) =>
    elem.addEventListener('transitionend', () => {
      header.classList.remove('header--transition-on');
      if (header.classList.contains('header--active')) {
        buttonMenuClose.focus();
      } else {
        buttonMenuOpen.focus();
      }
    }),
  );

buttonMenuOpen.addEventListener('click', () => {
  openNavMenu();
});
buttonMenuClose.addEventListener('click', () => {
  closeNavMenu();
});
document.addEventListener('click', (event) => {
  if (
    window.matchMedia(
      `(min-width: ${headerBreakpointSm}px) and (max-width: ${headerBreakpointLg}px)`,
    ).matches
  ) {
    if (
      header.classList.contains('header--active') &&
      !header.classList.contains('header--transition-on') &&
      !event.target.closest('.header__nav-panel')
    ) {
      closeNavMenu();
    }
  }
});

document.querySelectorAll('.header__link').forEach((elem) =>
  elem.addEventListener('click', (event) => {
    closeNavMenu();
  }),
);

window.addEventListener('resize', onlyWidth(() => {
  if (header.classList.contains('header--active')) {
    if (
      window.matchMedia(`(max-width: ${headerBreakpointSm}px)`).matches &&
      !pageIsLock()
    ) {
      lockPage();
    }
    if (window.matchMedia(`(min-width: ${headerBreakpointSm}px)`).matches) {
      unlockPage();
    }
  }
}));

//------------------------------------------------------------------------------
// Shop fixed rows number
//------------------------------------------------------------------------------
const shopGrid = document.querySelector('.shop__array');
const shopItems = [...shopGrid.children];
const shopBreakpointLg = 1050;
const shopBreakpointSm = 640;

function getShopGridSizes() {
  return {
    columns: getComputedStyle(shopGrid)
      .getPropertyValue('grid-template-columns')
      .split(' ').length,
    rows: getComputedStyle(shopGrid)
      .getPropertyValue('grid-template-rows')
      .split(' ').length,
  };
}

function setFixedShopRows(maxRows) {
  const { columns, rows } = getShopGridSizes();
  const maxNumber = columns * maxRows;
  shopItems.forEach((elem, index) => {
    if (index < maxNumber) {
      elem.classList.remove('card--hidden');
    } else {
      elem.classList.add('card--hidden');
    }
  });
}

function updateShopRows() {
  if (window.matchMedia(`(min-width: ${shopBreakpointSm}px)`).matches) {
    setFixedShopRows(2);
  } else {
    setFixedShopRows(3);
  }
}

window.addEventListener('load', updateShopRows);
window.addEventListener('resize', onlyWidth(updateShopRows));

//------------------------------------------------------------------------------
// Modal
//------------------------------------------------------------------------------
const modalStack = [];

function checkValidation(form) {
  if (form.checkValidity()) {
    return true;
  } else {
    form.reportValidity();
    return false;
  }
}

function openModal(modal, relatedElem) {
  if (!modal) {
    console.error('Null modal');
    return;
  }
  modal.classList.add('modal--active');
  lockPage();
  modal.addEventListener(
    'transitionend',
    () => modal.querySelector('.modal__close')?.focus(),
    { once: true },
  );
  enableAllTabs();
  disableTabsExcept(`[data-modal="${modal.dataset.modal}"]`);
  modalStack.push({ modal, relatedElem });
}

function closeModal(modal) {
  if (!modal) {
    console.error('Null modal');
    return;
  }
  modal.classList.remove('modal--active');
  unlockPage();
  enableAllTabs();
  modalStack.pop().relatedElem.focus();
  if (modalStack.length) {
    const activeModal = modalStack.slice(-1)[0].modal;
    disableTabsExcept(`[data-modal="${activeModal.dataset.modal}"]`);
  }
}

function modalCallback(callbackName, modal, target) {
  switch (callbackName) {
    case 'product':
      loadProduct(modal, target);
      return;
    case 'service':
      loadService(modal, target);
      return;
    case 'consultation':
      modal
        .querySelector('[data-service-icon]')
        .setAttribute('src', './img/sprite.svg#operator');
      modal.querySelector('[data-service-title]').innerHTML =
        'Подключение к ОФД';
      modal.querySelector('input[name=name]').value = target
        .closest('.consultation')
        .querySelector('input[name=name]').value;
      modal.querySelector('input[name=tel]').value = target
        .closest('.consultation')
        .querySelector('input[name=tel]').value;
      return;
  }
}

document.addEventListener('click', (event) => {
  if (event.target.dataset.modalOpen !== undefined) {
    if (
      event.target.dataset.modalCheckValidation !== undefined &&
      !checkValidation(event.target.closest('form'))
    ) {
      return;
    }
    const modal = document.querySelector(
      `[data-modal="${event.target.dataset.modalOpen}"]`,
    );
    if (event.target.dataset.modalCallback !== undefined) {
      modalCallback(event.target.dataset.modalCallback, modal, event.target);
    }
    openModal(modal, event.target);
    return;
  }

  if (event.target.closest('[data-modal-close]')) {
    const modal = event.target.closest('.modal');
    closeModal(modal);
    return;
  }
});

document.addEventListener('pointerdown', event => {
  if (!event.target.closest('[data-modal]')) return;

  if (event.target.dataset.modalCloseStrict !== undefined) {
    const modal = event.target.closest('.modal');
    closeModal(modal);
    return;
  }
});

function copyData({ rootFrom, rootTo, createAttr, listKeys }) {
  listKeys
    .map((item) => {
      if (typeof item == 'string') {
        item = { key: item };
      }
      item = {
        key: item.key,
        copyInner: item.copyInner ?? true,
        copyDataValue: item.copyDataValue ?? true,
        callback: item.callback ?? (() => {}),
      };
      return item;
    })
    .forEach((item) => {
      const dataAttr = createAttr(item.key);
      const elemFrom = rootFrom.querySelector(`[${dataAttr}]`);
      rootTo.querySelectorAll(`[${dataAttr}]`).forEach((elemTo) => {
        if (item.copyDataValue) {
          copyAttributes(elemFrom, elemTo, [dataAttr]);
        }
        item.callback(elemFrom, elemTo);
        if (item.copyInner) {
          elemTo.innerHTML = elemFrom.innerHTML;
        }
      });
    });
}

//------------------------------------------------------------------------------
// Product
//------------------------------------------------------------------------------
function loadProduct(modal, target) {
  const card = target.closest('[data-product]');
  copyData({
    rootFrom: card,
    rootTo: modal,
    createAttr: (key) => `data-product-${key}`,
    listKeys: [
      {
        key: 'image',
        copyInner: false,
        // elem = picture
        callback: (fromElem, toElem) => {
          copyAttributes(
            fromElem.querySelector('img'),
            toElem.querySelector('img'),
            ['src', 'alt'],
          );
          copyAttributes(
            fromElem.querySelector('source'),
            toElem.querySelector('source'),
            ['srcset'],
          );
        },
      },
      'title',
      'duration',
      'total-price',
      {
        key: 'price-per-item',
        copyInner: false,
        // elem = input[hidden]
        callback: (fromElem, toElem) => {
          toElem.value = fromElem.value;
        },
      },
      {
        key: 'quantity',
        copyInner: false,
        // elem = input[number]
        callback: (fromElem, toElem) => {
          toElem.value = fromElem.value;
        },
      },
    ],
  });
}

document.addEventListener('input', (event) => {
  if (event.target.dataset.productQuantity !== undefined) {
    const rootProduct = event.target.closest('[data-product]');
    const number = +event.target.value;
    const price = +rootProduct.querySelector('[data-product-price-per-item]')
      .value;
    rootProduct.querySelector('[data-product-total-price]').innerHTML = String(
      (number * price).toLocaleString('ru-RU'),
    );
  }
});

window.addEventListener('load', () => {
  document.querySelectorAll('.card__price').forEach((elem) => {
    elem.innerHTML = (+elem.innerHTML).toLocaleString('ru-RU');
  });
});

//------------------------------------------------------------------------------
// Product Order
//------------------------------------------------------------------------------
document
  .querySelector('.modal-order__submit')
  .addEventListener('click', (event) => {
    event.preventDefault();
  });

//------------------------------------------------------------------------------
// Service
//------------------------------------------------------------------------------
function loadService(modal, target) {
  const serviceItem = target.closest('[data-service-item]');
  copyData({
    rootFrom: serviceItem,
    rootTo: modal,
    createAttr: (key) => `data-service-${key}`,
    listKeys: [
      {
        key: 'icon',
        copyInner: false,
        // elem = img
        callback: (fromElem, toElem) => {
          copyAttributes(fromElem, toElem, ['alt', 'src']);
        },
      },
      'title',
    ],
  });
}

//------------------------------------------------------------------------------
// Feedback
//------------------------------------------------------------------------------
const swiper = new Swiper('.swiper', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 10,
  modules: [Navigation],
  navigation: {
    nextEl: '.feedback__button-navigation--right',
    prevEl: '.feedback__button-navigation--left',
  },
  breakpoints: {
    680: {
      spaceBetween: 30,
    },
  },
});

//------------------------------------------------------------------------------
// Input-number
//------------------------------------------------------------------------------
const inputNumberElems = document.querySelectorAll('.input-number');
inputNumberElems.forEach((elem) => {
  const inputElem = elem.querySelector('input');
  inputElem.addEventListener(
    'input',
    () => (inputElem.style.width = `${inputElem.value.length}ch`),
  );
  elem
    .querySelector('.input-number__button--minus')
    .addEventListener('click', () => {
      const newValue = +inputElem.value - 1;
      inputElem.value =
        inputElem.min.length && newValue < inputElem.min
          ? inputElem.value
          : newValue;
      inputElem.dispatchEvent(new Event('input', { bubbles: true }));
    });
  elem
    .querySelector('.input-number__button--plus')
    .addEventListener('click', () => {
      const newValue = +inputElem.value + 1;
      inputElem.value =
        inputElem.max.length && newValue > inputElem.max
          ? inputElem.value
          : newValue;
      inputElem.dispatchEvent(new Event('input', { bubbles: true }));
    });
});

//------------------------------------------------------------------------------
// Select
//------------------------------------------------------------------------------
document.addEventListener('click', (event) => {
  if (event.target.closest('.select--active') === null) {
    document
      .querySelectorAll('.select--active')
      .forEach((elem) => elem.classList.remove('select--active'));
  }

  if (event.target.closest('.select') !== null) {
    event.target.closest('.select').classList.toggle('select--active');
    return;
  }
});

document.addEventListener('change', (event) => {
  if (event.target.classList.contains('select__input-radio')) {
    const elemSelect = event.target.closest('.select');
    const elemPick = elemSelect.querySelector('.select__pick');
    const elemLabel = event.target.nextElementSibling;
    elemPick.classList.remove('select__pick--waiting');
    elemPick.classList.add('select__pick--selected');
    elemPick.innerHTML = elemLabel.innerHTML;
    elemSelect
      .querySelector('.select__pick')
      .dispatchEvent(new Event('click', { bubbles: true }));
  }
});

document.addEventListener('focusout', (event) => {
  if (
    event.target?.closest('.select')?.classList.contains('select--active') ===
      true &&
    !(
      event.relatedTarget === null ||
      event.target.closest('.select') == event.relatedTarget.closest('.select')
    )
  ) {
    event.target.closest('.select').classList.remove('select--active');
  }
});

//------------------------------------------------------------------------------
// Button show more
//------------------------------------------------------------------------------
const elemConfigurationList = document.querySelector('.modal-order__list');
const buttonMore = document.querySelector('.modal-order__more');

window.addEventListener('load', () => {
  const max = +elemConfigurationList.dataset.listMax;
  [...elemConfigurationList.children].forEach((elem, index) => {
    if (index >= max) {
      elem.style.display = 'none';
    }
  });
  elemConfigurationList.style.height = `${elemConfigurationList.scrollHeight}px`;
  buttonMore.style.maxHeight = `${buttonMore.scrollHeight}px`;
});

buttonMore.addEventListener('click', () => {
  [...elemConfigurationList.children].forEach((elem, index) => {
    elem.style.removeProperty('display');
  });
  elemConfigurationList.style.height = `${elemConfigurationList.scrollHeight}px`;
  elemConfigurationList.style.marginBottom = `0px`;
  buttonMore.style.maxHeight = '0px';
  buttonMore.style.transform = 'scaleY(0)';
  buttonMore.style.visibility = 'hidden';
});

//------------------------------------------------------------------------------
// Tel mask
//------------------------------------------------------------------------------
const maskTel = '+7 (___) ___-__-__';
const startIndex = 4;
const mapNumbers = new WeakMap();

document.addEventListener('focusin', (event) => {
  if (!isTelInput(event.target)) return;

  if (event.target.value == '') {
    event.target.value = maskTel;
    mapNumbers.set(event.target, '');
  }
});
document.addEventListener('focusout', (event) => {
  if (!isTelInput(event.target)) return;

  if (event.target.value == maskTel) {
    event.target.value = '';
  }
});

document.addEventListener('input', (event) => {
  if (!isTelInput(event.target)) return;

  const selectionStart = event.target.selectionStart;
  const selectionEnd = event.target.selectionEnd;
  const relativeIndex = event.target.value
    .slice(Math.max(selectionStart, startIndex))
    .search(/\d/);
  let cursor =
    relativeIndex != -1 ? Math.max(selectionStart, startIndex) : undefined;
  let i = 0;
  let numberValue = getClearNumber(event.target.value);
  let callback;

  switch (event.inputType) {
    case 'deleteContentBackward':
      callback = deleteContentBackward;
      break;
    case 'deleteContentForward':
      callback = deleteContentForward;
      break;
  }
  if (callback != undefined) {
    ({ cursor, numberValue } = callback({
      event,
      selectionStart,
      relativeIndex,
      cursor,
      numberValue,
    }));
  }

  event.target.value = maskTel.replace(/_/g, (char, offset) => {
    if (i < numberValue.length) {
      return numberValue.charAt(i++);
    } else {
      if (char == '_') {
        cursor = cursor ?? offset;
      }
      return char;
    }
  });

  mapNumbers.set(event.target, numberValue);
  if (isMobile() && event.inputType == 'deleteContentBackward') {
    setTimeout(() => event.target.setSelectionRange(cursor ?? selectionStart, cursor ?? selectionEnd), 0);
  } else {
    event.target.setSelectionRange(cursor ?? selectionStart, cursor ?? selectionEnd);
  }
});

function isTelInput(elem) {
  return 'telMask' in elem.dataset;
}

function getClearNumber(value) {
  return value.slice(2).replace(/\D/g, '');
}

function deleteContentBackward({
  event,
  selectionStart,
  relativeIndex,
  cursor,
  numberValue,
}) {
  if (
    selectionStart >= startIndex &&
    numberValue.length == mapNumbers.get(event.target).length
  ) {
    if (relativeIndex == -1) {
      numberValue = numberValue.slice(0, -1);
      cursor = cursor == undefined ? undefined : cursor - 1;
    } else {
      const { index: removeIndex } = event.target.value
        .slice(0, selectionStart)
        .match(/(\d)\D*$/);
      numberValue = getClearNumber(
        event.target.value.slice(0, removeIndex) +
          event.target.value.slice(removeIndex + 1),
      );
      cursor = removeIndex;
    }
  }
  return { cursor, numberValue };
}

function deleteContentForward({
  event,
  selectionStart,
  relativeIndex,
  cursor,
  numberValue,
}) {
  if (
    selectionStart >= startIndex &&
    numberValue.length == mapNumbers.get(event.target).length
  ) {
    if (relativeIndex != -1) {
      const removeIndex =
        event.target.value.slice(selectionStart).match(/\d/).index +
        selectionStart;
      numberValue = getClearNumber(
        event.target.value.slice(0, removeIndex) +
          event.target.value.slice(removeIndex + 1),
      );
    }
  }
  return { cursor, numberValue };
}
