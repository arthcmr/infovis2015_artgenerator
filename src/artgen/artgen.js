//main file

var ARTGEN = {};

//starts the collection of brushes
ARTGEN._brushes = new Collection(baseBrush);

//starts the collection of painters
ARTGEN._painters = new Collection(basePainter);

/* 
 * adds a new brush to the collection
 * Alias for ARTGEN.brushes.add
 * @param {String} name Name of the new brush
 * @param {String|Object} extend Name of brush to extend from or methods
 * @param {Object} methods Methods of the new brush
 */
ARTGEN.addBrush = function(name, extend, method) {
    this._brushes.add(name, extend, method);
};

/* 
 * adds a new painter to the collection
 * Alias for ARTGEN.painters.add
 * @param {String} name Name of the new painter
 * @param {String|Object} extend Name of painter to extend from or methods
 * @param {Object} methods Methods of the new painter
 */
ARTGEN.addPainter = function(name, extend, method) {
    this._painters.add(name, extend, method);
};

/* 
 * starts the art generator
 */
ARTGEN.init = function(canvas_id, painter) {
    console.log("Starting ARTGEN on", canvas_id);

    var instance = {};
    //set up the canvas
    instance._canvas = document.getElementById(canvas_id);
    instance._ctx = instance._canvas.getContext('2d');

    instance._canvas.width = parseInt(instance._canvas.offsetWidth, 10);
    instance._canvas.height = parseInt(instance._canvas.offsetHeight, 10);

    //get the painter from the collection and initialize it
    var p = this._painters.get(painter);
    instance.painter = new p();
    instance.painter.init(instance._canvas, instance._ctx);
    instance.data = 0;

    //browser animation
    requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame
    })();

    cancelAnimFrame = window.cancelAnimationFrame;

    //public API for this instance

    /*
     * Start paining, which animates
     */
    instance.paint = function(time) {

        if (!time) {
            time = new Date().getTime();
        }
        var _this = this;
        this._animationFrame = requestAnimFrame(function() {
            _this.paint(new Date().getTime());
        });

        instance.painter.paint(time, instance.data);
    }
    
    /*
     * Stop paining
     */
    instance.stop = function() {
        cancelAnimFrame(this._animationFrame);
    }

    return instance;
};
