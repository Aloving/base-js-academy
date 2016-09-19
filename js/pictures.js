

  var container = document.querySelector('.pictures');
  var filters = document.querySelectorAll('.filters-radio');
  var activeFilter = 'filter-popular';
  var pictures = [];
  var currentPage = 0;
  var PAGE_SIZE = 12;
  var footer = document.querySelector('.footer');
  var footerHeight = footer.getBoundingClientRect().height;
  var visibleFooter  = function (){
    return footer.getBoundingClientRect().bottom - window.innerHeight <= footerHeight
  }
  getPictures();


  var filteredPictures = [];


  document.querySelector('.filters').addEventListener('click',function(evt){
    var clickeElement = evt.target;
    if(clickeElement.classList.contains('filters-radio')){
      setActiveFilter(clickeElement.id);
    }
  });
  // for(var i = 0; i < filters.length; i++){
  //   filters[i].onclick = function(evt){
  //     var clickedElementID = evt.target.id;
  //     setActiveFilter(clickedElementID);
  //   };
  // };


  function setActiveFilter(id){
    filteredPictures = pictures.slice(0);
    if(activeFilter === id){
      return
    }
    switch(id){
      case 'filter-popular':
        filteredPictures = pictures.slice(0);
        currentPage = 0;
      break;
      case 'filter-new':
        filterePictures = pictures.slice(0);
        filteredPictures = filteredPictures.sort(function(a,b){
          return Date.parse(a.date) - Date.parse(b.date);
        });
        currentPage = 0;
      break;
      case 'filter-discussed':
        filterePictures = pictures.slice(0);
        filteredPictures = filteredPictures.sort(function(a,b){
          return b.comments - a.comments;
        });
        currentPage = 0;
      break;
    }
    activeFilter = id;
    renderPictures(filteredPictures,0,true);
  };



  window.addEventListener('scroll', function(env){
    if(visibleFooter()){
      renderPictures(pictures,currentPage++);
    }
  })

  function renderPictures(pictures, pageNumber, replace){
    if(replace){
      container.innerHTML = '';
    };

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = pictures.slice(from, to);

    var fragment = document.createDocumentFragment();
    pagePictures.forEach(function(picture){
      var element = templateFunction(picture);
      fragment.appendChild(element);
    });
    container.appendChild(fragment);

    if(visibleFooter()){
      renderPictures(pictures,currentPage++);
    }
  }
  function getPictures(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','data/pictures.json');
    xhr.onload = function(evt){
      var rawData = evt.target.response;
      var picturesJSON = JSON.parse(rawData);
      pictures = picturesJSON;
      renderPictures(pictures,currentPage);
    };
    xhr.send()
  }
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
