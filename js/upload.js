/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';
(function() {
  /** @enum {string} */


/*Функция добавления кукисов
**name,value options {}
*/

  function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}





  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
      if ((+xInput.value + +sizeInput.value) > currentResizer._image.naturalWidth
      || (+yInput.value + +sizeInput.value) > currentResizer._image.naturalHeight
      || xInput.value < 0 || yInput.value < 0){
        return false;
      }else{
      return true;
    }
  }
   /**
   * Активирует/Деактивирует, кнопку отправки формы кадрирования.
   */
  function toggleFormSubmit() {
    var resizeBtn = document.querySelector('#resize-fwd');
    if (resizeFormIsValid()) {
      resizeBtn.disabled = false;
    }else {
      resizeBtn.disabled = true;
    }
  }

  /**
   * Задает фильтр по умолчанию из cookie.
   */
   //функция получения куки
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


  function addFilterForm() {
    var none = document.querySelector('#upload-filter-none');
    var chrome = document.querySelector('#upload-filter-chrome');
    var sepia = document.querySelector('#upload-filter-sepia');

    switch (browserCookies.get('upload-filter')) {
      case none.value:
        none.checked = true;
        break;

      case chrome.value:
        chrome.checked = true;
        break;

      case sepia.value:
        sepia.checked = true;
        break;

      case marvin.value:
        marvin.checked = true;
        break;
    }
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  // Поля формы кадрирования изображения.
  var xInput = resizeForm.elements.x;
  var yInput = resizeForm.elements.y;
  var sizeInput = resizeForm.elements.size;

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change',function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });
  /**
   * Обработка ввода значений в поле формы кадрирования.
   */

  resizeForm.addEventListener('input',function() {
    var maxInputX = currentResizer._image.naturalWidth - sizeInput.value;
    var maxInputY = currentResizer._image.naturalHeight - sizeInput.value;

    if (xInput.value < 0) {
      xInput.value = 0;
    }else if (xInput.value > maxInputX) {
      xInput.value = maxInputX;
    }

    if (yInput.value < 0) {
      yInput.value = 0;
    }else if (yInput.value > maxInputY) {
      yInput.value = maxInputY;
    }

    toggleFormSubmit();
  });
  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    var radio = filterForm.querySelectorAll('[type=radio]');
    var typeFilter;

    for (var i = 0; i < radio.length; i++) {
      if (radio[i].checked) {
        typeFilter = radio[i].value;
      }
    }
    console.log(typeFilter);
    // Текущая дата.
    var currentDate = new Date();
    // Текущая дата, миллисекунды.
    var msCurrentDate = currentDate.getTime();
    // Текущий год.
    var currentYear = currentDate.getFullYear();

    // Дата последнего прошедшего дня рождения
    var byDay = new Date(currentYear - 1, 9, 15);
    // Дата последнего прошедшего дня рождения в миллисекундах
    var byDayMs = byDay.getTime();

    // Дата окончания хранения cookie.
    var expDate = new Date(msCurrentDate + (msCurrentDate - byDayMs));

    // Записываем в cookie выбранный фильтр и дату.
    setCookie('upload-filter', typeFilter, {expires: expDate.toUTCString()});

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });
  var resizeForms = document.querySelectorAll('.upload-resize-controls');
  var picY = document.querySelector('#resize-y');
  var picX = document.querySelector('#resize-x');
  var picSide = document.querySelector('#resize-size');
window.addEventListener('resizerchange',function(){
  if(currentResizer){
    var cropValues = currentResizer.getConstraint();
    picSide.value = cropValues.side;
    picX.value = cropValues.x;
    picY.value = cropValues.y;
    resizeFormIsValid();
  }
});
resizeForm.addEventListener('input',function(evt){
  var clickedElement = evt.target;
  if(clickedElement.classList.contains('upload-resize-control')){
    resizeFormIsValid();
    currentResizer.setConstraint(+picX.value, +picY.value, +picSide.value);
  }
});
  cleanupResizer();
  updateBackground();
})();
