# Picture Perfect
### Drastically reduce page load times up to 90% + optimize image delivery
Boost your front end performance by optimizing how your images get delivered for no cost! Picture Perfect is a small library including a set of tools that can help improve your site's performance.

[LIVE DEMO](https://jsfiddle.net/jmtz39rn/2/)

## Features
✔ Lazy loading `src`.  
✔ Lazy loading `srcset`.  
✔ Lazy loading `background-image`.  
✔ Configurable threshold / viewport offset.  
✔ Automatic calculation of image sizes.  
✔ Dynamic source endpoint calculation of `src`.  
✔ Dynamic source endpoint calculation of `srcset`.  
✔ Dynamic source endpoint calculation of `background-image`.  
✔ Dynamic sources for multiple pixel densities.  
✔ Dynamic sources automatically detects pixel density.  
✔ URL string interpolation, gives you control to work on a performance budget.  
✔ Support for `<picture>` elements allows you to achieve:  
✔ Art direction, using `media` attributes.  
✔ Multiple image formats `JPEG`, `WEBP`, `PNG`.  
✔ Mimic background images with `<img>` tags and benefit from all of the above.  

## Quick start
Picture Perfect provides a set of tools not just a single optimization, I strongly recommend you read the rest of this document, see what it has to offer and decide what you want to implement and what you wanna left aside.

The quickest and easiest optimization you can achieve is lazy loading images, and calculate the "sizes" attribute, here is how:

1. **Select the features you want and download the code**, I recommend you get the file containing only the features you need. For this case I'll use `lazy-and-sizes-only.min.js`
2. **Link the script** or add the code inline (see more about initialization below)
```HTML
<script src="./dist/lazy-and-sizes-only.min.js"></script>
```
3. **Implement** `lazy-src` , `lazy-srcset` or both as you need, on your images.
```HTML
<!-- YOU SHOULD PROVIDE A TINY VERSION OF THE IMAGE IN "src" OR A GENERIC TINY PLACEHOLDER AND THE BIGGER VERSION IN `lazy-src` -->
<img
  class="responsive-img"
  lazy-src="https://placehold.it/1920x1920.jpg"
  src="https://placehold.it/80x80.jpg"
  alt="Lazy image src">

<!-- SAME METHOD APPLIES IF YOU'RE USING "srcset" -->
<img
  class="responsive-img"
  lazy-srcset="https://placehold.it/1920x1920.jpg 1920w,https://placehold.it/640x640.jpg 640w"
  src="https://placehold.it/80x80.jpg"
  sizes="100vw"
  alt="Lazy image srcset">
```
4. Only thing left is you add some JS code to **initialize** `PicturePerfect`, there is a few methods you could use to initialize it here is a conservative way you can use:
```javascript
document.querySelectorAll('img').forEach(function(node){
  new PicturePerfect(node);
});
```

# Modules
- All modules require the base picture perfect module to be included first. You can find its source code in `/lib/picture-perfect.js`. Bundle files already include the base module.
- All modules and features are compatible in between them. Source files and minified bundles are provided in this project, you can create your own bundle with just the features you need.
- All features are compatible with `<picture>` tags. It's highly recommended that you use `<picture>` tags to deliver next generation image formats like `WEBP` and "[art direct](https://simpl.info/pictureart/)" your images.

## Lazy load

Source file: `/lib/lazy-load.js`

This module will allow you to delay the load of full size images until the UI element is in or close to the viewport. You can reduce the initial page size and boost the page speed by providing only a tiny version of the real image.  

### Notes
- All other features benefit from this module, if you are lazy loading elements, any other Picture Perfect module initialization will be delayed until lazy load marks the element as "ready" preventing the use of unnecessary code processing.
- Initialized elements are marked with the `picture-perfect-ready` class name. You can use this for visual transitions.


### Pros
For example if you have a **2400x1200 image, that's a 2.8 megapixels** image. You could delay that by providing a let's say 120x60 tiny placeholder of just **0.0072 megapixels**. When the user gets close to that element the full size image will kick in and your users won't see the difference for most cases.

If you want to go a little further, you could create a default placeholder for your images, let's say a 40x40 "image-placeholder.jpeg" and use that for every single image you use lazy load. The user will download that one image just one time and use that from the browser's cache. A single request a super tiny tiny image if your architecture and the user connection are good you won't see the trick happening at all.


### Cons
As stated on the "Pros" section right above, the only drawback of this technique is that your users will see a low resolution/placeholder image if the full size image takes a long time to download, that **could be the result of serving huge images, having a not so fast architecture or just the user having a slow connection**. But **let's be honest** if any of those scenarios are taking place chances are that the user will have a worst experience by waiting from the star for all the images to be downloaded, adding up to the initial page load and degrading speed.


### Options
Options are provided through HTML attributes.

#### lazy-threshold

Type : `string | number | expression`  
Default : `window.innerHeight/2`  

Here you can provide a value of tolerance or offset in which the element lazy attributes will be activated. Setting it to `0` will result in the element being activated when the first pixel gets into the viewport. Setting it to `window.innerHeight` will activate the element when its first pixel distance to the viewport is equal to the viewport height.


Examples:
```HTML
<!-- FIXED VALUE 300 PIXELS IN THIS CASE -->
<img lazy-threshold="300" lazy-src="full-size-cool-image.jpg" src="placeholder.jpg" alt="">
<!-- AN EVALUATED EXPRESSION -->
<img lazy-threshold="window.innerHeight/2 - 100" lazy-src="full-size-cool-image.jpg" src="placeholder.jpg" >
```


#### lazy-src

Type : `string`  
Default : `null`  

When the element gets activated the value of this attribute will replace the value for `src`.

Examples:
```HTML
<img lazy-src="full-size-cool-image.jpg" src="placeholder.jpg" alt="">
```

#### lazy-srcset

Type : `string`  
Default : `null`  

When the element gets activated the value of this attribute will replace the value for `srcset`.

Examples:
```HTML
<img  
  lazy-srcset="full-size-cool-image-1920px.jpg 1920w, full-size-cool-image-1200px.jpg 1200w"   src="placeholder.jpg"  
  alt="">
```

#### lazy-background-image

Type : `string`  
Default : `null`  

When the element gets activated the value of this attribute will replace the value for CSS `background-image`.

Examples:
```HTML
<div
class="element-with-background"
style="background-image:url('placeholder.jpg')"
lazy-background-image="full-size-cool-image.jpg"></div>
```



## Calculate sizes

Source file: `/lib/calculate-sizes.js`

If you import this module, all initialized elements will automatically calculate the `sizes` attribute based on the current element width.  
You don't need to add any additional markup to make use of this feature, just include the module's code.

I recommend you set `sizes` to `1vw` by default to prevent the browser from requesting bigger image sizes:

```HTML
<!-- MARKUP BEFORE ELEMENT INITIALIZATION -->
<picture>
  <source
  lazy-srcset="full-size-cool-image-1920px.jpg 1920w, full-size-cool-image-1200px.jpg 1200w"   type="imgae/jpeg">  
  <img  
    class="responsive-img"  
    src="https://placehold.it/200x100.jpg?text=Calculate+Sizes+200x100+JPEG"  
    sizes="1vw">  
</picture>

<!-- MARKUP AFTER ELEMENT INITIALIZATION  IF THE IMAGE IS 400px WIDE ON A VIEWPORT 1300px WIDE-->
<picture>
  <source
  lazy-srcset="full-size-cool-image-1920px.jpg 1920w, full-size-cool-image-1200px.jpg 1200w"   type="imgae/jpeg">  
  <img  
    class="responsive-img"  
    src="https://placehold.it/200x100.jpg?text=Calculate+Sizes+200x100+JPEG"  
    sizes="31vw">  
</picture>
```


## Dynamic sources endpoint

Source file: `/lib/dynamic-src-and-srcset.js`

Similar to how `sizes` are automatically calculated, this module will interpolate a dynamic url to generate `dynamic-src`, `dynamic-srcset` and `dynamic-background-image`. It takes into consideration multiple pixel densities.

**NOTES**  
- If you're using `lazy` attributes that collide with the attributes from this module, this module has higher priority and will override what lazy load set as a value.
- You **MUST** specify the right `type` attribute for every DOM element (`div`,`img`,`source`,etc) that uses a dynamic url to make use of the `${mime}` variable value.

### Options
Options are provided through HTML attributes.

#### dynamic-src

Type : `string`  
Default : `null`  

Examples:
```HTML
<img
  dynamic-src="https://placehold.it/${width}x${height}.${mime}"
  src="https://placehold.it/200x100.jpg"
  type="image/jpeg"
  alt="Generate src dynamically">
```

#### dynamic-src-density

Type : `float`  
Default : `window.devicePixelRatio`

Pixel ratio is added to the mix to calculate the correct width and height.

Examples:
```HTML
<img
  dynamic-src-density="1.8"
  dynamic-src="https://placehold.it/${width}x${height}.${mime}"
  src="https://placehold.it/200x100.jpg"
  type="image/jpeg"
  alt="Generate src dynamically">
```

#### dynamic-srcset

Type : `string`  
Default : `null`  

Examples:
```HTML
<img
  dynamic-srcset="https://placehold.it/${width}x${height}.${mime}"
  src="https://placehold.it/200x100.jpg"
  type="image/jpeg"
  alt="Generate srcset dynamically">
```

#### dynamic-srcset-densities

Type : comma separated `float[]`  
Default : `window.devicePixelRatio`

Pixel ratio is added to the mix to calculate the correct width and height.

Examples:
```HTML
<img
  dynamic-srcset-densities="0.5,1.0,1.8,2.0,3.0"
  dynamic-srcset="https://placehold.it/${width}x${height}.${mime}"
  src="https://placehold.it/200x100.jpg"
  type="image/jpeg"
  alt="Generate srcset dynamically">
```

#### dynamic-background-image

Type : `string`  
Default : `null`  

Examples:
```HTML
<div
class="element-with-background"  
style="background-image:url('https://placehold.it/200x100.jpg')"  
dynamic-background-image="https://placehold.it/${width}x${height}.${mime}"></div>
```

#### dynamic-background-image-density

Type : `float`  
Default : `window.devicePixelRatio`

Pixel ratio is added to the mix to calculate the correct width and height.

Examples:
```HTML
<div  
dynamic-background-image-density="3.0"  
class="element-with-background"   
style="background-image:url('https://placehold.it/200x100.jpg')"  
dynamic-background-image="https://placehold.it/${width}x${height}.${mime}"></div>
```

### Picture tags using dynamic url
This is a special case you have `<img>`, `<source>` and `<picture>` tags all working as one. You can provide basic configuration on the `<picture>` tag all attributes defined here will be inherited by the child `<img>` and `<source>` elements. For example you can define `dynamic-srcset` on the `<picture>` tag and all the childs will imitate that value or you could override that inherited value on specific tags.

```HTML
<picture
  dynamic-srcset-densities="0.5,1.0,2.0,3.0,4.0"
  dynamic-srcset="https://placehold.it/${width}x400.${mime}?text=Dynamic+Source+${width}x400+${mime}">
  <!-- WEBP VERSIONS FIRST -->
  <source media="(min-width: 968px)" type="image/webp">
  <source
    dynamic-srcset="https://placehold.it/${width}x${width}.${mime}?text=Dynamic+Source+${width}x${width}+${mime}"
    type="image/webp">
  <!-- JPEG VERSIONS LAST -->
  <source media="(min-width: 968px)" type="image/jpeg">
  <source
    dynamic-srcset="https://placehold.it/${width}x${width}.${mime}?text=Dynamic+Source+${width}x${width}+${mime}"
    type="image/jpeg">
  <img
    class="responsive-img"
    onload="JIT_IMG(this)"
    src="https://placehold.it/200x100.jpg?text=Lazy+Load+200x100+JPEG"
    alt="Generate src dynamically"
    type="image/jpeg" > <!-- 'type' attribute must be specified always when using dynamic-src, dynamic-srcset or dynamic-background-image -->
</picture>
```

## Mimic background images using "img" tags

Source file: `/lib/mimic-background-image.js`

This is a mix solution using the CSS provided here at `/css/mimic-background-image.css` for basic styles and javascript code will calculate if the element should match its container height or width, this is for imitating `background-size`. It'll also calculare `left` / `top` attributes to mimic `background-position`.

You'll need 3 elements:
- The `<img>` (which could be part of a `<picture>`).
- A wrapper for the image tag `mimic-background-image-wrapper`, this element will assist resizing and repositioning the image and will apply the CSS `background-size` and `background-position` attributes.
- Finally a container that will rule the sizing and positiong of the wrapper+image `mimic-background-image-container`.

Examples:

```HTML
<div mimic-background-image-container>
  <h4  style="padding:105px 40px 200px 40px;width:100%;">THIS COULD BE A HEADLINE</h4>
  <div mimic-background-image-wrapper class="cover" style="background-position:center center">
    <img
      class="responsive-img"
      src="placeholder.jpg"
      lazy-src="full-size-cool-image.jpg"
      alt="Hi, I look like a background.">
  </div>
</div>
```

### Supported Options
Options are provided through CSS rules that applie to the wrapper element.

#### background-size

Type : `string`  
Default : `cover`  
Supports : `contain`, `cover`

#### background-position

Type : `string`  
Default : `center center`  
Supports : `left`, `center`, `right`, `top`, `bottom`, `pixels`, `percentage`  


## Initializing

#### Just in time

To initialize the plugin you can do it globally at the page load event or one by one for each image
Initializing `PicturePerfect` this way requires you to load the code on the `<head>`.
```HTML
<!-- ONE BY ONE AS THE ELEMENTS GET LOADED (RECOMMENDED) -->
...
  <picture>
    <img onload="JIT_IMG(this)" src="myimage.jpg" alt="test-image">
  </picture>
...
```

#### Vanilla javascript at page load

```javascript
// GLOBALLY INITIATED
window.addEventListener('load',function(){
  document.querySelectorAll('img, [lazy-background-image], [dynamic-background-image]').forEach(PicturePerfect);
});

```

#### jQuery at page load

```javascript
// GLOBALLY INITIATED USING JQUERY
$(document).ready(function(){
  $('img, [lazy-background-image], [dynamic-background-image]').each(function(){
    new PicturePerfect(this);
  })
})

```

## Support for old browsers

- You can use [Picture fill](https://scottjehl.github.io/picturefill/) to support the <picture> tag on older browsers.
- Picture Perfect uses the `Element.closest()` method you can include a polyfill for IE9+ that's provided in `/polyfills/closest.js`.

I recommend you include polyfills like this on the `<head>`:
```HTML
<!-- SUPPORT FOR IE9+ -->
<!--[if IE]>
<script src="https://cdn.rawgit.com/scottjehl/picturefill/3.0.2/dist/picturefill.min.js"></script>
<script src="polyfills/closest.js"></script>
<![endif]-->
```
