PicturePerfect.prototype.mimicBackgroundImage = function(el){
  var bgWrapper           = img.closest('.bg-image-wrapper');
  var container;

  var mimicBackground     = picture.getAttribute("data-mimic-background") !== "false" || true;

  if(!container) container = img.closest('.mimic-background-container');
  if(!container) return false;
  if(bgWrapper){

    var style               = bgWrapper.currentStyle || window.getComputedStyle(bgWrapper);
    var bgCover             = style.backgroundSize == "cover";
    var bgContain           = style.backgroundSize == "contain";

    var bgPosition          = style.backgroundPosition.split(" ");
    var bgHorizontal        = bgPosition[0];
    var bgVertical          = bgPosition[1];


    console.log(bgPosition);

    var a = container.getBoundingClientRect();
    var b = img.getBoundingClientRect();
    var width_if_height_was_100 = (b.width/b.height) * a.height;
    var height_if_width_was_100 = (b.height/b.width) * a.width;
    var newWidth = a.width;
    var newHeight = a.height;


    // MIMIC BACKGROUND COVER
    if(bgCover){
      if(width_if_height_was_100 >= a.width){
        newWidth = width_if_height_was_100;
      }else{
        newHeight = (b.height/b.width) * a.width;
      }
      img.style.width   = width_if_height_was_100 >= a.width  ? "auto" : "100%";
      img.style.height  = width_if_height_was_100 >= a.width  ? "100%" : "auto";
    }

    // MIMIC BACKGROUND CONTAIN
    else if(bgContain){
      if(width_if_height_was_100 >= a.width){
        newHeight = (b.height/b.width) * a.width;
      }else{
        newWidth = width_if_height_was_100;
      }
      img.style.width   = width_if_height_was_100 >= a.width  ? "100%" : "auto";
      img.style.height  = width_if_height_was_100 >= a.width  ? "auto" : "100%";
    }



    console.log("bgPosition",bgHorizontal,bgVertical);

    // MIMI BACKGROUND POSITION
    if( bgHorizontal.indexOf('px') > -1 ){
      img.style.left = bgHorizontal;
    }else if( bgHorizontal.indexOf('%') > -1 ){
      var percent = parseFloat(bgHorizontal.replace("%",''));
      img.style.left = ( ( a.width  - newWidth ) *  (percent/100) )+ "px";
    }else{
      img.style.left = ( (a.width  - newWidth)  / 2 )+ "px";
    }

    if( bgVertical.indexOf('px') > -1 ){
      img.style.top = bgVertical;
    }else if( bgVertical.indexOf('%') > -1 ){
      var percent = parseFloat(bgVertical.replace("%",''));
      img.style.top = ( ( a.height  - newHeight ) *  (percent/100) )+ "px";
    }else{
      img.style.top = ( (a.height  - newHeight)  / 2 )+ "px";
    }

  }
}
