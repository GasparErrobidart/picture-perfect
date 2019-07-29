PicturePerfect.prototype.getDynamicEndpoint = function(url,params){
  if(!url) return;
  params  = params  || {};
  if(!params.density) params.density = 1;
  var rect = self.img.getBoundingClientRect();
  var elementWidth 	  = Math.ceil(rect.width)  || 100;
  var elementHeight 	= Math.ceil(rect.height);
  params.rawWidth  = rect.width;
  params.rawHeight = rect.height;
  params.width  = Math.ceil(elementWidth * density);
  params.height = Math.ceil(elementHeight * density);
  Object.keys(params).forEach(function(key){
    url = url.replace("${"+key+"}");
  });
  return url;
}

PicturePerfect.prototype.updateSources = function(el){
  var parent = img.parentElement;
  var defaults = {};
  if( parent && /picture/gi.test(parent.tagName) ){
    defaults.dynamicSrcSetDensities = (img.getAttribute('data-densities') || "1").split(",").map( function(n) {return parseFloat(n)});
    defaults.dynamicSrc = img.getAttribute('data-dynamic-url') || "";
    defaults.dynamicSrcSet = img.getAttribute('data-dynamic-url') || "";
  }
  var automaticSrcset  = img.getAttribute("data-automatic-srcset") != "false" || true;
  var densities 		   = (img.getAttribute('data-densities') || "1").split(",").map( function(n) {return parseFloat(n)});
  var url						   = img.getAttribute('data-dynamic-url') || "";

}
