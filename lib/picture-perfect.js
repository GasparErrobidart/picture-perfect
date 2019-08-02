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
    if(self.initialized){
      self.img.className = self.img.className += " picture-perfect-ready";
      self.img.addEventListener("load",self.onLoad);
      window.addEventListener("resize",function(){
        setTimeout(self.onResize,100);
      });
      self._calculateSizes();
      self._updateSources();
      self._mimicBackgroundImage();
    }
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
  window.addEventListener("load",function(){ self.onProximity() });
}

// WRAPPER FOR EXECUTING JUST IN TIME INITIALIZATION
var JIT_IMG = function(el,options){
  new PicturePerfect(el,options);
  el.onload = null;
}
