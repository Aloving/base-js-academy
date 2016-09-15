window.onload = function(){
  var loadedData = null;
  var container = document.querySelector('.pictures');

  getPictures();
  function renderPictures(pictures){
    pictures.forEach(function(picture){
      var element = templateFunction(picture);
      container.appendChild(element);
    });
  };


  function getPictures(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','data/pictures.json');
    xhr.onload = function(evt){
      var rawData = evt.target.response;
      var loadedPictures = JSON.parse(rawData);
      renderPictures(loadedPictures)
    };
    xhr.send()
  };

  function templateFunction(item){
    var template = document.querySelector('#picture-template');
    var element = template.content.children[0].cloneNode(true);
    element.querySelector('.picture-comments').textContent = item.comments;
    element.querySelector('.picture-likes').textContent = item.likes;
    var backImage = new Image();
    var imageElement = element.querySelector('img');
    var backgroundLoadTimeout;
    var IMAGE_LOAD_TIMEOUT = 10000;
    backImage.src = item.url;
    backImage.onload = function(event){
      clearTimeout(backgroundLoadTimeout);
      imageElement.src = event.target.src;
      imageElement.width = 182;
      imageElement.height = 182;
    };
    backImage.onerror = function(){
      element.classList.add('picture-load-failure');
    };
    backgroundLoadTimeout = setTimeout(function() {
        imageElement.src = '';
        element.classList.add('picture-load-failure');
          }, IMAGE_LOAD_TIMEOUT);
    return element;
  };
}
