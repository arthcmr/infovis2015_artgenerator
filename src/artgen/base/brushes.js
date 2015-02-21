//Brushes collection

//starts the collection
ARTGEN.brushes = {};

/* 
 * adds a new brush to the set
 * @param {String} name Name of the new brush
 * @param {String|Object} extend Name of brush to extend from or methods
 * @param {Object} methods Methods of the new brush
 */
ARTGEN.brushes.add = function(name, extend, methods) {
    
    //start collection if not existing
    this._brushes = this._brushes || {};

    //should extend or not
    var from;
    if (_.isUndefined(methods)) {
        methods = extend;
        from = baseBrush;
    } else {
        from = this._brushes[extend];
    }

    //validation
    if (!_.isString(name)) console.error('Brushes: Check the name of the brush. It must be a string'); 
    if (!_.isPlainObject(methods)) console.error('Brushes: Check the methods of the brush. It must be an object');
    if (_.has(this._brushes, name)) console.warn('Brushes: Overwriting... There was already a brush named', name);

    this._brushes[name] = _.extend(from, methods);
}

/* 
 * removes a brush from the set
 * @param {String} name Name of the new brush
 */
ARTGEN.brushes.remove = function(name) {
    delete this._brushes[name];
}

/* 
 * get a brush from the set
 * @param {String} name Name of the new brush
 * @returns {Object} the brush
 */
ARTGEN.brushes.get = function(name) {
    return this._brushes[name];
}