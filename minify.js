const fs    = require('fs');
const join  = require('path').join;
const minify = require('minify');
const argv  =   require('minimist')(process.argv.slice(2));

const path    = argv.path || "./dist";
let files = fs.readdirSync(join(__dirname,path))
              .filter(name => /\.js$/.test(name) && !/\.min\.js$/.test(name));

(async()=>{

  for(let i = 0; i < files.length; i++){
    try{
      let name = files[i];
      let location = join(__dirname,path,name);
      console.log("Minifying:",location);
      let minified = await minify( location );
      fs.writeFileSync( location.replace(/\.js$/,'.min.js') , minified);
    }catch(e){
      console.error(e);
    }
  }

})()
