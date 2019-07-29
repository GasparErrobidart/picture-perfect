
// Picture perfect

function PicturePerfect(img){
  // CONFIGURATION
  var picture             = img.parentElement;
  // var maxWindowSize       = window.innerWidth;
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


  var automaticSrcset     = picture.getAttribute("data-automatic-srcset") !== "false" || true;
  var densities 		      = (picture.getAttribute('data-densities') || "1").split(",").map( function(n) {return parseFloat(n)});
  var url						      = picture.getAttribute('data-dynamic-url') || "";
  var mimicBackground     = picture.getAttribute("data-mimic-background") !== "false" || true;



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

      var style               = bgWrapper.currentStyle || window.getComputedStyle(bgWrapper);
      var bgCover             = style.backgroundSize == "cover";
      var bgContain           = style.backgroundSize == "contain";

      var bgPosition          = style.backgroundPosition.split(" ");
      var bgHorizontal        = bgPosition[0];
      var bgVertical          = bgPosition[1];


      console.log(bgPosition);

      // if(bgPosition.length >= 2){
      //   if(bgPosition[0].indexOf('px') > -1) bgHorizontal = parseInt(bgPosition[0].replace('px'));
      //   else if(bgPosition[0].indexOf('%') > -1) bgHorizontal = parseFloat(bgPosition[0].replace('%'));
      //   else if(['left','center','right'].indexOf(bgPosition[0]) > -1) bgHorizontal = bgPosition[0];
      //   if(['top','center','bottom'].indexOf(bgPosition[1]) > -1) bgVertical = bgPosition[1];
      //   else if(bgPosition[1].indexOf('%') > -1) bgHorizontal = parseFloat(bgPosition[1].replace('%'));
      //   else if(bgPosition[1].indexOf('px') > -1) bgVertical  = parseInt(bgPosition[1].replace('px'));
      // }

      var a = container.getBoundingClientRect();
      var b = img.getBoundingClientRect();
      var width_if_height_was_100 = (b.width/b.height) * a.height;
      var height_if_width_was_100 = (b.height/b.width) * a.width;
      var newWidth = a.width;
      var newHeight = a.height;


      // MIMIC BACKGROUND COVER
      if(bgCover){
        if(width_if_height_was_100 >= a.width){
          newWidth = width_if_height_was_100;
        }else{
          newHeight = (b.height/b.width) * a.width;
        }
        img.style.width   = width_if_height_was_100 >= a.width  ? "auto" : "100%";
        img.style.height  = width_if_height_was_100 >= a.width  ? "100%" : "auto";
      }

      // MIMIC BACKGROUND CONTAIN
      else if(bgContain){
        if(width_if_height_was_100 >= a.width){
          newHeight = (b.height/b.width) * a.width;
        }else{
          newWidth = width_if_height_was_100;
        }
        img.style.width   = width_if_height_was_100 >= a.width  ? "100%" : "auto";
        img.style.height  = width_if_height_was_100 >= a.width  ? "auto" : "100%";
      }



      console.log("bgPosition",bgHorizontal,bgVertical);

      // MIMI BACKGROUND POSITION
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


}
