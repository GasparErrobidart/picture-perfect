# Picture Perfect
### Drastically reduce page load times up to 90% + optimize image delivery
A tiny code snippet that enhances the picture HTML element.
Reduce your pages initial load times around 90%, without compromising your users experience.
Let Picture Perfect calculate the srcset and sizes of your images.

[Live demo](https://jsfiddle.net/7hxt3q8b/1/)


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

1. Download the files containing only the features you need. For this case I'll use `lazy-and-sizes-only.min.js`
2. Link the script or add the code inline (see more about initialization below)
```HTML
<script src="./dist/lazy-and-sizes-only.min.js"></script>
```
3. Implement `lazy-src` , `lazy-srcset` or both as you need, on your images.
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
4. Only thing left is you add some JS code to initialize `PicturePerfect`, there is a few methods you could use to initialize it here is a conservative way you can use:
```javascript
document.querySelectorAll('img').forEach(function(node){
  new PicturePerfect(node);
});
```

# Modules

## Lazy load
## Calculate sizes
## Dynamic endpoint sources
## Mimic background images

## Getting started

Import the snippet into your html file:
```HTML
<script src="main.min.js"></script>
```

Now you can start using the perfect picture:
```HTML
<!--
  Picture Perfect uses <picture> HTML tags to enhance your image delivery.
  You can provide options as HTML attribute for this tag:

  [data-dynamic-url]
    ${format} will be replaced dinamically with the current image format
    ${width} will be replaced dinamically with the current element width
  [data-densities]
    Provide a list of pixel density multipliers comma separated.
    Default : 1
    e.g.: "1,2,3,4" (this will become 1x, 2x, 3x, 4x the current element width)
  [data-automatic-sizes]
    Default: true
    Set to false to disable
  [data-automatic-srcset]
    Default: true
    Set to false to disable
  [proximityThreshold]
    How many pixels before the element gets into the viewport will trigger the lazy loader.
    Default: window.innerHeight/2
    e.g.: "300" (pixels)
    e.g.: "window.innerHeight / 3" (script to eval)
-->
<picture
  data-dynamic-url="https://placehold.it/${width}x${width}.${format}?text=${width}x${width}+${format}"
  data-densities="0.5,1,2,3,4"
  data-automatic-sizes="true"
  data-automatic-srcset="true"
  data-threshold="window.innerHeight / 3"
>

  <!--
    Here you can provide native source HTML elements, use media attributes and define srcset,size and type.
    For each source Picture Perfect will automatically calculate srcset and sizes based on your configuration.
    This allows you to specify multiple file formats and rules to display them.
    You can also add a "data-srcset" attribute, when the element gets close to the viewport the value of this
    attribute will be combined with the true srcset preventing larger images to load on the initial page load.
  -->
  <source srcset="https://placehold.it/50x50.webp?text=50x50+webp" type="image/webp">
  <source srcset="https://placehold.it/50x50.jpg?text=50x50+jpeg" type="image/jpeg">

  <!--
    This next <img> tag is your fallback and hast to be present.
    Add the "make-picture-perfect" attribute to indicate that you want to track this picture/img pair of tags.
  -->
  <img make-picture-perfect alt="fallback" src="https://placehold.it/50x50.jpg">

</picture>
```

## Initializing

#### Just in time

To initialize the plugin you can do it globally at the page load event or one by one for each image
Initializing `PicturePerfect` this way requires you to load the code on the `<head>`.
```HTML
<!-- ONE BY ONE AS THE ELEMENTS GET LOADED (RECOMMENDED) -->
...
  <picture>
    <img onload="JIT_PICTURE_PERFECT(this)" src="myimage.jpg" alt="test-image">
  </picture>
...
```

#### Vanilla javascript at page load

```javascript
// GLOBALLY INITIATED
window.addEventListener('load',function(){
  document.querySelectorAll('picture > img').forEach(PicturePerfect);
});

```

#### jQuery at page load

```javascript
// GLOBALLY INITIATED USING JQUERY
$(document).ready(function(){
  $('picture > img').each(function(){
    new PicturePerfect(this);
  })
})

```

## Support for old browsers

You can use [Picture fill](https://scottjehl.github.io/picturefill/) to support the <picture> tag on older browsers.
