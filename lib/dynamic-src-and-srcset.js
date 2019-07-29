PicturePerfect.prototype.getDynamicEndpoint = function(url,params){
  if(!url) return;
  params  = params  || {};
  if(!params.density) params.density = "1";
  params.density = parseFloat(params.density);
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
  return {url : url, params : params};
}

PicturePerfect.prototype.extractDynamicSourceOptions = function(el){
  return {
    dynamicSrcSetDensities : el.getAttribute('dynamic-srcset-densities') || ["1"],
    dynamicSrcDensity      : el.getAttribute('dynamic-src-density') || "1",
    dynamicSrc             : el.getAttribute('dynamic-src') || "",
    dynamicSrcSet          : el.getAttribute('dynamic-srcset') || "",
    mime                   : (node.getAttribute("type") || "").replace("image/","")
  };
}

PicturePerfect.prototype.updateSources = function(img){
  var parent   = img.parentElement;
  var defaults = {};
  var elements = [img];

  if( parent && /picture/gi.test(parent.tagName) ){
    defaults = self.extractDynamicSourceOptions(parent);
    for(var i = 0; i < parent.childNodes.length; i++){
      elements.push(picture.childNodes[i]);
    };
  }

  elements.forEach(function(node){
    var options = Object.assign(defaults,self.extractDynamicSourceOptions(node));

    if(options.dynamicSrc){
      var params   = { density : options.dynamicSrcDensity };
      var endpoint = self.getDynamicEndpoint(options.dynamicSrc,params);
      node.setAttribute("src",endpoint.url);
    }

    if(options.dynamicSrcSet){
      var srcset = [];
      options.dynamicSrcSetDensities.split(',').forEach(function(density){
        var params   = { density : density };
        var endpoint = self.getDynamicEndpoint(options.dynamicSrcSet,params);
        srcset.push( endpoint.url + " "+ endpoint.params.width +"w" );
      });
      node.setAttribute("srcset",srcset.join(","));
    }

  });
}
