//main file

ARTGEN = {};

/* 
 * starts the art generator
 */
ARTGEN.init = function() {
    console.log("Starting ARTGEN");
};

//starts the collection of brushes
ARTGEN.brushes = new Collection(baseBrush);

//starts the collection of painters
ARTGEN.painters = new Collection(basePainter);

/* 
 * adds a new brush to the collection
 * Alias for ARTGEN.brushes.add
 * @param {String} name Name of the new brush
 * @param {String|Object} extend Name of brush to extend from or methods
 * @param {Object} methods Methods of the new brush
 */
ARTGEN.addBrush = function(name, extend, method) {
	this.brushes.add(name, extend, method);
};

/* 
 * adds a new painter to the collection
 * Alias for ARTGEN.painters.add
 * @param {String} name Name of the new painter
 * @param {String|Object} extend Name of painter to extend from or methods
 * @param {Object} methods Methods of the new painter
 */
ARTGEN.addPainter = function(name, extend, method) {
	this.painters.add(name, extend, method);
};