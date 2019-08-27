PicturePerfect.prototype.getCurrentSrcSize = function(img,next){
  var tmpImg = new Image();
  tmpImg.onload = function() {
    next({width: tmpImg.width, height: tmpImg.height});
  }
  tmpImg.src  = img.currentSrc;
}

PicturePerfect.prototype.mimicBackgroundImage = function(img){
  var
  self        = this,
  bgWrapper   = img.closest('[mimic-background-image-wrapper]'),
  container   = img.closest('[mimic-background-image-container]');

  if(!container || !bgWrapper) return false;
  // GET CURRENT IMAGE NEW SIZE
  self.getCurrentSrcSize(img,function(b){


    // BG WRAPPER IS THE PARENT OF THE IMAGE TAG THAT APPLIES CSS BACKGROUND-IMAGE PROPERTIES
    var
    style               = bgWrapper.currentStyle || window.getComputedStyle(bgWrapper),

    // ------------------------ MIMIC SIZING ------------------------


    bgCover                 = style.backgroundSize == "cover",
    bgContain               = style.backgroundSize == "contain",
    a                       = container.getBoundingClientRect(),
    width_if_height_was_100 = (b.width/b.height) * a.height,
    height_if_width_was_100 = (b.height/b.width) * a.width,
    newWidth                = a.width,
    newHeight               = a.height,
    snapToHeight              = width_if_height_was_100 >= a.width;


    // = MIMIC BACKGROUND COVER
    if(bgCover){
      if(snapToHeight){
        newWidth = width_if_height_was_100;
      }else{
        newHeight = (b.height/b.width) * a.width;
      }
      img.style.width   = snapToHeight ? "auto" : "100%" ;
      img.style.height  = snapToHeight ? "100%" : "auto" ;
    }

    // = MIMIC BACKGROUND CONTAIN
    else if(bgContain){
      if(snapToHeight){
        newHeight = (b.height/b.width) * a.width;
      }else{
        newWidth = width_if_height_was_100;
      }
      img.style.width   = snapToHeight ? "100%" : "auto" ;
      img.style.height  = snapToHeight ? "auto" : "100%" ;
    }



    // ------------------------ MIMIC POSITIONING ------------------------

    var bgPosition          = style.backgroundPosition.split(" "); // POSITIONING
    var bgHorizontal        = bgPosition[0];
    var bgVertical          = bgPosition[1];

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

  }); // END GET CURRENT SRC SIZE CALLBACK
}
