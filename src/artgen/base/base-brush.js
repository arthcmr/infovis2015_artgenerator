//Base brush

/* 
 * base brush constructor
 * @param {Object} canvas canvas object
 * @param {Object} ctx Canvas context
 */
var baseBrush = function() {}

/* 
 * initializes a painter
 */
baseBrush.prototype.init = function(ctx) {
    this.isDrawing = false;
};

/* 
 * start method
 */
baseBrush.prototype.start = function(x,y) {
    this.isDrawing = true;
};

/* 
 * stop method
 */
baseBrush.prototype.stop = function() {
    this.isDrawing = false;
};

/* 
 * choose brush color
 */
baseBrush.prototype.setColor = function(color) {
    this.color = color;
};