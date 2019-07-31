// Picture perfect constructor
function PicturePerfect(img,options){
  var self = this;
  options = options || {};
  self.options = options;
  self.img = img;
  self.img.className = self.img.className += " picture-perfect";
  self.initialized = !(options.lazy != false && self.lazyLoad);
  self.maxWindowSize = window.innerWidth;

  self._calculateSizes = function(){
    if(options.calculateSize != false && self.setElementSize){
      self.setElementSize(img);
    }
  }


  self._updateSources = function(){
    if(options.dynamicSources != false && self.updateSources){
      self.updateSources(self.img);
    }
  }


  self._mimicBackgroundImage = function(){
    if(options.mimicBackgroundImage != false && self.mimicBackgroundImage){
      self.mimicBackgroundImage(self.img);
    }
  }


  // ON VIEWPORT PROXIMITY
  self.onProximity = function(){
    self.initialized = true;
    self.img.className = self.img.className += " picture-perfect-ready";
    self.img.addEventListener("load",self.onLoad);
    window.addEventListener("resize",function(){
      setTimeout(self.onResize,100);
    });
    self._calculateSizes();
    self._updateSources();
  }


  self.onResize = function(){
    if(self.maxWindowSize < window.innerWidth){
      self.maxWindowSize = window.innerWidth;
      self._updateSources();
    }
    self._calculateSizes();
    self._mimicBackgroundImage();
  }


  self.onLoad = function(ev){
    self._mimicBackgroundImage();
  }


  self.initialized ? self.onProximity() : self.lazyLoad();
  self._mimicBackgroundImage();
}

// WRAPPER FOR EXECUTING JUST IN TIME INITIALIZATION
var JIT_IMG = function(el,options){
  new PicturePerfect(el,options);
  el.onload = null;
}
// LAZY LOAD ATTRIBUTES
PicturePerfect.prototype.lazyLoadAttributes = function(el,attributes){
  attributes.forEach( function(attr){
    var value = el.getAttribute("lazy-"+attr);
    if(attr == 'background-image' && value) el.style.backgroundImage = "url(\""+value+"\")" ;
    else if(value) el.setAttribute(attr,value);
  });
}

// LAZY LOAD
PicturePerfect.prototype.lazyLoad = function(){
  var onScroll,rect,
  self                = this,
  proximityThreshold  = window.innerHeight/2,
  img                 = self.img;

  try {
    proximityThreshold = eval(img.getAttribute("lazy-threshold")) || proximityThreshold
  } catch(e){
    console.log(e)
  };

  // LAZY LOAD / ON SCROLL
  onScroll = function(){
    rect = img.getBoundingClientRect();
    if(rect.top - window.innerHeight < proximityThreshold){
      window.removeEventListener("scroll",onScroll);
      self.lazyLoadAttributes( img , ['src','srcset','background-image'] );
      self.onProximity();
    }
  };

  window.addEventListener("scroll",onScroll);
  onScroll();
}
PicturePerfect.prototype.handPickSizeFor = function(el){
  return Math.ceil(( el.getBoundingClientRect().width / window.innerWidth) * 100) + "vw";
}

PicturePerfect.prototype.setElementSize = function(el){
  el.setAttribute("sizes",this.handPickSizeFor(el));
}
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

    console.log("Bg position",bgHorizontal,bgVertical);

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