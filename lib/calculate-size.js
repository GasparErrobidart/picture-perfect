PicturePerfect.prototype.handPickSizeFor = function(el){
  return Math.ceil(( el.getBoundingClientRect().width / window.innerWidth) * 100) + "vw";
}

PicturePerfect.prototype.setElementSize = function(el){
  el.setAttribute("sizes",this.handPickSizeFor(el));
}
