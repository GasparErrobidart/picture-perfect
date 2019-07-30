PicturePerfect.prototype.mimicBackgroundImage = function(img){
  var
  bgWrapper               = img.closest('[mimic-background-image-wrapper]'),
  container               = img.closest('[mimic-background-image-container]');

  if(!container || !bgWrapper) return false;


  // BG WRAPPER IS THE PARENT OF THE IMAGE TAG THAT APPLIES CSS BACKGROUND-IMAGE PROPERTIES
  var style               = bgWrapper.currentStyle || window.getComputedStyle(bgWrapper);


  // ------------------------ MIMIC SIZING ------------------------

  var bgCover             = style.backgroundSize == "cover";
  var bgContain           = style.backgroundSize == "contain";
  var a = container.getBoundingClientRect();
  var b = img.getBoundingClientRect();
  var width_if_height_was_100 = (b.width/b.height) * a.height;
  var height_if_width_was_100 = (b.height/b.width) * a.width;
  var newWidth = a.width;
  var newHeight = a.height;

  // = MIMIC BACKGROUND COVER
  if(bgCover){
    if(width_if_height_was_100 >= a.width){
      newWidth = width_if_height_was_100;
    }else{
      newHeight = (b.height/b.width) * a.width;
    }
  }

  // = MIMIC BACKGROUND CONTAIN
  else if(bgContain){
    if(width_if_height_was_100 >= a.width){
      newHeight = (b.height/b.width) * a.width;
    }else{
      newWidth = width_if_height_was_100;
    }
  }

  img.style.width   = newWidth  + "px";
  img.style.height  = newHeight + "px";

  // ------------------------ MIMIC POSITIONING ------------------------

  var bgPosition          = style.backgroundPosition.split(" "); // POSITIONING
  var bgHorizontal        = bgPosition[0];
  var bgVertical          = bgPosition[1];

  console.log("bgPosition",bgHorizontal,bgVertical);

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
