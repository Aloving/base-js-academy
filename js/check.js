function getMessage(a,b){
  if(a === true){
    return("Переданное GIF-изображение анимировано и содержит " +b+" кадров");
  }else if(a === false){
    return("Переданное GIF-изображение не анимировано");
  }else if(typeof(a) === "number"){
    return("Переданное SVG-изображение содержит "+a+" объектов и " +(b * 4)+"аттрибутов")
  }else if(Array.isArray(a)){
    var sum = 0;
    for(var i = a.length-1; i >= 0;i--){
      sum = sum + a[i];
    }
    return("Количество красных точек во всех строчках изображения: " + sum);
  }
  else if(Array.isArray(a) && Array.isArray(b)){
    var sum = [];
    for(var i = 0;a.length > i;i++){
      sum[i] = a[i] + b[i];
    }
    return("Общая площадь артефактов сжатия:"+sum+"пикселей");
  }
}

