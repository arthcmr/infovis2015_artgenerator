//main file

ARTGEN = {};

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

    //set up the canvas
    var canvas  = document.getElementById(canvas_id);
    var ctx     = canvas.getContext('2d');

    canvas.width = parseInt(canvas.offsetWidth, 10);
    canvas.height = parseInt(canvas.offsetHeight, 10);

    this.painter = this._painters.get(painter);
    this.painter.init(canvas, ctx);

    var _this = this;
    return {
    	paint: function() {
    		_this.painter.paint();
    	}
    }
};
