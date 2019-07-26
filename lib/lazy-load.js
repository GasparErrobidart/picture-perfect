// Picture perfect
PicturePerfect.prototype.lazyLoad(){

  var onScroll,rect,
  self                = this,
  proximityThreshold  = window.innerHeight/2,
  img                 = self.img;

  try {
    proximityThreshold = eval(img.getAttribute("lazy-load-threshold")) || proximityThreshold
  } catch(e){
    console.log(e)
  };

  // LAZY LOAD / ON SCROLL
  onScroll = function(){
    rect = img.getBoundingClientRect();
    if(rect.top - window.innerHeight < proximityThreshold){
      window.removeEventListener("scroll",onScroll);
      var src    = img.getAttribute("lazy-load-src");
      var srcset = img.getAttribute("lazy-load-srcset");
      if(src) img.setAttribute("src",src);
      self.onProximity();
    }
  };
  window.addEventListener("scroll",onScroll);
  onScroll();
}
