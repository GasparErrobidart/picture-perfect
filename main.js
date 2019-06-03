function PicturePerfect(img){
  // CONFIGURATION
  var picture             = img.parentElement;
  var maxWindowSize       = window.innerWidth;
  var sources             = [];

  for(var i = 0; i < picture.childNodes.length;i++){
    var node = picture.childNodes[i];
    if(node.tagName && node.tagName == "SOURCE"){
      sources.push({
        dom : node,
        format : node.getAttribute("type").replace("image/",""),
        originalSrcset : node.getAttribute('srcset') || ""
      })
    }
  };

  var proximityThreshold  = picture.getAttribute("data-threshold") || window.innerHeight/2;
  var automaticSizes      = picture.getAttribute("data-automatic-sizes") == "false" || true;
  var automaticSrcset     = picture.getAttribute("data-automatic-srcset") == "false" || true;
  var densities 		      = (picture.getAttribute('data-densities') || ["1"]).split(",").map( function(n) {return parseFloat(n)});
  var url						      = picture.getAttribute('data-dynamic-url') || new Error("'data-dynamic-url' must be provided.");

  // GET HAND PICKED ELEMENT SIZE
  function handPickSizeFor(){
    return Math.ceil(( img.getBoundingClientRect().width / window.innerWidth) * 100) + "vw";
  };

  // SET HAND PICKED ELEMENT SIZE
  function setElementSizes(dom){
    picture.childNodes.forEach(function(dom){
      if(dom.tagName && ["SOURCE","IMG"].indexOf(dom.tagName) > -1){
        dom.setAttribute("sizes",handPickSizeFor());
      };
    });
  };

  // UPDATE SOURCES
  function updateSources(){
    // GET THE CURRENT ELEMENT WIDTH
    var elementWidth 	= Math.ceil(img.getBoundingClientRect().width);
    sources.forEach(function(source){
      var format = source.format;
      // GENERATE THE SRCSET FOR THIS SPECIFIC WIDTH
      var srcset = densities.map(function(n){
        var width = Math.ceil(elementWidth * n);
        return url
          .replace(/\$\{format\}/gi, format.replace(/jpeg/gi,"jpg") )
          .replace(/\$\{width\}/gi , width ) +" "+ width +"w";
      }).join(",");
      // CONCATE THE ORIGNAL SRCSET IF THERE'S ONE
      if(source.originalSrcset) srcset += "," + source.originalSrcset;
      source.dom.setAttribute("srcset",srcset);
    });
  }

  // ON VIEWPORT RESIZE
  var onResize = function(){
    if(automaticSizes) setElementSizes(img);
    if(maxWindowSize < window.innerWidth){
      maxWindowSize = window.innerWidth;
      if(automaticSrcset) updateSources();
    }
  }


  // ON VIEWPORT PROXIMITY
  var onProximity = function(){
    // CALCULATE ELEMENT SIZES ATTRIBUTE
    if(automaticSizes) setElementSizes();
    if(automaticSrcset) updateSources();
    var tmo;
    window.addEventListener("resize",function(){
    	clearTimeout(tmo);
      tmo = setTimeout(onResize,100);
    });
  }


  // LAZY LOAD / ON SCROLL
  var onScroll = function(){
    var rect = img.getBoundingClientRect();
    if(rect.top - window.innerHeight < proximityThreshold){
      onProximity();
      window.removeEventListener("scroll",onScroll);
    }
  };
  window.addEventListener("scroll",onScroll);
  onScroll();

}

(function(){

  window.addEventListener('load',function(){
    // WATCH FOR ELEMENTS
    document.querySelectorAll('picture > img[make-picture-perfect]').forEach(PicturePerfect);
  });

})();
