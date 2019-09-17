// Picture perfect constructor
function PicturePerfect(img,options){
  var self = this;
  options = options || {};
  self.options = options;
  self.img = img;
  self.initialized = !(options.lazy != false && self.lazyLoad);
  self.maxWindowSize = window.innerWidth;
  self.picturefill = function(){};
  if(typeof picturefill != 'undefined') self.picturefill = picturefill;

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

  self.addClass = function(className){
    if(self.img.className.indexOf(className) == -1){
      setTimeout(function(){self.img.className = self.img.className += " " + className},10);
    }
  }

  self.removeClass = function(className){
    var reg = new RegExp(className,'gi');
    self.img.className = self.img.className.replace(reg,"");
  }


  // ON VIEWPORT PROXIMITY
  self.onProximity = function(){
    if(self.initialized){
      self.addClass('picture-perfect-ready');
      self.img.addEventListener("load",self.onLoad);
      window.addEventListener("resize",function(){
        setTimeout(self.onResize,100);
      });
      self._calculateSizes();
      self._updateSources();
      self.picturefill({reevaluate : true});
      self._mimicBackgroundImage();
    }
  }


  self.onResize = function(){
    if(self.maxWindowSize < window.innerWidth){
      self.maxWindowSize = window.innerWidth;
      self._updateSources();
    }
    self._calculateSizes();
    self.picturefill({reevaluate : true});
    self._mimicBackgroundImage();
  }


  self.onLoad = function(ev){
    self.addClass('picture-perfect-loaded');
    self._mimicBackgroundImage();
  }

  self.onLoadStart = function(ev){
    self.removeClass('picture-perfect-loaded');
  }

  self.img.addEventListener("loadstart",self.onLoadStart);
  self.addClass('picture-perfect');
  self.initialized ? self.onProximity() : self.lazyLoad();
  self._mimicBackgroundImage();
  window.addEventListener("load",function(){
    self.onProximity();
  });
}

// WRAPPER FOR EXECUTING JUST IN TIME INITIALIZATION
var JIT_IMG = function(el,options){
  new PicturePerfect(el,options);
  el.onload = null;
}
PicturePerfect.prototype.handPickSizeFor = function(el){
  return Math.ceil(( el.getBoundingClientRect().width / window.innerWidth) * 100) + "vw";
}

PicturePerfect.prototype.setElementSize = function(el){
  el.setAttribute("sizes",this.handPickSizeFor(el));
}
