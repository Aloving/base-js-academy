(function(){

  function Picture (data) {
    this._data = data;
    console.log(data);
  }

  Picture.prototype.render = function(){

    var comments  = this._data.comments;

    console.log(comments);
  //
  //
  //   var template = document.querySelector('#picture-template');
  //   var element = template.content.children[0].cloneNode(true);
  //   var backImage = new Image();
  //   var imageElement = element.querySelector('img');
  //   var backgroundLoadTimeout;
  //   var IMAGE_LOAD_TIMEOUT = 10000;
  //
  //
  //   this.element.querySelector('.picture-comments').textContent = item.comments;
  //   this.element.querySelector('.picture-likes').textContent = item.likes;
  //
  //
  //   backImage.src = item.url;
  //
  //
  //   backImage.onload = function(event){
  //     clearTimeout(backgroundLoadTimeout);
  //     imageElement.src = event.target.src;
  //     imageElement.width = 182;
  //     imageElement.height = 182;
  //   };
  //
  //
  //   backImage.onerror = function(){
  //     element.classList.add('picture-load-failure');
  //   };
  //
  //
  //   backgroundLoadTimeout = setTimeout(function() {
  //       imageElement.src = '';
  //       element.classList.add('picture-load-failure');
  //         }, IMAGE_LOAD_TIMEOUT);
  };

  window.Picture = Picture;
})();
