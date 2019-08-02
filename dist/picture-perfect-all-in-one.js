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
      self.initialized = true;
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
PicturePerfect.prototype.getDynamicEndpoint = function(url,params){
  if(!url) return;
  var self = this;
  params  = params  || {};
  if(!params.density) params.density = "1";
  var density = parseFloat(params.density);
  var rect = self.img.getBoundingClientRect();
  var elementWidth 	  = Math.ceil(rect.width)  || 100;
  var elementHeight 	= Math.ceil(rect.height);
  params.rawWidth  = rect.width;
  params.rawHeight = rect.height;
  params.width  = Math.ceil(elementWidth * density);
  params.height = Math.ceil(elementHeight * density);
  Object.keys(params).forEach(function(key){
    var exp = new RegExp("\\$\\{"+key+"\\}",'gi');
    url = url.replace(exp,params[key]);
  });

  return {url : url, params : params};
}

PicturePerfect.prototype.extractDynamicSourceOptions = function(el){
  var options = {
    dynamicSrcDensity                   : el.getAttribute('dynamic-src-density') || ""+window.devicePixelRatio,
    dynamicSrc                          : el.getAttribute('dynamic-src'),
    dynamicSrcSetDensities              : el.getAttribute('dynamic-srcset-densities') || ""+window.devicePixelRatio,
    dynamicSrcSet                       : el.getAttribute('dynamic-srcset'),
    dynamicBackgroundImageDensity       : el.getAttribute('dynamic-background-url-density') || ""+window.devicePixelRatio,
    dynamicBackgroundImage              : el.getAttribute('dynamic-background-image'),
    mime                                : (el.getAttribute("type") || "").replace("image/","")
  };
  Object.keys(options).forEach(function(key){
    if(!options[key]) delete options[key];
  });
  return options;
}

PicturePerfect.prototype.updateSources = function(img){
  var self      = this;
  var parent    = img.parentElement;
  var defaults  = {};
  var elements  = [img];

  if( parent && /picture/gi.test(parent.tagName) ){
    defaults = self.extractDynamicSourceOptions(parent);
    for(var i = 0; i < parent.childNodes.length; i++){
      if(/source/gi.test(parent.childNodes[i].tagName)) elements.push(parent.childNodes[i]);
    };
  }

  elements.forEach(function(node){
    var options = Object.assign({},defaults,self.extractDynamicSourceOptions(node));
    ['dynamicSrc','dynamicBackgroundImage'].forEach(function(key){
      if(options[key]){
        var params   = { density : options[key+"Density"] , mime : options.mime };
        var endpoint = self.getDynamicEndpoint(options[key],params);
        if(key == 'dynamicSrc') node.setAttribute('src',endpoint.url);
        else node.style.backgroundImage = "url(\""+endpoint.url+"\")";
      }
    });

    if(options.dynamicSrcSet){
      var srcset = [];
      options.dynamicSrcSetDensities.split(',').forEach(function(density){
        var params   = { density : density , mime : options.mime };
        var endpoint = self.getDynamicEndpoint(options.dynamicSrcSet,params);
        srcset.push( endpoint.url + " "+ endpoint.params.width +"w" );
      });
      node.setAttribute("srcset",srcset.join(","));
    }

  });
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
