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
  return element;
}



}
