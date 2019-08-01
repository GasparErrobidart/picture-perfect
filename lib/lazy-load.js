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
      var parent    = img.parentElement;
      if( parent && /picture/gi.test(parent.tagName) ){
        parent.childNodes.forEach(function(node){
          if(/source/gi.test(node.tagName)) self.lazyLoadAttributes( node , ['src','srcset','background-image'] );
        })
      }
      self.lazyLoadAttributes( img , ['src','srcset','background-image'] );
      self.onProximity();
    }
  };

  window.addEventListener("scroll",onScroll);
  onScroll();
}
