//Brushes collection

//starts a collection
function Collection (base) {
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
    var new_item = function() {};
    new_item.prototype = _.clone(_.extend({}, from.prototype, methods));
    new_item.prototype.constructor = from.prototype.constructor;
    this._items[name] = new_item;
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