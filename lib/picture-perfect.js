// Picture perfect constructor
function PicturePerfect(img,options){
  var self = this;
  self.img = img;
  // ON VIEWPORT PROXIMITY
  self.onProximity = function(){
    console.log("Proximity");
  }
}
