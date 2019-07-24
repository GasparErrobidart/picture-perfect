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
        originalSrcset : node.getAttribute('srcset') || "",
        originalDataSrcset : node.getAttribute('data-srcset') || ""
      })
    }
  };

  var proximityThreshold  = window.innerHeight/2;
  try {
    proximityThreshold = eval(picture.getAttribute("data-threshold")) || proximityThreshold
  } catch(e){
    console.log(e)
  };
  var automaticSizes      = picture.getAttribute("data-automatic-sizes") == "false" || true;
  var automaticSrcset     = picture.getAttribute("data-automatic-srcset") == "false" || true;
  var densities 		      = (picture.getAttribute('data-densities') || "1").split(",").map( function(n) {return parseFloat(n)});
  var url						      = picture.getAttribute('data-dynamic-url') || "";

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
      var srcset = [];
      // GENERATE THE SRCSET FOR THIS SPECIFIC WIDTH
      if(url && automaticSrcset ){
        srcset = densities.map(function(n){
          var width = Math.ceil(elementWidth * n);
          return url
            .replace(/\$\{format\}/gi, format.replace(/jpeg/gi,"jpg") )
            .replace(/\$\{width\}/gi , width ) +" "+ width +"w";
        });
      }

      // CONCATE THE ORIGNAL SRCSET IF THERE'S ONE
      if(source.originalSrcset) srcset.push(source.originalSrcset);
      if(source.originalDataSrcset) srcset.push(source.originalDataSrcset);
      source.dom.setAttribute("srcset",srcset.join(','));
    });
  }

  // ON VIEWPORT RESIZE
  var onResize = function(){
    if(automaticSizes) setElementSizes(img);
    if(maxWindowSize < window.innerWidth){
      maxWindowSize = window.innerWidth;
      updateSources();
    }
  }


  // ON VIEWPORT PROXIMITY
  var onProximity = function(){
    // CALCULATE ELEMENT SIZES ATTRIBUTE
    if(automaticSizes) setElementSizes();
    updateSources();
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

// WRAPPER FOR EXECUTING JUST IN TIME INITIALIZATION
var JIT_PICTURE_PERFECT = function(el){
  new PicturePerfect(el);
  el.onload = null;
}
