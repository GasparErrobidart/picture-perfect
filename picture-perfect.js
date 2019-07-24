// Element.closest() polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Picture perfect

function PicturePerfect(img){
  // CONFIGURATION
  var picture             = img.parentElement;
  var maxWindowSize       = window.innerWidth;
  var sources             = [];
  var bgWrapper           = img.closest('.bg-image-wrapper');
  var container;

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
  var automaticSizes      = picture.getAttribute("data-automatic-sizes") !== "false" || true;
  var automaticSrcset     = picture.getAttribute("data-automatic-srcset") !== "false" || true;
  var densities 		      = (picture.getAttribute('data-densities') || "1").split(",").map( function(n) {return parseFloat(n)});
  var url						      = picture.getAttribute('data-dynamic-url') || "";
  var mimicBackground     = picture.getAttribute("data-mimic-background") !== "false" || true;


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
    // THIS IS A SAFEGUARD IN CASE THAT FOR SOME REASON THE ELEMENT GETS A WIDTH OF 0
    // THAT COULD BREAK SRCSET
    if(elementWidth <= 0) elementWidth = 100;
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

  function simulateBG(img){
    if(!container) container = img.closest('.mimic-background-container');
    if(!container) return false;

    if(bgWrapper){
      var bgCover             = bgWrapper.style.backgroundSize == "cover";
      var bgContain           = bgWrapper.style.backgroundSize == "contain";
      var bgHorizontal        = 'center';
      var bgVertical          = 'center';
      var bgPosition          = bgWrapper.style.backgroundPosition.split(" ");

      if(bgPosition.length > 2){
        if(['left','center','right'].indexOf(bgPosition[0]) > -1) bgHorizontal = bgPosition[0];
        if(['top','center','bottom'].indexOf(bgPosition[1]) > -1) bgVertical = bgPosition[1];
        if(bgPosition[0].indexOf('px') > -1) bgHorizontal = parseInt(bgPosition[0].replace('px'));
        if(bgPosition[1].indexOf('px') > -1) bgVertical   = parseInt(bgPosition[1].replace('px'));
      }

      var a = container.getBoundingClientRect();
      var b = img.getBoundingClientRect();

      if(typeof bgHorizontal == "number"){
        img.style.marginLeft = bgHorizontal + "px";
      }else if( bgHorizontal == 'left'){
        img.style.marginLeft = 0 + "px";
      }else if( bgHorizontal == 'right'){
        img.style.marginLeft = (a.width  - b.width) + "px";
      }else{
        img.style.marginLeft = ( (a.width  - b.width)  / 2 )+ "px";
      }

      if(typeof bgVertical == "number"){
        img.style.marginTop = bgVertical + "px";
      }else if( bgVertical == 'left'){
        img.style.marginTop = 0 + "px";
      }else if( bgVertical == 'right'){
        img.style.marginTop = (a.height  - b.height) + "px";
      }else{
        img.style.marginTop = ( (a.height  - b.height)  / 2 )+ "px";
      }

    }

  }

  // ON VIEWPORT RESIZE
  var onResize = function(){
    if(automaticSizes) setElementSizes(img);
    if(mimicBackground) simulateBG(img);
    if(maxWindowSize < window.innerWidth){
      maxWindowSize = window.innerWidth;
      updateSources();
    }
  }


  // ON IMAGE LOAD
  var onLoad = function(){
    if(mimicBackground) simulateBG(img);
  }


  // ON VIEWPORT PROXIMITY
  var onProximity = function(){
    // CALCULATE ELEMENT SIZES ATTRIBUTE
    if(automaticSizes) setElementSizes();
    if(mimicBackground) simulateBG(img);
    updateSources();
    var tmo;
    window.addEventListener("resize",function(){
    	clearTimeout(tmo);
      tmo = setTimeout(onResize,100);
    });
    img.addEventListener("load",onLoad);
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
