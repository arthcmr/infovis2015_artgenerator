Information Visualization DH2321
PROJECT 4

#Art Generator

##How to get started

To run this project, you need to have npm installed in your machine. Npm is the Node.js Package Manager, [available here](http://nodejs.org/).

Once you have that installed, simply run the following commands (terminal):

* Type in terminal `npm install`
* Type in terminal `bower install`
* Build the project typing `grunt dev`

#How to use the library
Include the dependencies: jQuery, Lodash and randomColor (optional), then include the Art Generator and NCSOUND.

```html
<script type="text/javascript" src="path/to/jquery.min.js"></script>
<script type="text/javascript" src="path/to/lodash.min.js"></script>
<script type="text/javascript" src="vendor/randomcolor/randomColor.js"></script>
<script type="text/javascript" src="artgen/artgen.js"></script>
<script type="text/javascript" src="ncsound/ncsound.js"></script>
```

###Instantiate and initialize

HTML:

```html
<canvas id="myAwesomePainting"></canvas>
```

JAVASCRIPT:

```javascript
//instantiate with canvasId and painter
var painter = ARTGEN.init("myAwesomePainting", "leonardo");

//play sound and connect data
NCSOUND.playSound('sounds/weather.mp3', function() {
    setInterval(function() {
    	//get data from NCSOUND every 10ms
        data = NCSOUND.getData(7)[0];
        painter.data = data;
    }, 10);
});
```