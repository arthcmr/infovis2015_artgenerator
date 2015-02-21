//Brushes collection

//starts a collection
var Collection = function(base) {
    this._base = base;
};

/* 
 * adds a new item to the set
 * @param {String} name Name of the new item
 * @param {String|Object} extend Name of item to extend from
 * @param {Object} methods Methods of the new item
 */
Collection.prototype.add = function(name, extend, methods) {
    
    //start collection if not existing
    this._items = this._items || {};

    //should it extend or not?
    var from;
    if (_.isUndefined(methods)) {
        methods = extend;
        from = this._base;
    } else {
        from = this._items[extend];
    }

    //add item
    this._items[name] = _.extend(from, methods);
}

/* 
 * removes an item from the collection
 * @param {String} name Name of the new item
 */
Collection.prototype.remove = function(name) {
    delete this._items[name];
}

/* 
 * gets an item from the collection
 * @param {String} name Name of the new item
 * @returns {Object} the item
 */
Collection.prototype.get = function(name) {
    return this._items[name];
}