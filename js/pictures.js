
  var loadedData = null;
  var container = document.querySelector('.pictures');

  var filters = document.querySelectorAll('.filters-radio');
  var activeFilter = 'filter-popular';
  var pictures = [];
  for(var i = 0; i < filters.length; i++){
    filters[i].onclick = function(evt){
      var clickedElementID = evt.target.id;
      activeFilter = evt.target.class;
      setActiveFilter(clickedElementID);
    };
  };


  function setActiveFilter(id){
    if(activeFilter === id){
      return
    }
    var filteredPictures = pictures.slice(0);

    switch(id){
      case 'filter-popular':
        filteredPictures = pictures.slice(0);
      break;
      case 'filter-new':
        filterePictures = pictures.slice(0);
        filteredPictures = filteredPictures.sort(function(a,b){
          return Date.parse(a.date) - Date.parse(b.date);
        });
      break;
      case 'filter-discussed':
        filterePictures = pictures.slice(0);
        filteredPictures = filteredPictures.sort(function(a,b){
          return b.comments - a.comments;
        });
      break;
    }

    renderPictures(filteredPictures);
  };

  getPictures();


  function renderPictures(pictures){
    container.innerHTML = '';
    var fragment = document.createDocumentFragment();
    pictures.forEach(function(picture){
      var element = templateFunction(picture);
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  };


  function getPictures(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','data/pictures.json');
    xhr.onload = function(evt){
      var rawData = evt.target.response;
      pictures = JSON.parse(rawData);
      renderPictures(pictures)
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
