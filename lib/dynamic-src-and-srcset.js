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
