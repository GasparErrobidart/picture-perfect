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
    dynamicSrcDensity                   : el.getAttribute('dynamic-src-density') || window.devicePixelRatio,
    dynamicSrc                          : el.getAttribute('dynamic-src') || "",
    dynamicSrcSetDensities              : el.getAttribute('dynamic-srcset-densities') || [window.devicePixelRatio],
    dynamicSrcSet                       : el.getAttribute('dynamic-srcset') || "",
    dynamicBackgroundImageDensity       : el.getAttribute('dynamic-background-url-density') || window.devicePixelRatio,
    dynamicBackgroundImage              : el.getAttribute('dynamic-background-image') || "",
    mime                                : (node.getAttribute("type") || "").replace("image/","")
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
    ['dynamicSrc','dynamicBackgroundImage'].forEach(function(key){
      if(options[key]){
        var params   = { density : options[key+"Density"] };
        var endpoint = self.getDynamicEndpoint(options[key],params);
        if(key == 'dynamicSrc') node.setAttribute('src',endpoint.url);
        else node.style.backgroundImage = "url(\""+endpoint.url+"\")";
      }
    });
    
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
