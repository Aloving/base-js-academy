window.onload = function(){
  var container = document.querySelector('.pictures');

  pictures.forEach(function(picture){
    var element = templateFunction(picture);
    container.appendChild(element);
  });

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
  }
}
