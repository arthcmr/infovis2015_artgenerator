//main file

ARTGEN = {};

/* 
 * starts the art generator
 */
ARTGEN.init = function() {
    console.log("Starting ARTGEN");
};

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